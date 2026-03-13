"use client";
import { useState } from "react";
import { Phone, Mail, Users, FileText, Zap, CheckCircle2, Clock, Plus, Filter } from "lucide-react";
import { timeAgo } from "@/types";

const TYPE_ICONS: Record<string, any> = { call: Phone, email: Mail, meeting: Users, note: FileText, task: CheckCircle2 };
const TYPE_COLORS: Record<string, string> = {
  call: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  email: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  meeting: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  note: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  task: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  deal_won: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  deal_stage_change: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const DEMO = [
  { _id: "1", type: "call", title: "Discovery call with James Mwangi", description: "Discussed enterprise suite requirements. Follow-up needed.", status: "completed", contact: "James Mwangi", deal: "Safaricom Enterprise Suite", user: "You", createdAt: Date.now() - 1800000 },
  { _id: "2", type: "email", title: "Sent proposal to M-KOPA team", description: "Attached CRM integration spec and pricing sheet.", status: "completed", contact: "Sarah Ndung'u", deal: "M-KOPA CRM Integration", user: "You", createdAt: Date.now() - 7200000 },
  { _id: "3", type: "meeting", title: "Product demo — Andela", description: "30-min screen share showing pipeline and AI features.", status: "completed", contact: "David Otieno", deal: "Andela Recruitment Module", user: "You", createdAt: Date.now() - 86400000 },
  { _id: "4", type: "deal_won", title: "🎉 Deal WON — M-KOPA CRM Integration", description: "Contract signed. KES 280,000 deal closed.", status: "completed", contact: "Sarah Ndung'u", deal: "M-KOPA CRM Integration", user: "You", createdAt: Date.now() - 172800000 },
  { _id: "5", type: "note", title: "Note added: Kenya Airways budget freeze", description: "Client confirmed no budget until Q3 2025. Set reminder.", status: "completed", contact: "Anne Waweru", deal: "Kenya Airways Dashboard", user: "You", createdAt: Date.now() - 259200000 },
  { _id: "6", type: "task", title: "Follow up on Safaricom proposal", description: "Send revised pricing by EOD Friday.", status: "scheduled", contact: "James Mwangi", deal: "Safaricom Enterprise Suite", user: "You", createdAt: Date.now() - 345600000 },
];

export default function ActivitiesPage() {
  const [filter, setFilter] = useState("");
  const filtered = filter ? DEMO.filter((a) => a.type === filter) : DEMO;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
          <p className="text-sm text-muted-foreground">Full timeline of all CRM activity</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Log Activity
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          { type: "call", label: "Calls", icon: Phone },
          { type: "email", label: "Emails", icon: Mail },
          { type: "meeting", label: "Meetings", icon: Users },
          { type: "note", label: "Notes", icon: FileText },
          { type: "task", label: "Tasks", icon: CheckCircle2 },
        ].map((s) => (
          <button key={s.type} onClick={() => setFilter(filter === s.type ? "" : s.type)}
            className={"stat-card text-left transition-all " + (filter === s.type ? "ring-2 ring-primary" : "")}>
            <s.icon className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-lg font-bold">{DEMO.filter((a) => a.type === s.type).length}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.map((a, i) => {
          const Icon = TYPE_ICONS[a.type] ?? Zap;
          return (
            <div key={a._id} className="flex gap-4 rounded-xl border bg-card p-4 hover:bg-muted/20 transition-colors">
              <div className={"flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg " + (TYPE_COLORS[a.type] ?? "bg-muted text-muted-foreground")}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{a.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={"flex items-center gap-1 text-xs " + (a.status === "completed" ? "text-emerald-500" : "text-amber-500")}>
                      {a.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {a.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
                  </div>
                </div>
                {a.description && <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>}
                <div className="mt-1.5 flex items-center gap-3">
                  {a.contact && <span className="text-xs text-muted-foreground">👤 {a.contact}</span>}
                  {a.deal && <span className="text-xs text-muted-foreground">💼 {a.deal}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
