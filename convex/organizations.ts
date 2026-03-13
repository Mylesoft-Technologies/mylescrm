import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Organizations ──────────────────────────────────────────

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getById = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => ctx.db.get(orgId),
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    industry: v.optional(v.string()),
    timezone: v.string(),
    currency: v.string(),
    locale: v.string(),
    workosOrgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      slug: args.slug,
      industry: args.industry,
      timezone: args.timezone,
      currency: args.currency,
      locale: args.locale,
      plan: "free",
      planStatus: "trialing",
      trialEndsAt: now + 14 * 24 * 60 * 60 * 1000, // 14-day trial
      maxUsers: 3,
      maxContacts: 250,
      features: ["contacts", "companies", "deals", "pipeline", "activities"],
      settings: {
        notificationsEnabled: true,
        aiEnabled: false,
        calcomEnabled: false,
        mpesaEnabled: false,
      },
      workosOrgId: args.workosOrgId,
      createdAt: now,
      updatedAt: now,
    });
    return orgId;
  },
});

export const update = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.optional(v.string()),
    logo: v.optional(v.string()),
    industry: v.optional(v.string()),
    website: v.optional(v.string()),
    timezone: v.optional(v.string()),
    currency: v.optional(v.string()),
    settings: v.optional(v.any()),
  },
  handler: async (ctx, { orgId, ...updates }) => {
    await ctx.db.patch(orgId, { ...updates, updatedAt: Date.now() } as any);
  },
});

export const updatePlan = mutation({
  args: {
    orgId: v.id("organizations"),
    plan: v.string(),
    planStatus: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    maxUsers: v.number(),
    maxContacts: v.number(),
    features: v.array(v.string()),
  },
  handler: async (ctx, { orgId, ...updates }) => {
    await ctx.db.patch(orgId, { ...updates, updatedAt: Date.now() } as any);
  },
});

// ── Users ──────────────────────────────────────────────────

export const getUser = query({
  args: { workosUserId: v.string() },
  handler: async (ctx, { workosUserId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_workos_user", (q) => q.eq("workosUserId", workosUserId))
      .first();
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => ctx.db.get(userId),
});

export const listUsers = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.neq(q.field("status"), "inactive"))
      .collect();
  },
});

export const createUser = mutation({
  args: {
    orgId: v.id("organizations"),
    workosUserId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    avatar: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if first user in org — make them super_admin
    const existingUsers = await ctx.db
      .query("users")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();

    return ctx.db.insert("users", {
      orgId: args.orgId,
      workosUserId: args.workosUserId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      avatar: args.avatar,
      role: (existingUsers ? args.role ?? "sales_rep" : "super_admin") as any,
      status: "active",
      notificationPrefs: {
        email: true,
        inApp: true,
        dealUpdates: true,
        taskReminders: true,
        leadAssigned: true,
      },
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatar: v.optional(v.string()),
    phone: v.optional(v.string()),
    title: v.optional(v.string()),
    department: v.optional(v.string()),
    timezone: v.optional(v.string()),
    notificationPrefs: v.optional(v.any()),
  },
  handler: async (ctx, { userId, ...updates }) => {
    await ctx.db.patch(userId, { ...updates, updatedAt: Date.now() } as any);
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
    actingUserId: v.id("users"),
  },
  handler: async (ctx, { userId, role, actingUserId }) => {
    const actor = await ctx.db.get(actingUserId);
    if (!actor || !["super_admin", "admin"].includes(actor.role)) {
      throw new Error("Insufficient permissions");
    }
    await ctx.db.patch(userId, { role: role as any, updatedAt: Date.now() });
  },
});

export const updateLastActive = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.patch(userId, { lastActiveAt: Date.now(), updatedAt: Date.now() });
  },
});

// ── Notifications ──────────────────────────────────────────

export const getNotifications = query({
  args: { userId: v.id("users"), unreadOnly: v.optional(v.boolean()) },
  handler: async (ctx, { userId, unreadOnly }) => {
    let q = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc");

    const all = await q.take(50);
    return unreadOnly ? all.filter((n) => !n.isRead) : all;
  },
});

export const markNotificationRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    await ctx.db.patch(notificationId, { isRead: true });
  },
});

export const markAllNotificationsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("isRead", false))
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true });
    }
  },
});
