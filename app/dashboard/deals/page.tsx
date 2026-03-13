"use client";
import { useState } from "react";
import { TrendingUp, Plus, Search, DollarSign, Target, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency, timeAgo } from "@/types";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  won: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};
const PRIORITY_COLORS: Record<string, string> = { high: "text-red-500", medium: "text-amber-500", low: "text-slate-400" };

const DEMO = [
  { _id: "1", title: "Safaricom Enterprise Suite", value: 450000, currency: "KES", status: "open", priority: "high", probability: 75, stage: "Negotiation", contact: "James Mwangi", company: "Safaricom PLC", updatedAt: Date.now() - 3600000 },
  { _id: "2", title: "M-KOPA CRM Integration", value: 280000, currency: "KES", status: "won", priority: "medium", probability: 100, stage: "Won", contact: "Sarah Ndung'u", company: "M-KOPA Solar", updatedAt: Date.now() - 86400000 },
  { _id: "3", title: "Andela Recruitment Module", value: 190000, currency: "KES", status: "open", priority: "medium", probability: 50, stage: "Proposal Sent", contact: "David Otieno", company: "Andela Kenya", updatedAt: Date.now() - 172800000 },
  { _id: "4", title: "Kenya Airways Dashboard", value: 620000, currency: "KES", status: "lost", priority: "high", probability: 0, stage: "Lost", contact: "Anne Waweru", company: "Kenya Airways", updatedAt: Date.now() - 259200000 },
];

export default function DealsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deals] = useState(DEMO);

  const filtered = deals.filter((d) => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && d.status !== filterStatus) return false;
    return true;
  });

  const open = deals.filter((d) => d.status === "open");
  const won = deals.filter((d) => d.status === "won");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deals</h1>
          <p className="text-sm text-muted-foreground">Track and manage all your opportunities</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Deal
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Open Deals", value: open.length, sub: formatCurrency(open.reduce((s,d)=>s+d.value,0), "KES"), icon: TrendingUp, color: "text-blue-500" },
          { label: "Total Pipeline", value: formatCurrency(open.reduce((s,d)=>s+d.value,0), "KES"), sub: `${open.length} deals`, icon: DollarSign, color: "text-primary" },
          { label: "Won This Month", value: won.length, sub: formatCurrency(won.reduce((s,d)=>s+d.value,0), "KES"), icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Win Rate", value: deals.filter(d=>d.status!=="open").length > 0 ? Math.round(won.length / deals.filter(d=>d.status!=="open").length * 100) + "%" : "—", sub: `${won.length} of ${deals.filter(d=>d.status!=="open").length} closed`, icon: Target, color: "text-teal-500" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className={"h-4 w-4 " + s.color} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 flex-1 max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deals…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none">
          <option value="">All statuses</option>
          {["open","won","lost","on_hold"].map((s) => <option key={s} value={s}>{s.replace("_"," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
        </select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              {["Deal", "Value", "Stage", "Status", "Priority", "Probability", "Updated"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d._id} className="border-b hover:bg-muted/20 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.contact} · {d.company}</p>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(d.value, d.currency)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{d.stage}</td>
                <td className="px-4 py-3"><span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + (STATUS_COLORS[d.status] ?? "")}>{d.status.replace("_"," ")}</span></td>
                <td className="px-4 py-3"><span className={"text-xs font-semibold " + (PRIORITY_COLORS[d.priority] ?? "")}>{d.priority}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: d.probability + "%" }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.probability}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{timeAgo(d.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
