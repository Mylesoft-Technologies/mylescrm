"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Sparkles, TrendingUp, Mail, Target,
  User, BarChart3, Zap, ChevronRight, RefreshCw,
  MessageSquare, Lightbulb, ArrowUpRight, Loader2
} from "lucide-react";

type Tab = "chat" | "scoring" | "email" | "forecast";

const QUICK_PROMPTS = [
  "Which deals are at risk of going cold?",
  "Summarize my pipeline for this week",
  "Draft a follow-up for Safari Logistics deal",
  "What's my predicted revenue for Q2?",
  "Which contacts should I prioritize today?",
  "Show me win rate by deal source",
];

type Message = { role: "user" | "assistant"; content: string; time: string };

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: "👋 Hi Myles! I'm your MylesCRM AI assistant. I can help you analyze your pipeline, score leads, draft emails, forecast revenue, and surface insights from your data.\n\nWhat would you like to explore today?",
    time: "now",
  },
];

const MOCK_RESPONSES: Record<string, string> = {
  default: "I've analyzed your CRM data. Here's what I found:\n\n**Pipeline Summary:**\n- 9 open deals worth $247,200 total\n- 3 deals at 75%+ probability (high conversion likelihood)\n- 2 deals stagnant for 7+ days — action needed\n\n**Top recommendation:** Follow up with Omar Hassan at TechStartup UAE — the deal has been in Proposal Sent for 7 days with an 88% AI score. A quick call could close this week.",
  "which deals are at risk": "🚨 **At-Risk Deals (3 found):**\n\n1. **Nairobi Realty Platform** — 5 days in Lead stage, no activity logged. AI score: 45/100. *Action: Qualify or discard.*\n\n2. **EduTech Africa SaaS** — Expected close was Mar 15, now overdue by 2 days. *Action: Update expected close date and send check-in email.*\n\n3. **Global Retail SG** — Proposal sent 4 days ago, no response tracked. *Action: Send a polite follow-up today.*",
  "draft a follow-up": "Here's a follow-up email for the Safari Logistics deal:\n\n**Subject:** Following up — Safari Logistics × MylesCRM Pro\n\n---\n\nHi Priya,\n\nI hope your week is going well! I wanted to follow up on our conversation about the MylesCRM Pro plan for Safari Logistics.\n\nGiven your team's need to streamline procurement tracking across 3 depots, I believe our Pipeline + Invoicing module would save your team roughly 8 hours/week in manual reporting.\n\nI'd love to schedule a 20-minute call to walk through a quick demo tailored to your workflow. Are you available Thursday or Friday this week?\n\nLooking forward to it,\nMyles\n\n---\n*Want me to adjust the tone or add specific details?*",
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("risk") || lower.includes("cold")) return MOCK_RESPONSES["which deals are at risk"];
  if (lower.includes("follow-up") || lower.includes("draft") || lower.includes("safari")) return MOCK_RESPONSES["draft a follow-up"];
  return MOCK_RESPONSES.default;
}

const SCORED_LEADS = [
  { name: "Omar Hassan", company: "TechStartup UAE", score: 88, grade: "A", change: "+12", reason: "High engagement + strong firmographic fit" },
  { name: "Sofia Rodrigues", company: "EduTech Solutions", score: 85, grade: "A", change: "+5", reason: "VP-level title, replied to 3 emails" },
  { name: "Priya Nair", company: "Safari Logistics", score: 78, grade: "B", change: "+3", reason: "Active deal, recent meeting logged" },
  { name: "Kemi Adeyemi", company: "Realty Nigeria", score: 74, grade: "B", change: "-2", reason: "Existing customer, renewal opportunity" },
  { name: "James Mwangi", company: "Retail Hub Kenya", score: 61, grade: "C", change: "0", reason: "Small company, limited engagement" },
  { name: "David Ochieng", company: "FinTech Africa", score: 45, grade: "D", change: "-8", reason: "Last contact 1 week ago, no deal active" },
];

