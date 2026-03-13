import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ════════════════════════════════════════════════════════════
// COMPANIES
// ════════════════════════════════════════════════════════════

export const listCompanies = query({
  args: {
    orgId: v.id("organizations"),
    type: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let companies = await ctx.db
      .query("companies")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    if (args.type) companies = companies.filter((c) => c.type === args.type);
    if (args.assignedTo) companies = companies.filter((c) => c.assignedTo === args.assignedTo);
    if (args.search) {
      const s = args.search.toLowerCase();
      companies = companies.filter((c) => c.name.toLowerCase().includes(s));
    }

    return companies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, { companyId }) => {
    const company = await ctx.db.get(companyId);
    if (!company) return null;

    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    const deals = await ctx.db
      .query("deals")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_org", (q) => q.eq("orgId", company.orgId))
      .filter((q) => q.eq(q.field("companyId" as any), companyId))
      .order("desc")
      .take(20);

    const assignee = company.assignedTo ? await ctx.db.get(company.assignedTo) : null;

    return {
      ...company,
      contacts,
      deals,
      activities,
      assignee,
      totalDealValue: deals.reduce((s, d) => s + d.value, 0),
      openDeals: deals.filter((d) => d.status === "open").length,
    };
  },
});

export const createCompany = mutation({
  args: {
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    name: v.string(),
    domain: v.optional(v.string()),
    industry: v.optional(v.string()),
    type: v.optional(v.string()),
    size: v.optional(v.string()),
    annualRevenue: v.optional(v.number()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.any()),
    tags: v.optional(v.array(v.string())),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("companies", {
      orgId: args.orgId,
      createdBy: args.createdBy,
      name: args.name,
      domain: args.domain,
      industry: args.industry,
      type: (args.type as any) ?? "prospect",
      size: args.size as any,
      annualRevenue: args.annualRevenue,
      phone: args.phone,
      email: args.email,
      website: args.website,
      address: args.address,
      tags: args.tags ?? [],
      assignedTo: args.assignedTo,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("activities", {
      orgId: args.orgId,
      type: "company_created",
      companyId: id,
      userId: args.createdBy,
      title: `Company "${args.name}" created`,
      status: "completed",
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const updateCompany = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.optional(v.string()),
    domain: v.optional(v.string()),
    industry: v.optional(v.string()),
    type: v.optional(v.string()),
    size: v.optional(v.string()),
    annualRevenue: v.optional(v.number()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.any()),
    tags: v.optional(v.array(v.string())),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, { companyId, ...updates }) => {
    await ctx.db.patch(companyId, { ...updates, updatedAt: Date.now() } as any);
  },
});

// ════════════════════════════════════════════════════════════
// ACTIVITIES
// ════════════════════════════════════════════════════════════

export const listActivities = query({
  args: {
    orgId: v.id("organizations"),
    contactId: v.optional(v.id("contacts")),
    dealId: v.optional(v.id("deals")),
    companyId: v.optional(v.id("companies")),
    type: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let activities = await ctx.db
      .query("activities")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(200);

    if (args.contactId) activities = activities.filter((a) => a.contactId === args.contactId);
    if (args.dealId) activities = activities.filter((a) => a.dealId === args.dealId);
    if (args.companyId) activities = activities.filter((a) => a.companyId === args.companyId);
    if (args.type) activities = activities.filter((a) => a.type === args.type);
    if (args.userId) activities = activities.filter((a) => a.userId === args.userId);

    const limit = args.limit ?? 50;
    const sliced = activities.slice(0, limit);

    // Enrich with user info
    return Promise.all(
      sliced.map(async (a) => {
        const user = await ctx.db.get(a.userId);
        return { ...a, user };
      })
    );
  },
});

export const createActivity = mutation({
  args: {
    orgId: v.id("organizations"),
    type: v.string(),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    dealId: v.optional(v.id("deals")),
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    outcome: v.optional(v.string()),
    duration: v.optional(v.number()),
    scheduledAt: v.optional(v.number()),
    status: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("activities", {
      orgId: args.orgId,
      type: args.type as any,
      contactId: args.contactId,
      companyId: args.companyId,
      dealId: args.dealId,
      userId: args.userId,
      title: args.title,
      description: args.description,
      outcome: args.outcome,
      duration: args.duration,
      scheduledAt: args.scheduledAt,
      status: (args.status as any) ?? "completed",
      completedAt: args.status === "completed" ? now : undefined,
      metadata: args.metadata,
      createdAt: now,
      updatedAt: now,
    });

    // Update lastContactedAt on contact
    if (args.contactId) {
      await ctx.db.patch(args.contactId, { lastContactedAt: now, updatedAt: now });
    }

    return id;
  },
});

// ════════════════════════════════════════════════════════════
// TASKS
// ════════════════════════════════════════════════════════════

export const listTasks = query({
  args: {
    orgId: v.id("organizations"),
    assignedTo: v.optional(v.id("users")),
    status: v.optional(v.string()),
    dealId: v.optional(v.id("deals")),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db
      .query("tasks")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    if (args.assignedTo) tasks = tasks.filter((t) => t.assignedTo === args.assignedTo);
    if (args.status) tasks = tasks.filter((t) => t.status === args.status);
    if (args.dealId) tasks = tasks.filter((t) => t.dealId === args.dealId);

    return tasks.sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity));
  },
});

export const createTask = mutation({
  args: {
    orgId: v.id("organizations"),
    assignedTo: v.id("users"),
    createdBy: v.id("users"),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    dealId: v.optional(v.id("deals")),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    reminderAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("tasks", {
      orgId: args.orgId,
      assignedTo: args.assignedTo,
      createdBy: args.createdBy,
      contactId: args.contactId,
      companyId: args.companyId,
      dealId: args.dealId,
      title: args.title,
      description: args.description,
      priority: (args.priority as any) ?? "medium",
      status: "todo",
      dueAt: args.dueAt,
      reminderAt: args.reminderAt,
      tags: args.tags ?? [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.string(),
  },
  handler: async (ctx, { taskId, status }) => {
    const now = Date.now();
    await ctx.db.patch(taskId, {
      status: status as any,
      completedAt: status === "done" ? now : undefined,
      updatedAt: now,
    });
  },
});
