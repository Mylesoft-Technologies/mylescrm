import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    orgId: v.id("organizations"),
    pipelineId: v.optional(v.id("pipelines")),
    stageId: v.optional(v.id("pipeline_stages")),
    status: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
  },
  handler: async (ctx, args) => {
    let deals = await ctx.db
      .query("deals")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    if (args.pipelineId) deals = deals.filter((d) => d.pipelineId === args.pipelineId);
    if (args.stageId) deals = deals.filter((d) => d.stageId === args.stageId);
    if (args.status) deals = deals.filter((d) => d.status === args.status);
    if (args.assignedTo) deals = deals.filter((d) => d.assignedTo === args.assignedTo);
    if (args.contactId) deals = deals.filter((d) => d.contactId === args.contactId);
    if (args.companyId) deals = deals.filter((d) => d.companyId === args.companyId);

    // Enrich with stage and contact info
    const enriched = await Promise.all(
      deals.map(async (deal) => {
        const stage = await ctx.db.get(deal.stageId);
        const contact = deal.contactId ? await ctx.db.get(deal.contactId) : null;
        const company = deal.companyId ? await ctx.db.get(deal.companyId) : null;
        const assignee = await ctx.db.get(deal.assignedTo);
        return { ...deal, stage, contact, company, assignee };
      })
    );

    return enriched.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getKanban = query({
  args: { orgId: v.id("organizations"), pipelineId: v.id("pipelines") },
  handler: async (ctx, { orgId, pipelineId }) => {
    const stages = await ctx.db
      .query("pipeline_stages")
      .withIndex("by_pipeline", (q) => q.eq("pipelineId", pipelineId))
      .collect();

    stages.sort((a, b) => a.order - b.order);

    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_pipeline", (q) => q.eq("pipelineId", pipelineId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("status"), "open")
        )
      )
      .collect();

    // Enrich deals
    const enrichedDeals = await Promise.all(
      allDeals.map(async (deal) => {
        const contact = deal.contactId ? await ctx.db.get(deal.contactId) : null;
        const company = deal.companyId ? await ctx.db.get(deal.companyId) : null;
        return { ...deal, contact, company };
      })
    );

    return stages.map((stage) => ({
      ...stage,
      deals: enrichedDeals.filter((d) => d.stageId === stage._id),
      totalValue: enrichedDeals
        .filter((d) => d.stageId === stage._id)
        .reduce((sum, d) => sum + d.value, 0),
    }));
  },
});

export const get = query({
  args: { dealId: v.id("deals") },
  handler: async (ctx, { dealId }) => {
    const deal = await ctx.db.get(dealId);
    if (!deal) return null;

    const stage = await ctx.db.get(deal.stageId);
    const pipeline = await ctx.db.get(deal.pipelineId);
    const contact = deal.contactId ? await ctx.db.get(deal.contactId) : null;
    const company = deal.companyId ? await ctx.db.get(deal.companyId) : null;
    const assignee = await ctx.db.get(deal.assignedTo);

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .order("desc")
      .take(30);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .filter((q) => q.neq(q.field("status"), "done"))
      .collect();

    const emails = await ctx.db
      .query("email_messages")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .order("desc")
      .take(20);

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .collect();

    return { ...deal, stage, pipeline, contact, company, assignee, activities, tasks, emails, invoices };
  },
});

export const getStats = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const open = deals.filter((d) => d.status === "open");
    const won = deals.filter((d) => d.status === "won");
    const wonThisMonth = won.filter((d) => d.actualCloseDate && d.actualCloseDate > thisMonthStart.getTime());

    return {
      totalOpen: open.length,
      totalOpenValue: open.reduce((s, d) => s + d.value, 0),
      totalWon: won.length,
      totalWonValue: won.reduce((s, d) => s + d.value, 0),
      wonThisMonth: wonThisMonth.length,
      wonValueThisMonth: wonThisMonth.reduce((s, d) => s + d.value, 0),
      avgDealSize: won.length > 0 ? won.reduce((s, d) => s + d.value, 0) / won.length : 0,
      winRate: deals.filter((d) => d.status !== "open").length > 0
        ? (won.length / deals.filter((d) => d.status !== "open").length) * 100
        : 0,
      newThisMonth: deals.filter((d) => d.createdAt > thirtyDaysAgo).length,
    };
  },
});