const FORECAST_DATA = {
  summary: "Based on your current pipeline of $247,200 with 9 open deals, Q2 2026 revenue is projected at $48,000–$72,000 depending on deal velocity. Safari Logistics and TechStartup UAE are your two most likely near-term closures.",
  months: [
    { month: "Apr 2026", pessimistic: 18000, realistic: 28000, optimistic: 42000 },
    { month: "May 2026", pessimistic: 22000, realistic: 35000, optimistic: 54000 },
    { month: "Jun 2026", pessimistic: 15000, realistic: 24000, optimistic: 38000 },
  ],
  topDeals: [
    { title: "Acme Corp Enterprise", value: 96000, probability: 75, action: "Accelerate — strong buying signals, push for signature this week" },
    { title: "TechStartup UAE Growth", value: 12000, probability: 88, action: "Close ASAP — high AI score, short sales cycle expected" },
    { title: "Global Retail SG", value: 48000, probability: 55, action: "Nurture — large deal, needs multi-stakeholder alignment" },
  ],
  risks: ["3 deals overdue on expected close dates", "No new leads added in the Negotiation stage"],
  opportunities: ["Referral program could unlock 2.3× conversion rate", "2 existing customers eligible for upsell to Enterprise"],
};

export default function AIPage() {
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scoringDone, setScoringDone] = useState(false);
  const [scoringLoading, setScoringLoading] = useState(false);
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailIntent, setEmailIntent] = useState("follow_up");
  const [emailTone, setEmailTone] = useState("professional");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content: msg, time: "now" };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const reply = getResponse(msg);
    setMessages((m) => [...m, { role: "assistant", content: reply, time: "now" }]);
    setLoading(false);
  };

  const runScoring = async () => {
    setScoringLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    setScoringDone(true);
    setScoringLoading(false);
  };

  const draftEmail = async () => {
    setEmailLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEmailDraft({
      subject: `Re: ${emailIntent === "follow_up" ? "Following up on our conversation" : emailIntent === "introduction" ? "Introduction — MylesCRM" : "Proposal: MylesCRM for your team"}`,
      body: `Hi [First Name],\n\nI hope this message finds you well. Following our recent conversation, I wanted to ${
        emailIntent === "follow_up" ? "check in and see if you had a chance to review the proposal I sent over" :
        emailIntent === "introduction" ? "formally introduce myself and share how MylesCRM can help your team" :
        "share a tailored proposal for your team's needs"
      }.\n\nWe've been helping companies like yours save 6+ hours/week on manual CRM work while improving deal close rates by an average of 18%.\n\nWould you be available for a quick 20-minute call this week?\n\nBest regards,\nMyles Ayany\nMylesoft Technologies\n+254 743 993 715`,
    });
    setEmailLoading(false);
  };

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "scoring", label: "Lead Scoring", icon: Target },
    { id: "email", label: "Email Drafting", icon: Mail },
    { id: "forecast", label: "Forecasting", icon: BarChart3 },
  ];

  const renderContent = (text: string) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**"))
        return <p key={i} className="font-semibold mt-2 mb-1">{line.slice(2, -2)}</p>;
      if (line.startsWith("- ") || line.startsWith("* "))
        return <li key={i} className="ml-4 text-sm">{line.slice(2)}</li>;
      if (line.match(/^\d+\./))
        return <p key={i} className="text-sm mt-1">{line}</p>;
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="text-sm">{line}</p>;
    });

  return (
    <div className="flex flex-col h-full p-6 gap-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-500 shadow-glow">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Powered by OpenRouter · claude-3.5-sonnet</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border bg-muted/30 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Chat ── */}
      {tab === "chat" && (
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex flex-1 flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-500 mt-1">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={msg.role === "user" ? "ai-message-user" : "ai-message-assistant"}>
                    {renderContent(msg.content)}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-xs font-bold text-white mt-1">
                      JA
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="ai-message-assistant">
                    <div className="flex gap-1.5 items-center py-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask anything about your CRM data..."
                  className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="w-64 shrink-0 space-y-3">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-medium">Quick Prompts</h3>
              </div>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground text-left transition-colors"
                  >
                    <span>{p}</span>
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lead Scoring ── */}
      {tab === "scoring" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
            <div>
              <h2 className="font-semibold">AI Lead Scoring</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Score all your contacts using AI to prioritize outreach
              </p>
            </div>
            <button
              onClick={runScoring}
              disabled={scoringLoading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {scoringLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Scoring...</>
              ) : (
                <><Zap className="h-4 w-4" /> Run AI Scoring</>
              )}
            </button>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b px-5 py-3.5 bg-muted/30">
              <div className="grid grid-cols-5 gap-4 text-xs font-medium text-muted-foreground">
                <span className="col-span-2">Contact</span>
                <span>Grade</span>
                <span>Score</span>
                <span>Reason</span>
              </div>
            </div>
            <div className="divide-y">
              {SCORED_LEADS.map((lead, i) => (
                <div key={i} className={`grid grid-cols-5 gap-4 px-5 py-4 items-center transition-all ${scoringDone ? "opacity-100" : "opacity-40"}`}>
                  <div className="col-span-2">
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.company}</p>
                  </div>
                  <div>
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold score-badge-${lead.grade}`}>
                      {lead.grade}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          lead.score >= 80 ? "bg-emerald-500" :
                          lead.score >= 60 ? "bg-blue-500" :
                          lead.score >= 40 ? "bg-amber-500" : "bg-red-400"
                        }`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono w-8">{lead.score}</span>
                    <span className={`text-xs ${lead.change.startsWith("+") ? "text-emerald-500" : lead.change.startsWith("-") ? "text-red-400" : "text-muted-foreground"}`}>
                      {lead.change}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{lead.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Email Drafting ── */}
      {tab === "email" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
              <h2 className="font-semibold">Email Settings</h2>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Intent</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["follow_up", "introduction", "proposal", "reminder", "thank_you"].map((i) => (
                    <button
                      key={i}
                      onClick={() => setEmailIntent(i)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        emailIntent === i ? "bg-primary text-white" : "border hover:bg-muted"
                      }`}
                    >
                      {i.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tone</label>
                <div className="mt-2 flex gap-2">
                  {["professional", "friendly", "urgent"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setEmailTone(t)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        emailTone === t ? "bg-primary text-white" : "border hover:bg-muted"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={draftEmail}
                disabled={emailLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {emailLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generate Email</>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            {emailDraft ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subject</label>
                  <p className="mt-1 font-medium text-sm">{emailDraft.subject}</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Body</label>
                  <pre className="mt-2 text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                    {emailDraft.body}
                  </pre>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                    Send Email
                  </button>
                  <button
                    onClick={draftEmail}
                    className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Mail className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium">No draft yet</p>
                <p className="text-xs text-muted-foreground mt-1">Configure your email settings and click Generate</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Forecasting ── */}
      {tab === "forecast" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">AI Revenue Forecast</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{FORECAST_DATA.summary}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {FORECAST_DATA.months.map((m) => (
              <div key={m.month} className="rounded-xl border bg-card p-4 shadow-sm">
                <h3 className="font-medium text-sm mb-3">{m.month}</h3>
                <div className="space-y-2">
                  {[
                    { label: "Pessimistic", value: m.pessimistic, color: "bg-red-400" },
                    { label: "Realistic", value: m.realistic, color: "bg-blue-500" },
                    { label: "Optimistic", value: m.optimistic, color: "bg-emerald-500" },
                  ].map((scenario) => (
                    <div key={scenario.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{scenario.label}</span>
                        <span className="font-mono font-medium">${scenario.value.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${scenario.color}`} style={{ width: `${(scenario.value / m.optimistic) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold mb-3">Top Deals to Watch</h3>
              <div className="space-y-3">
                {FORECAST_DATA.topDeals.map((d, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-sm">{d.title}</span>
                      <span className="text-sm font-mono text-primary">${d.value.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.action}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="font-semibold mb-3 text-red-500">Risks</h3>
                <ul className="space-y-2">
                  {FORECAST_DATA.risks.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-red-400 mt-0.5">▲</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="font-semibold mb-3 text-emerald-500">Opportunities</h3>
                <ul className="space-y-2">
                  {FORECAST_DATA.opportunities.map((o, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
