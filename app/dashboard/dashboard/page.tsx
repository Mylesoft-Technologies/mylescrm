"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  TrendingUp, Users, Building2, DollarSign, Target,
  ArrowUpRight, ArrowDownRight, Activity, Zap, AlertCircle,
  CheckCircle2, Clock, Star
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── Mock data (replace with real Convex queries) ──────────
const revenueData = [
  { month: "Aug", revenue: 28400, target: 32000 },
  { month: "Sep", revenue: 34200, target: 32000 },
  { month: "Oct", revenue: 29800, target: 35000 },
  { month: "Nov", revenue: 42100, target: 35000 },
  { month: "Dec", revenue: 38600, target: 38000 },
  { month: "Jan", revenue: 51200, target: 42000 },
  { month: "Feb", revenue: 47900, target: 45000 },
  { month: "Mar", revenue: 58400, target: 48000 },
];

const pipelineData = [
  { stage: "Lead", deals: 24, value: 120000, color: "#94a3b8" },
  { stage: "Qualified", deals: 18, value: 310000, color: "#60a5fa" },
  { stage: "Proposal", deals: 12, value: 245000, color: "#f59e0b" },
  { stage: "Negotiation", deals: 7, value: 189000, color: "#f97316" },
  { stage: "Won", deals: 31, value: 680000, color: "#22c55e" },
];

const activityData = [
  { day: "Mon", calls: 8, emails: 22, meetings: 3 },
  { day: "Tue", calls: 12, emails: 31, meetings: 5 },
  { day: "Wed", calls: 6, emails: 18, meetings: 4 },
  { day: "Thu", calls: 15, emails: 27, meetings: 6 },
  { day: "Fri", calls: 10, emails: 24, meetings: 2 },
  { day: "Sat", calls: 2, emails: 5, meetings: 1 },
  { day: "Sun", calls: 1, emails: 3, meetings: 0 },
];

const leadsSourceData = [
  { name: "Website", value: 35, color: "#3b6ef8" },
  { name: "Referral", value: 28, color: "#14b8a6" },
  { name: "Cold Outreach", value: 20, color: "#f59e0b" },
  { name: "Social Media", value: 12, color: "#f97316" },
  { name: "Events", value: 5, color: "#8b5cf6" },
];

const recentDeals = [
  { name: "Acme Corp - Enterprise Plan", value: 48000, stage: "Negotiation", probability: 75, assignee: "JA", change: "up" },
  { name: "TechStart Ltd - Growth", value: 12000, stage: "Proposal Sent", probability: 50, assignee: "PM", change: "up" },
  { name: "Retail Hub Kenya - Starter", value: 3600, stage: "Qualified", probability: 25, assignee: "JA", change: "down" },
  { name: "Safari Logistics - Pro", value: 24000, stage: "Negotiation", probability: 80, assignee: "PM", change: "up" },
  { name: "EduTech Solutions", value: 18000, stage: "Proposal Sent", probability: 60, assignee: "JA", change: "up" },
];

const StatCard = ({
  title, value, subtitle, icon: Icon, iconClass, trend, trendValue
}: {
  title: string; value: string; subtitle: string;
  icon: any; iconClass: string; trend?: "up" | "down"; trendValue?: string;
}) => (
  <div className="stat-card group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className={`stat-card-icon ${iconClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    {trendValue && (
      <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${
        trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
      }`}>
        {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {trendValue} vs last month
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg text-xs">
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{typeof p.value === "number" && p.value > 999
            ? `$${(p.value / 1000).toFixed(0)}k`
            : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, Myles 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening in your pipeline today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground border rounded-lg px-3 py-2 bg-muted/30">
          <Activity className="h-3.5 w-3.5 text-emerald-500" />
          <span>Live sync active</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$58,400"
          subtitle="March 2026"
          icon={DollarSign}
          iconClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend="up"
          trendValue="+22.1%"
        />
        <StatCard
          title="Active Deals"
          value="61"
          subtitle="$864,000 pipeline value"
          icon={TrendingUp}
          iconClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          trend="up"
          trendValue="+8 deals"
        />
        <StatCard
          title="Total Contacts"
          value="1,247"
          subtitle="89 added this month"
          icon={Users}
          iconClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          trend="up"
          trendValue="+7.7%"
        />
        <StatCard
          title="Win Rate"
          value="34.2%"
          subtitle="Avg deal size $18,900"
          icon={Target}
          iconClass="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          trend="up"
          trendValue="+2.4pp"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Actual vs Target (last 8 months)</p>
            </div>
            <span className="text-xs border rounded-full px-2.5 py-1 text-muted-foreground">Monthly</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b6ef8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b6ef8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b6ef8" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="target" name="Target" stroke="#14b8a6" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources Pie */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">Lead Sources</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Where your leads come from</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={leadsSourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {leadsSourceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {leadsSourceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="flex-1 text-muted-foreground">{item.name}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline Funnel */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">Pipeline Funnel</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Deals by stage</p>
          </div>
          <div className="space-y-2">
            {pipelineData.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{stage.stage}</span>
                  <span className="font-medium">{stage.deals} deals · ${(stage.value / 1000).toFixed(0)}k</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(stage.value / 680000) * 100}%`,
                      background: stage.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">Weekly Activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Calls, emails & meetings</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={activityData} barSize={8} margin={{ left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calls" name="Calls" fill="#3b6ef8" radius={[2, 2, 0, 0]} />
              <Bar dataKey="emails" name="Emails" fill="#14b8a6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="meetings" name="Meetings" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <Zap className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">AI Insights</h2>
              <p className="text-xs text-muted-foreground">Updated just now</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, color: "text-emerald-500", text: "3 hot leads haven't been contacted in 5+ days — follow up now." },
              { icon: AlertCircle, color: "text-amber-500", text: "Safari Logistics deal at 80% probability — push for close this week." },
              { icon: Star, color: "text-blue-500", text: "Referral leads convert 2.3× better. Consider a referral incentive program." },
              { icon: Clock, color: "text-purple-500", text: "Best email open time for your contacts: Tuesday 10–11 AM EAT." },
            ].map((insight, i) => (
              <div key={i} className="flex gap-2.5 text-xs">
                <insight.icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${insight.color}`} />
                <p className="text-muted-foreground leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Deals Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold">Hot Deals</h2>
          <a href="/dashboard/pipeline" className="text-xs text-primary hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Deal</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Value</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Probability</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentDeals.map((deal, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors cursor-pointer group">
                  <td className="px-5 py-3.5 font-medium group-hover:text-primary transition-colors">{deal.name}</td>
                  <td className="px-4 py-3.5 font-mono text-sm">${deal.value.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {deal.assignee}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {deal.change === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
