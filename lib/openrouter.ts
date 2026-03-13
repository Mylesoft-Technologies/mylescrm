// OpenRouter API helper
// Docs: https://openrouter.ai/docs

export type OpenRouterModel =
  | "anthropic/claude-3.5-sonnet"
  | "anthropic/claude-3-haiku"
  | "openai/gpt-4o"
  | "openai/gpt-4o-mini"
  | "google/gemini-pro-1.5"
  | "meta-llama/llama-3.1-70b-instruct";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model?: OpenRouterModel | string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

const BASE_URL = "https://openrouter.ai/api/v1";

export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://mylescrm.app",
      "X-Title": "MylesCRM",
    },
    body: JSON.stringify({
      model: options.model ?? process.env.OPENROUTER_DEFAULT_MODEL ?? "anthropic/claude-3.5-sonnet",
      messages,
      max_tokens: options.maxTokens ?? 1500,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function chatJSON<T = any>(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<T> {
  const raw = await chat(messages, { ...options, temperature: options.temperature ?? 0.3 });
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse AI JSON response: ${raw.slice(0, 200)}`);
  }
}

export function buildSystemPrompt(orgName: string, userRole: string): string {
  return `You are MylesCRM's AI assistant for ${orgName}. You are an expert sales analyst and CRM advisor helping a ${userRole} to:
- Analyze pipeline performance and identify bottlenecks
- Score and prioritize leads based on available signals
- Draft personalized, high-converting sales emails
- Forecast revenue with confidence intervals
- Suggest next best actions for each deal
- Answer data questions about contacts, companies, and deals

Be concise, data-driven, and actionable. When referencing numbers, be specific. Format responses clearly with bullet points when listing multiple items.`;
}

export async function generateLeadScore(contactData: {
  name: string;
  title?: string;
  company?: string;
  companySize?: string;
  industry?: string;
  hasEmail: boolean;
  hasPhone: boolean;
  dealCount: number;
  source?: string;
  daysSinceContact?: number;
}): Promise<{
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  factors: { engagement: number; demographic: number; behavioral: number; recency: number };
  reasoning: string;
}> {
  return chatJSON(
    [
      {
        role: "user",
        content: `Score this B2B lead. Return ONLY valid JSON, no markdown.

Lead: ${contactData.name}
Title: ${contactData.title ?? "Unknown"}
Company: ${contactData.company ?? "Unknown"} (${contactData.companySize ?? "??"} employees, ${contactData.industry ?? "Unknown"} industry)
Has email: ${contactData.hasEmail}
Has phone: ${contactData.hasPhone}
Active deals: ${contactData.dealCount}
Lead source: ${contactData.source ?? "Unknown"}
Days since last contact: ${contactData.daysSinceContact ?? "Never"}

JSON format: {"score": 0-100, "grade": "A|B|C|D|F", "factors": {"engagement": 0-100, "demographic": 0-100, "behavioral": 0-100, "recency": 0-100}, "reasoning": "2-3 sentences"}`,
      },
    ],
    { model: process.env.OPENROUTER_FAST_MODEL ?? "openai/gpt-4o-mini", temperature: 0.2 }
  );
}
