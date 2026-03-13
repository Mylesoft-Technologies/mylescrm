import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// ── Queries ────────────────────────────────────────────────

export const list = query({
  args: {
    orgId: v.id("organizations"),
    status: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    companyId: v.optional(v.id("companies")),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("contacts")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("isArchived"), false));

    const contacts = await q.collect();

    let filtered = contacts;
    if (args.status) filtered = filtered.filter((c) => c.status === args.status);
    if (args.assignedTo) filtered = filtered.filter((c) => c.assignedTo === args.assignedTo);
    if (args.companyId) filtered = filtered.filter((c) => c.companyId === args.companyId);
    if (args.search) {
      const s = args.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(s) ||
          c.lastName.toLowerCase().includes(s) ||
          c.email?.toLowerCase().includes(s) ||
          c.phone?.includes(s)
      );
    }

    filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    const limit = args.limit ?? 50;
    return filtered.slice(0, limit);
  },
});

export const get = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, { contactId }) => {
    const contact = await ctx.db.get(contactId);
    if (!contact) return null;

    // Enrich with related data
    const company = contact.companyId ? await ctx.db.get(contact.companyId) : null;
    const assignee = contact.assignedTo ? await ctx.db.get(contact.assignedTo) : null;
    const leadScore = await ctx.db
      .query("lead_scores")
      .withIndex("by_contact", (q) => q.eq("contactId", contactId))
      .first();

    const deals = await ctx.db
      .query("deals")
      .withIndex("by_contact", (q) => q.eq("contactId", contactId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_contact", (q) => q.eq("contactId", contactId))
      .order("desc")
      .take(20);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_deal", (q) => q.eq("dealId", undefined as any))
      .filter((q) => q.eq(q.field("contactId" as any), contactId))
      .collect();

    return { ...contact, company, assignee, leadScore, deals, activities, tasks };
  },
});

export const getStats = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    return {
      total: contacts.length,
      leads: contacts.filter((c) => c.status === "lead").length,
      prospects: contacts.filter((c) => c.status === "prospect").length,
      customers: contacts.filter((c) => c.status === "customer").length,
      newThisMonth: contacts.filter((c) => c.createdAt > thirtyDaysAgo).length,
    };
  },
});

// ── Mutations ──────────────────────────────────────────────

export const create = mutation({
  args: {
    orgId: v.id("organizations"),
    companyId: v.optional(v.id("companies")),
    assignedTo: v.optional(v.id("users")),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    mobile: v.optional(v.string()),
    title: v.optional(v.string()),
    department: v.optional(v.string()),
    status: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    address: v.optional(v.any()),
    social: v.optional(v.any()),
    customFields: v.optional(v.any()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const contactId = await ctx.db.insert("contacts", {
      orgId: args.orgId,
      companyId: args.companyId,
      assignedTo: args.assignedTo,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      mobile: args.mobile,
      title: args.title,
      department: args.department,
      status: (args.status as any) ?? "lead",
      source: args.source,
      tags: args.tags ?? [],
      notes: args.notes,
      address: args.address,
      social: args.social,
      customFields: args.customFields,
      isArchived: false,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      orgId: args.orgId,
      type: "contact_created",
      contactId,
      userId: args.createdBy,
      title: `Contact ${args.firstName} ${args.lastName} created`,
      status: "completed",
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Create notification for assignee
    if (args.assignedTo && args.assignedTo !== args.createdBy) {
      await ctx.db.insert("notifications", {
        orgId: args.orgId,
        userId: args.assignedTo,
        type: "contact_assigned",
        title: "New contact assigned",
        message: `${args.firstName} ${args.lastName} has been assigned to you`,
        link: `/dashboard/contacts/${contactId}`,
        isRead: false,
        createdAt: now,
      });
    }

    return contactId;
  },
});

export const update = mutation({
  args: {
    contactId: v.id("contacts"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    mobile: v.optional(v.string()),
    title: v.optional(v.string()),
    department: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    assignedTo: v.optional(v.id("users")),
    status: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    address: v.optional(v.any()),
    social: v.optional(v.any()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, { contactId, ...updates }) => {
    const existing = await ctx.db.get(contactId);
    if (!existing) throw new Error("Contact not found");

    await ctx.db.patch(contactId, { ...updates, updatedAt: Date.now() });
    return contactId;
  },
});

export const archive = mutation({
  args: { contactId: v.id("contacts"), userId: v.id("users") },
  handler: async (ctx, { contactId, userId }) => {
    await ctx.db.patch(contactId, { isArchived: true, updatedAt: Date.now() });
  },
});

export const bulkCreate = mutation({
  args: {
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    contacts: v.array(v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      title: v.optional(v.string()),
      companyName: v.optional(v.string()),
      source: v.optional(v.string()),
    })),
  },
  handler: async (ctx, { orgId, createdBy, contacts }) => {
    const now = Date.now();
    const ids = [];
    for (const contact of contacts) {
      const id = await ctx.db.insert("contacts", {
        orgId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        title: contact.title,
        source: contact.source ?? "import",
        status: "lead",
        tags: [],
        isArchived: false,
        createdBy,
        createdAt: now,
        updatedAt: now,
      });
      ids.push(id);
    }
    return ids;
  },
});

export const updateLastContacted = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, { contactId }) => {
    await ctx.db.patch(contactId, { lastContactedAt: Date.now(), updatedAt: Date.now() });
  },
});