export const create = mutation({
  args: {
    orgId: v.id("organizations"),
    pipelineId: v.id("pipelines"),
    stageId: v.id("pipeline_stages"),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    assignedTo: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    value: v.number(),
    currency: v.string(),
    probability: v.optional(v.number()),
    expectedCloseDate: v.optional(v.number()),
    source: v.optional(v.string()),
    priority: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    customFields: v.optional(v.any()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const stage = await ctx.db.get(args.stageId);
    const now = Date.now();

    const dealId = await ctx.db.insert("deals", {
      orgId: args.orgId,
      pipelineId: args.pipelineId,
      stageId: args.stageId,
      contactId: args.contactId,
      companyId: args.companyId,
      assignedTo: args.assignedTo,
      title: args.title,
      description: args.description,
      value: args.value,
      currency: args.currency,
      probability: args.probability ?? stage?.probability ?? 10,
      expectedCloseDate: args.expectedCloseDate,
      status: "open",
      priority: (args.priority as any) ?? "medium",
      tags: args.tags ?? [],
      customFields: args.customFields,
      isArchived: false,
      stageChangedAt: now,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("activities", {
      orgId: args.orgId,
      type: "deal_created",
      dealId,
      contactId: args.contactId,
      companyId: args.companyId,
      userId: args.createdBy,
      title: `Deal "${args.title}" created`,
      status: "completed",
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return dealId;
  },
});

export const moveToStage = mutation({
  args: {
    dealId: v.id("deals"),
    stageId: v.id("pipeline_stages"),
    userId: v.id("users"),
  },
  handler: async (ctx, { dealId, stageId, userId }) => {
    const deal = await ctx.db.get(dealId);
    const newStage = await ctx.db.get(stageId);
    if (!deal || !newStage) throw new Error("Deal or stage not found");

    const oldStage = await ctx.db.get(deal.stageId);
    const now = Date.now();

    let status = deal.status;
    if (newStage.isWon) status = "won";
    else if (newStage.isLost) status = "lost";

    await ctx.db.patch(dealId, {
      stageId,
      status,
      probability: newStage.probability,
      stageChangedAt: now,
      lastActivityAt: now,
      actualCloseDate: newStage.isWon || newStage.isLost ? now : undefined,
      updatedAt: now,
    });

    await ctx.db.insert("activities", {
      orgId: deal.orgId,
      type: "deal_stage_change",
      dealId,
      userId,
      title: `Moved from "${oldStage?.name}" to "${newStage.name}"`,
      status: "completed",
      completedAt: now,
      metadata: { fromStage: oldStage?.name, toStage: newStage.name },
      createdAt: now,
      updatedAt: now,
    });

    if (newStage.isWon) {
      await ctx.db.insert("activities", {
        orgId: deal.orgId,
        type: "deal_won",
        dealId,
        userId,
        title: `🎉 Deal "${deal.title}" marked as WON`,
        status: "completed",
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const update = mutation({
  args: {
    dealId: v.id("deals"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    value: v.optional(v.number()),
    probability: v.optional(v.number()),
    expectedCloseDate: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    priority: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    lostReason: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, { dealId, ...updates }) => {
    await ctx.db.patch(dealId, { ...updates, updatedAt: Date.now() } as any);
  },
});

export const archive = mutation({
  args: { dealId: v.id("deals") },
  handler: async (ctx, { dealId }) => {
    await ctx.db.patch(dealId, { isArchived: true, updatedAt: Date.now() });
  },
});
