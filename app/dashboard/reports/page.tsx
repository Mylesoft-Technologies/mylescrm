"use client";
import { useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Bot, Download } from "lucide-react";
import { formatCurrency } from "@/types";

const MONTHLY = [
  { month: "Sep", revenue: 420000, deals: 3 }, { month: "Oct", revenue: 580000, deals: 5 },
  { month: "Nov", revenue: 310000, deals: 2 }, { month: "Dec", revenue: 760000, deals: 6 },
  { month: "Jan", revenue: 540000, deals: 4 }, { month: "Feb", revenue: 890000, deals: 7 },
];
const MAX_REV = Math.max(...MONTHLY.map(m => m.revenue));

const PIPELINE = [
  { stage: "Lead", count: 24, value: 840000, color: "#94a3b8" },
  { stage: "Qualified", count: 15, value: 1250000, color: "#60a5fa" },
  { stage: "Proposal", count: 8, value: 980000, color: "#f59e0b" },
  { stage: "Negotiation", count: 5, value: 720000, color: "#f97316" },
  { stage: "Won", count: 12, value: 1860000, color: "#22c55e" },
];
const TOTAL_PIPE = PIPELINE.reduce((s,p)=>s+p.value,0);

export default function ReportsPage() {
  const [period, setPeriod] = useState("6m");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Revenue, pipeline, and performance analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border bg-muted/30 p-1">
            {["1m","3m","6m","1y"].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} className={"rounded-md px-3 py-1 text-xs font-medium transition-colors " + (period===p?"bg-card shadow-sm":"text-muted-foreground hover:text-foreground")}>{p}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(3500000,"KES"), change: +23, icon: DollarSign, color: "bg-primary/10 text-primary" },
          { label: "Deals Won", value: "12", change: +3, icon: TrendingUp, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
          { label: "New Contacts", value: "47", change: +18, icon: Users, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
          { label: "Avg Deal Size", value: formatCurrency(291666,"KES"), change: -5, icon: BarChart3, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <div className={"flex h-8 w-8 items-center justify-center rounded-lg " + s.color}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <div className={"mt-1.5 flex items-center gap-1 text-xs font-medium " + (s.change >= 0 ? "text-emerald-500" : "text-red-500")}>
              {s.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(s.change)}% vs last period
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-3 rounded-xl border bg-card p-5">
          <h3 className="mb-5 font-semibold">Monthly Revenue (KES)</h3>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="relative w-full group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrency(m.revenue,"KES")}
                  </div>
                  <div
                    className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: Math.max(8, (m.revenue / MAX_REV) * 120) + "px" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline by Stage */}
        <div className="col-span-2 rounded-xl border bg-card p-5">
          <h3 className="mb-5 font-semibold">Pipeline by Stage</h3>
          <div className="space-y-3">
            {PIPELINE.map((p) => (
              <div key={p.stage}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{p.stage} ({p.count})</span>
                  <span className="font-medium">{formatCurrency(p.value,"KES")}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: (p.value/TOTAL_PIPE*100)+"%", backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-teal-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">AI Insights</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">POWERED BY AI</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: "opportunity", text: "5 deals in Negotiation stage have been idle for 7+ days. Consider sending a follow-up email to accelerate closure." },
            { type: "risk", text: "Win rate dropped 8% this month. Top factor: deals without scheduled follow-up tasks are 3x more likely to be lost." },
            { type: "forecast", text: "Based on current pipeline velocity, you are on track to exceed February target by 12%. Focus on 3 high-probability deals." },
          ].map((i, idx) => (
            <div key={idx} className="rounded-lg border bg-card/70 p-3">
              <span className={"mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " + (i.type==="opportunity"?"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400":i.type==="risk"?"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400":"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400")}>
                {i.type}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">{i.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
