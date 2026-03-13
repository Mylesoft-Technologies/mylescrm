"use client";
import { useState } from "react";
import { Mail, Plus, Send, Eye, MousePointerClick, AlertTriangle, Search, Inbox, Zap } from "lucide-react";
import { timeAgo } from "@/types";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  opened: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  clicked: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  bounced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const DEMO = [
  { _id: "1", subject: "Proposal: MylesCRM Enterprise Suite", to: ["james@safaricom.co.ke"], status: "opened", sentAt: Date.now()-3600000, openedAt: Date.now()-1800000 },
  { _id: "2", subject: "Follow-up: CRM Integration Demo", to: ["sarah@m-kopa.com"], status: "clicked", sentAt: Date.now()-7200000 },
  { _id: "3", subject: "Thank you for your time — Andela", to: ["david@andela.com"], status: "delivered", sentAt: Date.now()-86400000 },
  { _id: "4", subject: "Q1 Check-in & Product Updates", to: ["anne@kenya-airways.com"], status: "bounced", sentAt: Date.now()-172800000 },
];

const TEMPLATES = [
  { name: "Cold Outreach", category: "Prospecting", subject: "Quick intro — {{companyName}}" },
  { name: "Follow Up #1", category: "Follow-up", subject: "Re: our conversation" },
  { name: "Proposal Sent", category: "Sales", subject: "Proposal attached — {{dealName}}" },
  { name: "Thank You", category: "Closing", subject: "Thank you, {{firstName}}!" },
];

export default function EmailsPage() {
  const [tab, setTab] = useState<"sent" | "templates" | "compose">("sent");
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleAiDraft = async () => {
    setAiGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setCompose({
      to: compose.to,
      subject: "Following up on our conversation",
      body: `<p>Hi there,</p><p>Hope you're doing well! I wanted to follow up on our recent conversation about MylesCRM and see if you had any questions about the proposal.</p><p>We're excited about the possibility of working together and helping your team close more deals with AI-powered insights.</p><p>Would you have 15 minutes this week for a quick call?</p><p>Best regards</p>`
    });
    setAiGenerating(false);
    toast.success("AI draft generated!");
  };

  const handleSend = async () => {
    if (!compose.to || !compose.subject) return toast.error("Please fill in all fields");
    toast.success("Email sent via Resend!");
    setCompose({ to: "", subject: "", body: "" });
    setTab("sent");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Emails</h1>
          <p className="text-sm text-muted-foreground">Outreach, templates and tracking via Resend</p>
        </div>
        <button onClick={() => setTab("compose")} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Compose
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Sent", value: DEMO.filter(e=>e.status!=="draft").length, icon: Send, color: "text-blue-500" },
          { label: "Opened", value: DEMO.filter(e=>["opened","clicked"].includes(e.status)).length, icon: Eye, color: "text-emerald-500" },
          { label: "Clicked", value: DEMO.filter(e=>e.status==="clicked").length, icon: MousePointerClick, color: "text-teal-500" },
          { label: "Bounced", value: DEMO.filter(e=>e.status==="bounced").length, icon: AlertTriangle, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className={"h-4 w-4 " + s.color} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
        {(["sent","templates","compose"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"rounded-md px-4 py-1.5 text-sm font-medium transition-colors " + (tab===t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "sent" && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30">{["Subject","To","Status","Sent"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody>
              {DEMO.map((e) => (
                <tr key={e._id} className="border-b hover:bg-muted/20 cursor-pointer">
                  <td className="px-4 py-3 text-sm font-medium">{e.subject}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.to[0]}</td>
                  <td className="px-4 py-3"><span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + (STATUS_COLORS[e.status]??"")}>{e.status}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{timeAgo(e.sentAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "templates" && (
        <div className="grid grid-cols-2 gap-4">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-sm">{t.name}</p>
                <span className="text-xs text-muted-foreground rounded-full border px-2 py-0.5">{t.category}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.subject}</p>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-lg border py-1.5 text-xs font-medium hover:bg-muted transition-colors">Use Template</button>
                <button className="flex-1 rounded-lg bg-muted py-1.5 text-xs font-medium hover:bg-muted/70 transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "compose" && (
        <div className="rounded-xl border bg-card p-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">To</label>
              <input value={compose.to} onChange={e=>setCompose({...compose,to:e.target.value})} placeholder="recipient@company.com" className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Subject</label>
              <input value={compose.subject} onChange={e=>setCompose({...compose,subject:e.target.value})} placeholder="Email subject…" className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">Body</label>
                <button onClick={handleAiDraft} disabled={aiGenerating} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">
                  <Zap className="h-3 w-3" /> {aiGenerating ? "AI drafting…" : "AI Draft"}
                </button>
              </div>
              <textarea value={compose.body} onChange={e=>setCompose({...compose,body:e.target.value})} rows={8} placeholder="Start writing or use AI draft…" className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTab("sent")} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSend} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                <Send className="h-3.5 w-3.5" /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
