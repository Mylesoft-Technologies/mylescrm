import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listEmailMessages = query({
  args: {
    orgId: v.id("organizations"),
    contactId: v.optional(v.id("contacts")),
    dealId: v.optional(v.id("deals")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let emails = await ctx.db
      .query("email_messages")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(args.limit ?? 50);

    if (args.contactId) emails = emails.filter((e) => e.contactId === args.contactId);
    if (args.dealId) emails = emails.filter((e) => e.dealId === args.dealId);
    return emails;
  },
});

export const saveEmailMessage = mutation({
  args: {
    orgId: v.id("organizations"),
    contactId: v.optional(v.id("contacts")),
    dealId: v.optional(v.id("deals")),
    sentBy: v.id("users"),
    resendId: v.optional(v.string()),
    direction: v.string(),
    from: v.string(),
    to: v.array(v.string()),
    cc: v.optional(v.array(v.string())),
    bcc: v.optional(v.array(v.string())),
    subject: v.string(),
    body: v.string(),
    status: v.optional(v.string()),
    templateId: v.optional(v.id("email_templates")),
    sentAt: v.optional(v.number()),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("email_messages", {
      orgId: args.orgId,
      contactId: args.contactId,
      dealId: args.dealId,
      sentBy: args.sentBy,
      resendId: args.resendId,
      direction: args.direction as "outbound" | "inbound",
      from: args.from,
      to: args.to,
      cc: args.cc,
      bcc: args.bcc,
      subject: args.subject,
      body: args.body,
      status: (args.status as any) ?? "sent",
      templateId: args.templateId,
      sentAt: args.sentAt ?? now,
      scheduledAt: args.scheduledAt,
      createdAt: now,
    });
  },
});

export const listTemplates = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    return ctx.db
      .query("email_templates")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const createTemplate = mutation({
  args: {
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isShared: v.optional(v.boolean()),
    variables: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("email_templates", {
      orgId: args.orgId,
      createdBy: args.createdBy,
      name: args.name,
      subject: args.subject,
      body: args.body,
      category: args.category,
      tags: args.tags ?? [],
      isShared: args.isShared ?? false,
      variables: args.variables ?? [],
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateEmailStatus = mutation({
  args: {
    messageId: v.id("email_messages"),
    status: v.string(),
    openedAt: v.optional(v.number()),
    clickedAt: v.optional(v.number()),
  },
  handler: async (ctx, { messageId, status, openedAt, clickedAt }) => {
    await ctx.db.patch(messageId, {
      status: status as any,
      openedAt,
      clickedAt,
    });
  },
});
