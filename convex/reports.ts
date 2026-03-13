import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSalesSummary = query({
  args: {
    orgId: v.id("organizations"),
    fromDate: v.optional(v.number()),
    toDate: v.optional(v.number()),
  },
  handler: async (ctx, { orgId, fromDate, toDate }) => {
    const now = Date.now();
    const from = fromDate ?? now - 30 * 24 * 60 * 60 * 1000;
    const to = toDate ?? now;

    const [contacts, companies, deals, activities] = await Promise.all([
      ctx.db.query("contacts").withIndex("by_org", q => q.eq("orgId", orgId)).filter(q => q.eq(q.field("isArchived"), false)).collect(),
      ctx.db.query("companies").withIndex("by_org", q => q.eq("orgId", orgId)).filter(q => q.eq(q.field("isArchived"), false)).collect(),
      ctx.db.query("deals").withIndex("by_org", q => q.eq("orgId", orgId)).filter(q => q.eq(q.field("isArchived"), false)).collect(),
      ctx.db.query("activities").withIndex("by_org", q => q.eq("orgId", orgId)).order("desc").take(500),
    ]);

    const wonDeals = deals.filter(d => d.status === "won" && d.actualCloseDate && d.actualCloseDate >= from && d.actualCloseDate <= to);
    const openDeals = deals.filter(d => d.status === "open");
    const newContacts = contacts.filter(c => c.createdAt >= from && c.createdAt <= to);

    // Monthly revenue breakdown (last 12 months)
    const monthlyRevenue: Record<string, number> = {};
    deals.filter(d => d.status === "won" && d.actualCloseDate).forEach(deal => {
      const date = new Date(deal.actualCloseDate!);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyRevenue[key] = (monthlyRevenue[key] ?? 0) + deal.value;
    });

    return {
      totalContacts: contacts.length,
      totalCompanies: companies.length,
      newContacts: newContacts.length,
      openDeals: openDeals.length,
      openPipelineValue: openDeals.reduce((s, d) => s + d.value, 0),
      wonDeals: wonDeals.length,
      wonRevenue: wonDeals.reduce((s, d) => s + d.value, 0),
      avgDealSize: wonDeals.length > 0 ? wonDeals.reduce((s, d) => s + d.value, 0) / wonDeals.length : 0,
      totalActivities: activities.filter(a => a.createdAt >= from && a.createdAt <= to).length,
      monthlyRevenue: Object.entries(monthlyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, revenue]) => ({ month, revenue })),
    };
  },
});

export const listReports = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    return ctx.db.query("reports").withIndex("by_org", q => q.eq("orgId", orgId)).collect();
  },
});

export const saveReport = mutation({
  args: {
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    config: v.any(),
    isShared: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("reports", {
      orgId: args.orgId,
      createdBy: args.createdBy,
      name: args.name,
      description: args.description,
      type: args.type as any,
      config: args.config,
      isShared: args.isShared ?? false,
      isPinned: args.isPinned ?? false,
      lastRunAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});
