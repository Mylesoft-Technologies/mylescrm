import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listPipelines = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    return ctx.db
      .query("pipelines")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const getDefaultPipeline = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    return ctx.db
      .query("pipelines")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("isDefault"), true))
      .first();
  },
});

export const getStages = query({
  args: { pipelineId: v.id("pipelines") },
  handler: async (ctx, { pipelineId }) => {
    const stages = await ctx.db
      .query("pipeline_stages")
      .withIndex("by_pipeline", (q) => q.eq("pipelineId", pipelineId))
      .collect();
    return stages.sort((a, b) => a.order - b.order);
  },
});

export const createPipeline = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    currency: v.string(),
    createdBy: v.id("users"),
    stages: v.array(v.object({
      name: v.string(),
      probability: v.number(),
      color: v.string(),
      order: v.number(),
      isWon: v.optional(v.boolean()),
      isLost: v.optional(v.boolean()),
      rottenDays: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if any pipeline exists for this org — first one is default
    const existing = await ctx.db
      .query("pipelines")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();

    const pipelineId = await ctx.db.insert("pipelines", {
      orgId: args.orgId,
      name: args.name,
      description: args.description,
      isDefault: !existing,
      currency: args.currency,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });

    for (const stage of args.stages) {
      await ctx.db.insert("pipeline_stages", {
        orgId: args.orgId,
        pipelineId,
        name: stage.name,
        probability: stage.probability,
        color: stage.color,
        order: stage.order,
        isWon: stage.isWon ?? false,
        isLost: stage.isLost ?? false,
        rottenDays: stage.rottenDays,
        createdAt: now,
        updatedAt: now,
      });
    }

    return pipelineId;
  },
});

export const seedDefaultPipeline = mutation({
  args: {
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    currency: v.string(),
  },
  handler: async (ctx, { orgId, createdBy, currency }) => {
    const now = Date.now();

    const pipelineId = await ctx.db.insert("pipelines", {
      orgId,
      name: "Sales Pipeline",
      description: "Default sales pipeline",
      isDefault: true,
      currency,
      createdBy,
      createdAt: now,
      updatedAt: now,
    });

    const defaultStages = [
      { name: "Lead", probability: 10, color: "#94a3b8", order: 0, isWon: false, isLost: false },
      { name: "Qualified", probability: 25, color: "#60a5fa", order: 1, isWon: false, isLost: false },
      { name: "Proposal Sent", probability: 50, color: "#f59e0b", order: 2, isWon: false, isLost: false },
      { name: "Negotiation", probability: 75, color: "#f97316", order: 3, isWon: false, isLost: false },
      { name: "Won", probability: 100, color: "#22c55e", order: 4, isWon: true, isLost: false },
      { name: "Lost", probability: 0, color: "#ef4444", order: 5, isWon: false, isLost: true },
    ];

    for (const stage of defaultStages) {
      await ctx.db.insert("pipeline_stages", {
        orgId,
        pipelineId,
        ...stage,
        createdAt: now,
        updatedAt: now,
      });
    }

    return pipelineId;
  },
});

export const updateStageOrder = mutation({
  args: {
    updates: v.array(v.object({
      stageId: v.id("pipeline_stages"),
      order: v.number(),
    })),
  },
  handler: async (ctx, { updates }) => {
    for (const { stageId, order } of updates) {
      await ctx.db.patch(stageId, { order, updatedAt: Date.now() });
    }
  },
});

export const addStage = mutation({
  args: {
    pipelineId: v.id("pipelines"),
    orgId: v.id("organizations"),
    name: v.string(),
    probability: v.number(),
    color: v.string(),
    order: v.number(),
    rottenDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("pipeline_stages", {
      ...args,
      isWon: false,
      isLost: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteStage = mutation({
  args: { stageId: v.id("pipeline_stages") },
  handler: async (ctx, { stageId }) => {
    // Check for deals in this stage
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_stage", (q) => q.eq("stageId", stageId))
      .first();

    if (deals) throw new Error("Cannot delete stage with active deals. Move deals first.");
    await ctx.db.delete(stageId);
  },
});
