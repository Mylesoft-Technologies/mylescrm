import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// ── Invoices ───────────────────────────────────────────────

export const listInvoices = query({
  args: {
    orgId: v.id("organizations"),
    status: v.optional(v.string()),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
  },
  handler: async (ctx, args) => {
    let invoices = await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(100);

    if (args.status) invoices = invoices.filter((i) => i.status === args.status);
    if (args.contactId) invoices = invoices.filter((i) => i.contactId === args.contactId);
    if (args.companyId) invoices = invoices.filter((i) => i.companyId === args.companyId);

    return Promise.all(
      invoices.map(async (inv) => {
        const contact = inv.contactId ? await ctx.db.get(inv.contactId) : null;
        const company = inv.companyId ? await ctx.db.get(inv.companyId) : null;
        return { ...inv, contact, company };
      })
    );
  },
});

export const getInvoice = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, { invoiceId }) => {
    const invoice = await ctx.db.get(invoiceId);
    if (!invoice) return null;
    const contact = invoice.contactId ? await ctx.db.get(invoice.contactId) : null;
    const company = invoice.companyId ? await ctx.db.get(invoice.companyId) : null;
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", invoiceId))
      .collect();
    return { ...invoice, contact, company, payments };
  },
});

export const createInvoice = mutation({
  args: {
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    dealId: v.optional(v.id("deals")),
    currency: v.string(),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      taxRate: v.optional(v.number()),
      total: v.number(),
    })),
    discount: v.optional(v.number()),
    dueAt: v.number(),
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate invoice number
    const count = await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    const invoiceNumber = `INV-${String(count.length + 1).padStart(4, "0")}`;

    const subtotal = args.lineItems.reduce((s, li) => s + li.total, 0);
    const taxAmount = args.lineItems.reduce(
      (s, li) => s + li.total * ((li.taxRate ?? 0) / 100),
      0
    );
    const total = subtotal + taxAmount - (args.discount ?? 0);

    const now = Date.now();
    return ctx.db.insert("invoices", {
      orgId: args.orgId,
      createdBy: args.createdBy,
      contactId: args.contactId,
      companyId: args.companyId,
      dealId: args.dealId,
      invoiceNumber,
      status: "draft",
      currency: args.currency,
      lineItems: args.lineItems,
      subtotal,
      taxAmount,
      discount: args.discount,
      total,
      paidAmount: 0,
      dueAt: args.dueAt,
      notes: args.notes,
      terms: args.terms,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const markInvoiceSent = mutation({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, { invoiceId }) => {
    await ctx.db.patch(invoiceId, {
      status: "sent",
      sentAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const recordPayment = mutation({
  args: {
    orgId: v.id("organizations"),
    invoiceId: v.id("invoices"),
    contactId: v.optional(v.id("contacts")),
    method: v.string(),
    amount: v.number(),
    currency: v.string(),
    reference: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    mpesaReceiptNumber: v.optional(v.string()),
    mpesaTransactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const now = Date.now();
    const paymentId = await ctx.db.insert("payments", {
      orgId: args.orgId,
      invoiceId: args.invoiceId,
      contactId: args.contactId,
      method: args.method as any,
      status: "completed",
      amount: args.amount,
      currency: args.currency,
      reference: args.reference,
      stripePaymentIntentId: args.stripePaymentIntentId,
      mpesaReceiptNumber: args.mpesaReceiptNumber,
      mpesaTransactionId: args.mpesaTransactionId,
      paidAt: now,
      createdAt: now,
    });

    const newPaidAmount = invoice.paidAmount + args.amount;
    const newStatus = newPaidAmount >= invoice.total ? "paid" : "partial";

    await ctx.db.patch(args.invoiceId, {
      paidAmount: newPaidAmount,
      status: newStatus,
      paidAt: newStatus === "paid" ? now : undefined,
      updatedAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      orgId: args.orgId,
      type: "payment_received",
      contactId: args.contactId,
      userId: invoice.createdBy,
      title: `Payment of ${args.currency} ${args.amount.toLocaleString()} received`,
      description: `Invoice ${invoice.invoiceNumber} — ${args.method}`,
      status: "completed",
      completedAt: now,
      metadata: { method: args.method, reference: args.reference },
      createdAt: now,
      updatedAt: now,
    });

    return paymentId;
  },
});

// ── M-Pesa STK Push ────────────────────────────────────────

export const initiateMpesaPayment = action({
  args: {
    orgId: v.id("organizations"),
    invoiceId: v.id("invoices"),
    phone: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, { orgId, invoiceId, phone, amount }): Promise<{ checkoutRequestId: string; merchantRequestId: string }> => {
    // Get M-Pesa access token
    const tokenRes = await fetch(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
          ).toString("base64")}`,
        },
      }
    );
    const { access_token } = await tokenRes.json();

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // Normalize phone: 0722... → 254722...
    const normalizedPhone = phone.startsWith("0")
      ? `254${phone.slice(1)}`
      : phone.startsWith("+")
      ? phone.slice(1)
      : phone;

    const stkRes = await fetch(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.ceil(amount),
          PartyA: normalizedPhone,
          PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
          PhoneNumber: normalizedPhone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: `INV-${invoiceId.slice(-6).toUpperCase()}`,
          TransactionDesc: "MylesCRM Invoice Payment",
        }),
      }
    );

    const stkData = await stkRes.json();
    if (!stkRes.ok || stkData.ResponseCode !== "0") {
      throw new Error(`M-Pesa error: ${stkData.errorMessage ?? stkData.ResponseDescription}`);
    }

    // Save checkoutRequestId to invoice
    await ctx.runMutation(api.payments.updateInvoiceMpesa, {
      invoiceId,
      checkoutRequestId: stkData.CheckoutRequestID,
    });

    return {
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
    };
  },
});

export const updateInvoiceMpesa = mutation({
  args: {
    invoiceId: v.id("invoices"),
    checkoutRequestId: v.string(),
  },
  handler: async (ctx, { invoiceId, checkoutRequestId }) => {
    await ctx.db.patch(invoiceId, {
      mpesaCheckoutRequestId: checkoutRequestId,
      updatedAt: Date.now(),
    });
  },
});

export const getRevenueStats = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const paid = invoices.filter((i) => i.status === "paid");
    const overdue = invoices.filter(
      (i) => ["sent", "viewed", "partial"].includes(i.status) && i.dueAt < now
    );

    return {
      totalRevenue: paid.reduce((s, i) => s + i.total, 0),
      revenueThisMonth: paid
        .filter((i) => i.paidAt && i.paidAt > thisMonthStart.getTime())
        .reduce((s, i) => s + i.total, 0),
      outstandingAmount: invoices
        .filter((i) => ["sent", "viewed", "partial"].includes(i.status))
        .reduce((s, i) => s + (i.total - i.paidAmount), 0),
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((s, i) => s + (i.total - i.paidAmount), 0),
      totalInvoices: invoices.length,
      paidInvoices: paid.length,
    };
  },
});
