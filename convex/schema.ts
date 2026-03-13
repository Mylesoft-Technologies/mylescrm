import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─────────────────────────────────────────────────────────
  // ORGANIZATIONS (Multi-tenant root)
  // ─────────────────────────────────────────────────────────
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),                // subdomain / URL slug
    logo: v.optional(v.string()),
    industry: v.optional(v.string()),
    website: v.optional(v.string()),
    timezone: v.string(),
    currency: v.string(),            // ISO 4217: KES, USD, GBP, EUR…
    locale: v.string(),
    plan: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("growth"),
      v.literal("enterprise")
    ),
    planStatus: v.union(
      v.literal("active"),
      v.literal("trialing"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("paused")
    ),
    trialEndsAt: v.optional(v.number()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    workosOrgId: v.optional(v.string()),
    maxUsers: v.number(),
    maxContacts: v.number(),
    features: v.array(v.string()),   // feature flags per plan
    settings: v.object({
      primaryColor: v.optional(v.string()),
      emailFromName: v.optional(v.string()),
      emailFromAddress: v.optional(v.string()),
      notificationsEnabled: v.boolean(),
      aiEnabled: v.boolean(),
      calcomEnabled: v.boolean(),
      mpesaEnabled: v.boolean(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_workos_org", ["workosOrgId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  // ─────────────────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────────────────
  users: defineTable({
    orgId: v.id("organizations"),
    workosUserId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    avatar: v.optional(v.string()),
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin"),
      v.literal("sales_manager"),
      v.literal("sales_rep"),
      v.literal("finance_officer"),
      v.literal("viewer")
    ),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("invited")),
    phone: v.optional(v.string()),
    title: v.optional(v.string()),
    department: v.optional(v.string()),
    timezone: v.optional(v.string()),
    lastActiveAt: v.optional(v.number()),
    calcomUserId: v.optional(v.string()),
    notificationPrefs: v.object({
      email: v.boolean(),
      inApp: v.boolean(),
      dealUpdates: v.boolean(),
      taskReminders: v.boolean(),
      leadAssigned: v.boolean(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_workos_user", ["workosUserId"])
    .index("by_email", ["email"])
    .index("by_org_role", ["orgId", "role"]),

  // ─────────────────────────────────────────────────────────
  // CONTACTS
  // ─────────────────────────────────────────────────────────
  contacts: defineTable({
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
    avatar: v.optional(v.string()),
    status: v.union(
      v.literal("lead"),
      v.literal("prospect"),
      v.literal("customer"),
      v.literal("churned"),
      v.literal("inactive")
    ),
    source: v.optional(v.string()),   // referral, website, cold_outreach, etc.
    tags: v.array(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
    social: v.optional(v.object({
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    leadScore: v.optional(v.number()),        // 0-100, AI computed
    leadScoreFactors: v.optional(v.any()),    // JSON breakdown
    customFields: v.optional(v.any()),
    lastContactedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    isArchived: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_company", ["companyId"])
    .index("by_assigned", ["assignedTo"])
    .index("by_org_status", ["orgId", "status"])
    .index("by_org_email", ["orgId", "email"])
    .searchIndex("search_contacts", {
      searchField: "firstName",
      filterFields: ["orgId", "status", "isArchived"],
    }),

  // ─────────────────────────────────────────────────────────
  // COMPANIES / ACCOUNTS
  // ─────────────────────────────────────────────────────────
  companies: defineTable({
    orgId: v.id("organizations"),
    parentCompanyId: v.optional(v.id("companies")),
    assignedTo: v.optional(v.id("users")),
    name: v.string(),
    domain: v.optional(v.string()),
    logo: v.optional(v.string()),
    industry: v.optional(v.string()),
    type: v.union(
      v.literal("prospect"),
      v.literal("customer"),
      v.literal("partner"),
      v.literal("vendor"),
      v.literal("competitor")
    ),
    size: v.optional(v.union(
      v.literal("1-10"),
      v.literal("11-50"),
      v.literal("51-200"),
      v.literal("201-500"),
      v.literal("501-1000"),
      v.literal("1000+")
    )),
    annualRevenue: v.optional(v.number()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
    tags: v.array(v.string()),
    customFields: v.optional(v.any()),
    totalDealValue: v.optional(v.number()),
    isArchived: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_assigned", ["assignedTo"])
    .index("by_org_type", ["orgId", "type"])
    .searchIndex("search_companies", {
      searchField: "name",
      filterFields: ["orgId", "type", "isArchived"],
    }),

  // ─────────────────────────────────────────────────────────
  // PIPELINES
  // ─────────────────────────────────────────────────────────
  pipelines: defineTable({
    orgId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    isDefault: v.boolean(),
    currency: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"]),

  pipeline_stages: defineTable({
    orgId: v.id("organizations"),
    pipelineId: v.id("pipelines"),
    name: v.string(),
    description: v.optional(v.string()),
    probability: v.number(),         // 0-100
    color: v.string(),
    order: v.number(),
    isWon: v.boolean(),
    isLost: v.boolean(),
    rottenDays: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_pipeline", ["pipelineId"])
    .index("by_org", ["orgId"]),

  // ─────────────────────────────────────────────────────────
  // DEALS / OPPORTUNITIES
  // ─────────────────────────────────────────────────────────
  deals: defineTable({
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
    probability: v.number(),          // 0-100
    expectedCloseDate: v.optional(v.number()),
    actualCloseDate: v.optional(v.number()),
    status: v.union(
      v.literal("open"),
      v.literal("won"),
      v.literal("lost"),
      v.literal("on_hold")
    ),
    lostReason: v.optional(v.string()),
    source: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    tags: v.array(v.string()),
    customFields: v.optional(v.any()),
    aiScore: v.optional(v.number()),         // AI win probability
    aiScoreFactors: v.optional(v.any()),
    lastActivityAt: v.optional(v.number()),
    stageChangedAt: v.optional(v.number()),
    isArchived: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_pipeline", ["pipelineId"])
    .index("by_stage", ["stageId"])
    .index("by_contact", ["contactId"])
    .index("by_company", ["companyId"])
    .index("by_assigned", ["assignedTo"])
    .index("by_org_status", ["orgId", "status"])
    .searchIndex("search_deals", {
      searchField: "title",
      filterFields: ["orgId", "status", "isArchived"],
    }),

  // ─────────────────────────────────────────────────────────
  // ACTIVITIES (unified timeline)
  // ─────────────────────────────────────────────────────────
  activities: defineTable({
    orgId: v.id("organizations"),
    type: v.union(
      v.literal("call"),
      v.literal("email"),
      v.literal("meeting"),
      v.literal("task"),
      v.literal("note"),
      v.literal("deal_stage_change"),
      v.literal("deal_created"),
      v.literal("deal_won"),
      v.literal("deal_lost"),
      v.literal("contact_created"),
      v.literal("company_created"),
      v.literal("file_uploaded"),
      v.literal("payment_received")
    ),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    dealId: v.optional(v.id("deals")),
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    outcome: v.optional(v.string()),
    duration: v.optional(v.number()),    // seconds
    scheduledAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("overdue")
    ),
    metadata: v.optional(v.any()),       // type-specific data
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_contact", ["contactId"])
    .index("by_deal", ["dealId"])
    .index("by_user", ["userId"])
    .index("by_org_type", ["orgId", "type"]),

  // ─────────────────────────────────────────────────────────
  // TASKS
  // ─────────────────────────────────────────────────────────
  tasks: defineTable({
    orgId: v.id("organizations"),
    assignedTo: v.id("users"),
    createdBy: v.id("users"),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    dealId: v.optional(v.id("deals")),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"), v.literal("cancelled")),
    dueAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    reminderAt: v.optional(v.number()),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_assigned", ["assignedTo"])
    .index("by_deal", ["dealId"])
    .index("by_org_status", ["orgId", "status"]),

  // ─────────────────────────────────────────────────────────
  // EMAIL MESSAGES
  // ─────────────────────────────────────────────────────────
  email_messages: defineTable({
    orgId: v.id("organizations"),
    contactId: v.optional(v.id("contacts")),
    dealId: v.optional(v.id("deals")),
    sentBy: v.id("users"),
    resendId: v.optional(v.string()),
    direction: v.union(v.literal("outbound"), v.literal("inbound")),
    from: v.string(),
    to: v.array(v.string()),
    cc: v.optional(v.array(v.string())),
    bcc: v.optional(v.array(v.string())),
    subject: v.string(),
    body: v.string(),            // HTML
    bodyText: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("opened"),
      v.literal("clicked"),
      v.literal("bounced"),
      v.literal("failed")
    ),
    openedAt: v.optional(v.number()),
    clickedAt: v.optional(v.number()),
    templateId: v.optional(v.id("email_templates")),
    sequenceId: v.optional(v.id("email_sequences")),
    threadId: v.optional(v.string()),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      size: v.number(),
    }))),
    scheduledAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_contact", ["contactId"])
    .index("by_deal", ["dealId"])
    .index("by_resend_id", ["resendId"]),

  // ─────────────────────────────────────────────────────────
  // EMAIL TEMPLATES
  // ─────────────────────────────────────────────────────────
  email_templates: defineTable({
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    category: v.optional(v.string()),
    tags: v.array(v.string()),
    isShared: v.boolean(),
    variables: v.array(v.string()),  // {{firstName}}, {{companyName}}…
    usageCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_creator", ["createdBy"]),

  // ─────────────────────────────────────────────────────────
  // EMAIL SEQUENCES (drip campaigns)
  // ─────────────────────────────────────────────────────────
  email_sequences: defineTable({
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("paused"), v.literal("archived")),
    steps: v.array(v.object({
      order: v.number(),
      delayDays: v.number(),
      templateId: v.id("email_templates"),
      subject: v.optional(v.string()),
    })),
    enrollmentCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"]),

  // ─────────────────────────────────────────────────────────
  // INVOICES
  // ─────────────────────────────────────────────────────────
  invoices: defineTable({
    orgId: v.id("organizations"),
    contactId: v.optional(v.id("contacts")),
    companyId: v.optional(v.id("companies")),
    dealId: v.optional(v.id("deals")),
    createdBy: v.id("users"),
    invoiceNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("partial"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    currency: v.string(),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      taxRate: v.optional(v.number()),
      total: v.number(),
    })),
    subtotal: v.number(),
    taxAmount: v.number(),
    discount: v.optional(v.number()),
    total: v.number(),
    paidAmount: v.number(),
    dueAt: v.number(),
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    mpesaCheckoutRequestId: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_contact", ["contactId"])
    .index("by_deal", ["dealId"])
    .index("by_invoice_number", ["invoiceNumber"])
    .index("by_stripe_invoice", ["stripeInvoiceId"]),

  // ─────────────────────────────────────────────────────────
  // PAYMENTS
  // ─────────────────────────────────────────────────────────
  payments: defineTable({
    orgId: v.id("organizations"),
    invoiceId: v.id("invoices"),
    contactId: v.optional(v.id("contacts")),
    method: v.union(v.literal("stripe"), v.literal("mpesa"), v.literal("bank"), v.literal("cash"), v.literal("other")),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded")),
    amount: v.number(),
    currency: v.string(),
    reference: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    mpesaReceiptNumber: v.optional(v.string()),
    mpesaTransactionId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_invoice", ["invoiceId"])
    .index("by_stripe_intent", ["stripePaymentIntentId"]),

  // ─────────────────────────────────────────────────────────
  // SUBSCRIPTIONS (org billing via Stripe)
  // ─────────────────────────────────────────────────────────
  subscriptions: defineTable({
    orgId: v.id("organizations"),
    stripeSubscriptionId: v.string(),
    stripeCustomerId: v.string(),
    stripePriceId: v.string(),
    plan: v.string(),
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    canceledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_stripe_sub", ["stripeSubscriptionId"]),

  // ─────────────────────────────────────────────────────────
  // AI CONVERSATIONS
  // ─────────────────────────────────────────────────────────
  ai_conversations: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    title: v.optional(v.string()),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
      content: v.string(),
      timestamp: v.number(),
      model: v.optional(v.string()),
      tokensUsed: v.optional(v.number()),
    })),
    context: v.optional(v.object({
      type: v.optional(v.string()),   // "contact", "deal", "company", "global"
      entityId: v.optional(v.string()),
    })),
    totalTokens: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"]),

  // ─────────────────────────────────────────────────────────
  // LEAD SCORES
  // ─────────────────────────────────────────────────────────
  lead_scores: defineTable({
    orgId: v.id("organizations"),
    contactId: v.id("contacts"),
    score: v.number(),               // 0-100
    grade: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D"), v.literal("F")),
    factors: v.object({
      engagement: v.number(),        // email opens, link clicks
      demographic: v.number(),       // title, company size, industry
      behavioral: v.number(),        // website visits, form fills
      recency: v.number(),           // last contact, last activity
    }),
    reasoning: v.string(),           // AI explanation
    computedAt: v.number(),
    model: v.string(),
  })
    .index("by_contact", ["contactId"])
    .index("by_org", ["orgId"]),

  // ─────────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ─────────────────────────────────────────────────────────
  notifications: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    isRead: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_unread", ["userId", "isRead"]),

  // ─────────────────────────────────────────────────────────
  // CUSTOM FIELDS (org-level field definitions)
  // ─────────────────────────────────────────────────────────
  custom_fields: defineTable({
    orgId: v.id("organizations"),
    entityType: v.union(v.literal("contact"), v.literal("company"), v.literal("deal")),
    name: v.string(),
    label: v.string(),
    fieldType: v.union(
      v.literal("text"),
      v.literal("number"),
      v.literal("date"),
      v.literal("select"),
      v.literal("multi_select"),
      v.literal("checkbox"),
      v.literal("url"),
      v.literal("currency")
    ),
    options: v.optional(v.array(v.string())),
    isRequired: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_org_entity", ["orgId", "entityType"]),

  // ─────────────────────────────────────────────────────────
  // WEBHOOKS
  // ─────────────────────────────────────────────────────────
  webhook_logs: defineTable({
    orgId: v.optional(v.id("organizations")),
    provider: v.string(),       // stripe, mpesa, workos
    event: v.string(),
    payload: v.any(),
    status: v.union(v.literal("processed"), v.literal("failed"), v.literal("ignored")),
    error: v.optional(v.string()),
    receivedAt: v.number(),
  })
    .index("by_provider", ["provider"]),

  // ─────────────────────────────────────────────────────────
  // REPORTS (saved reports / dashboards)
  // ─────────────────────────────────────────────────────────
  reports: defineTable({
    orgId: v.id("organizations"),
    createdBy: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("sales_performance"),
      v.literal("pipeline_analysis"),
      v.literal("contact_growth"),
      v.literal("revenue_forecast"),
      v.literal("activity_summary"),
      v.literal("email_analytics"),
      v.literal("custom")
    ),
    config: v.any(),             // chart type, filters, date range
    isShared: v.boolean(),
    isPinned: v.boolean(),
    lastRunAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_creator", ["createdBy"]),
});
