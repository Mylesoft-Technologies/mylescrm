import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// ── AI Chat ────────────────────────────────────────────────

export const chat = action({
  args: {
    orgId: v.id("organizations"),
    userId: v.id("users"),
    conversationId: v.optional(v.id("ai_conversations")),
    message: v.string(),
    context: v.optional(v.object({
      type: v.optional(v.string()),
      entityId: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args): Promise<{ reply: string; conversationId: string }> => {
    // Gather CRM context for the prompt
    let contextData = "";

    if (args.context?.type === "contact" && args.context.entityId) {
      const contact = await ctx.runQuery(api.contacts.get, {
        contactId: args.context.entityId as any,
      });
      if (contact) {
        contextData = `\nContext — Contact: ${contact.firstName} ${contact.lastName}, Status: ${contact.status}, Lead Score: ${contact.leadScore ?? "N/A"}, Deals: ${contact.deals?.length ?? 0} deals.`;
      }
    } else if (args.context?.type === "deal" && args.context.entityId) {
      const deal = await ctx.runQuery(api.deals.get, {
        dealId: args.context.entityId as any,
      });
      if (deal) {
        contextData = `\nContext — Deal: ${deal.title}, Value: ${deal.currency} ${deal.value.toLocaleString()}, Stage: ${deal.stage?.name}, Probability: ${deal.probability}%.`;
      }
    }

    // Build conversation history
    let messages: any[] = [];
    if (args.conversationId) {
      const conv = await ctx.runQuery(api.ai.getConversation, { conversationId: args.conversationId });
      if (conv) {
        messages = conv.messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        }));
      }
    }

    const systemPrompt = `You are MylesCRM's AI assistant — an expert sales analyst, CRM advisor, and business intelligence engine. You help sales teams:
- Analyze deals, contacts, and pipeline performance
- Draft professional sales emails and follow-ups  
- Score and prioritize leads
- Forecast revenue and identify trends
- Suggest next best actions for deals
- Answer questions about CRM data

Be concise, data-driven, and actionable. Use specific numbers and percentages when available.${contextData}`;

    messages.push({ role: "user", content: args.message });

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://mylescrm.app",
        "X-Title": "MylesCRM AI Assistant",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_DEFAULT_MODEL ?? "anthropic/claude-3.5-sonnet",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter API error: ${err}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";
    const tokensUsed = data.usage?.total_tokens ?? 0;

    const now = Date.now();
    const newMessage = { role: "assistant" as const, content: reply, timestamp: now, model: data.model, tokensUsed };
    const userMessage = { role: "user" as const, content: args.message, timestamp: now };

    // Save or update conversation
    let convId = args.conversationId;
    if (convId) {
      await ctx.runMutation(api.ai.appendMessages, {
        conversationId: convId,
        messages: [userMessage, newMessage],
        tokensToAdd: tokensUsed,
      });
    } else {
      convId = await ctx.runMutation(api.ai.createConversation, {
        orgId: args.orgId,
        userId: args.userId,
        messages: [userMessage, newMessage],
        totalTokens: tokensUsed,
        context: args.context,
      });
    }

    return { reply, conversationId: convId as string };
  },
});

// ── Lead Scoring ───────────────────────────────────────────

export const scoreLeads = action({
  args: {
    orgId: v.id("organizations"),
    contactIds: v.array(v.id("contacts")),
  },
  handler: async (ctx, { orgId, contactIds }) => {
    const results = [];

    for (const contactId of contactIds) {
      const contact = await ctx.runQuery(api.contacts.get, { contactId });
      if (!contact) continue;

      // Gather scoring signals
      const hasEmail = !!contact.email;
      const hasPhone = !!contact.phone || !!contact.mobile;
      const hasTitle = !!contact.title;
      const hasCompany = !!contact.company;
      const dealCount = contact.deals?.length ?? 0;
      const recentActivity = contact.lastContactedAt
        ? Date.now() - contact.lastContactedAt < 7 * 24 * 60 * 60 * 1000
        : false;

      const prompt = `You are a B2B lead scoring AI. Analyze this contact and return a JSON lead score.

Contact Data:
- Name: ${contact.firstName} ${contact.lastName}
- Title: ${contact.title ?? "Unknown"}
- Company: ${contact.company?.name ?? "Unknown"} (${contact.company?.size ?? "Unknown size"}, ${contact.company?.industry ?? "Unknown industry"})
- Email: ${hasEmail ? "Yes" : "No"}
- Phone: ${hasPhone ? "Yes" : "No"}
- Status: ${contact.status}
- Source: ${contact.source ?? "Unknown"}
- Active deals: ${dealCount}
- Recent activity: ${recentActivity ? "Yes (last 7 days)" : "No"}
- Last contacted: ${contact.lastContactedAt ? new Date(contact.lastContactedAt).toISOString() : "Never"}

Return ONLY valid JSON (no markdown, no explanation):
{
  "score": <number 0-100>,
  "grade": "<A|B|C|D|F>",
  "factors": {
    "engagement": <0-100>,
    "demographic": <0-100>,
    "behavioral": <0-100>,
    "recency": <0-100>
  },
  "reasoning": "<2-3 sentence explanation>"
}`;

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env.OPENROUTER_FAST_MODEL ?? "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 400,
            temperature: 0.3,
          }),
        });

        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content ?? "{}";
        const scored = JSON.parse(raw.replace(/```json|```/g, "").trim());

        await ctx.runMutation(api.ai.saveLeadScore, {
          orgId,
          contactId,
          score: scored.score,
          grade: scored.grade,
          factors: scored.factors,
          reasoning: scored.reasoning,
          model: data.model ?? "unknown",
        });

        await ctx.runMutation(api.contacts.update, {
          contactId,
          leadScore: scored.score,
          leadScoreFactors: scored.factors,
        });

        results.push({ contactId, score: scored.score, grade: scored.grade });
      } catch (e) {
        console.error(`Failed to score contact ${contactId}:`, e);
      }
    }

    return results;
  },
});

// ── Email Drafting ─────────────────────────────────────────

export const draftEmail = action({
  args: {
    orgId: v.id("organizations"),
    contactId: v.optional(v.id("contacts")),
    dealId: v.optional(v.id("deals")),
    intent: v.string(),           // "follow_up", "introduction", "proposal", "reminder", "thank_you"
    tone: v.optional(v.string()), // "professional", "friendly", "urgent"
    customInstructions: v.optional(v.string()),
    senderName: v.string(),
    senderTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let contextData = "";

    if (args.contactId) {
      const contact = await ctx.runQuery(api.contacts.get, { contactId: args.contactId });
      if (contact) {
        contextData += `Recipient: ${contact.firstName} ${contact.lastName} (${contact.title ?? "Unknown title"} at ${contact.company?.name ?? "Unknown company"}).\n`;
      }
    }

    if (args.dealId) {
      const deal = await ctx.runQuery(api.deals.get, { dealId: args.dealId });
      if (deal) {
        contextData += `Deal: "${deal.title}", Value: ${deal.currency} ${deal.value.toLocaleString()}, Stage: ${deal.stage?.name}.\n`;
      }
    }

    const prompt = `Draft a ${args.intent.replace("_", " ")} sales email.

Context:
${contextData}
Sender: ${args.senderName}${args.senderTitle ? ` (${args.senderTitle})` : ""}
Tone: ${args.tone ?? "professional"}
Intent: ${args.intent}
${args.customInstructions ? `Special instructions: ${args.customInstructions}` : ""}

Return ONLY valid JSON (no markdown):
{
  "subject": "<email subject line>",
  "body": "<full HTML email body, well formatted>",
  "preview": "<one-line preview of the email content>"
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_DEFAULT_MODEL ?? "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  },
});

// ── Revenue Forecasting ────────────────────────────────────

export const forecastRevenue = action({
  args: {
    orgId: v.id("organizations"),
    months: v.optional(v.number()),
  },
  handler: async (ctx, { orgId, months = 3 }) => {
    const deals = await ctx.runQuery(api.deals.list, { orgId, status: "open" });

    const pipelineData = deals.map((d: any) => ({
      title: d.title,
      value: d.value,
      currency: d.currency,
      probability: d.probability,
      stage: d.stage?.name,
      expectedClose: d.expectedCloseDate ? new Date(d.expectedCloseDate).toISOString() : null,
      aiScore: d.aiScore,
    }));

    const prompt = `You are a revenue forecasting AI. Analyze this sales pipeline and forecast revenue.

Pipeline data (${pipelineData.length} open deals):
${JSON.stringify(pipelineData.slice(0, 50), null, 2)}

Forecast the next ${months} months. Return ONLY valid JSON:
{
  "summary": "<executive summary of forecast>",
  "totalPipelineValue": <number>,
  "weightedPipelineValue": <number>,
  "forecastByMonth": [
    { "month": "<YYYY-MM>", "pessimistic": <number>, "realistic": <number>, "optimistic": <number> }
  ],
  "topDeals": [
    { "title": "<deal title>", "value": <number>, "probability": <number>, "recommendation": "<action>" }
  ],
  "risks": ["<risk 1>", "<risk 2>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>"]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_DEFAULT_MODEL ?? "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  },
});

// ── Helpers (Queries + Mutations) ─────────────────────────

export const getConversation = query({
  args: { conversationId: v.id("ai_conversations") },
  handler: async (ctx, { conversationId }) => ctx.db.get(conversationId),
});

export const listConversations = query({
  args: { orgId: v.id("organizations"), userId: v.id("users") },
  handler: async (ctx, { orgId, userId }) => {
    return ctx.db
      .query("ai_conversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const createConversation = mutation({
  args: {
    orgId: v.id("organizations"),
    userId: v.id("users"),
    messages: v.array(v.any()),
    totalTokens: v.number(),
    context: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("ai_conversations", {
      orgId: args.orgId,
      userId: args.userId,
      messages: args.messages,
      totalTokens: args.totalTokens,
      context: args.context,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const appendMessages = mutation({
  args: {
    conversationId: v.id("ai_conversations"),
    messages: v.array(v.any()),
    tokensToAdd: v.number(),
  },
  handler: async (ctx, { conversationId, messages, tokensToAdd }) => {
    const conv = await ctx.db.get(conversationId);
    if (!conv) throw new Error("Conversation not found");
    await ctx.db.patch(conversationId, {
      messages: [...conv.messages, ...messages],
      totalTokens: conv.totalTokens + tokensToAdd,
      updatedAt: Date.now(),
    });
  },
});

export const saveLeadScore = mutation({
  args: {
    orgId: v.id("organizations"),
    contactId: v.id("contacts"),
    score: v.number(),
    grade: v.string(),
    factors: v.object({
      engagement: v.number(),
      demographic: v.number(),
      behavioral: v.number(),
      recency: v.number(),
    }),
    reasoning: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    // Upsert: delete old score and insert new
    const existing = await ctx.db
      .query("lead_scores")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .first();

    if (existing) await ctx.db.delete(existing._id);

    return ctx.db.insert("lead_scores", {
      orgId: args.orgId,
      contactId: args.contactId,
      score: args.score,
      grade: args.grade as any,
      factors: args.factors,
      reasoning: args.reasoning,
      computedAt: Date.now(),
      model: args.model,
    });
  },
});
