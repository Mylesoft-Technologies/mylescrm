"use client";

import { useState } from "react";
import {
  Plus, Download, Send, CreditCard, Smartphone, Search,
  MoreHorizontal, CheckCircle2, Clock, AlertTriangle,
  FileText, DollarSign, TrendingUp, ArrowUpRight, Loader2, Eye
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: any }> = {
  draft: { label: "Draft", class: "status-draft", icon: FileText },
  sent: { label: "Sent", class: "status-sent", icon: Send },
  paid: { label: "Paid", class: "status-paid", icon: CheckCircle2 },
  overdue: { label: "Overdue", class: "status-overdue", icon: AlertTriangle },
  partial: { label: "Partial", class: "status-partial", icon: Clock },
};

const MOCK_INVOICES = [
  { id: "INV-0001", client: "Acme Corp", email: "billing@acmecorp.com", amount: 48000, paid: 48000, currency: "USD", status: "paid", dueDate: "Mar 1", issueDate: "Feb 15", method: "stripe" },
  { id: "INV-0002", client: "Safari Logistics", email: "priya@safariltd.com", amount: 24000, paid: 0, currency: "USD", status: "sent", dueDate: "Mar 25", issueDate: "Mar 1", method: null },
  { id: "INV-0003", client: "TechStartup UAE", email: "omar@techstartup.ae", amount: 12000, paid: 0, currency: "USD", status: "overdue", dueDate: "Mar 10", issueDate: "Feb 25", method: null },
  { id: "INV-0004", client: "Retail Hub Kenya", email: "j.mwangi@retailhub.co.ke", amount: 3600, paid: 1800, currency: "USD", status: "partial", dueDate: "Mar 20", issueDate: "Mar 5", method: "mpesa" },
  { id: "INV-0005", client: "EduTech Solutions", email: "sofia@edutech.com", amount: 18000, paid: 0, currency: "USD", status: "draft", dueDate: "Apr 5", issueDate: "Mar 13", method: null },
  { id: "INV-0006", client: "FinTech Africa", email: "d.ochieng@fintech.io", amount: 36000, paid: 36000, currency: "USD", status: "paid", dueDate: "Feb 28", issueDate: "Feb 12", method: "stripe" },
];

const STATS = [
  { label: "Total Revenue", value: "$84,000", subtitle: "All time", icon: DollarSign, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { label: "Outstanding", value: "$35,800", subtitle: "3 invoices", icon: Clock, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { label: "Overdue", value: "$12,000", subtitle: "1 invoice", icon: AlertTriangle, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { label: "This Month", value: "$58,400", subtitle: "+22% vs last month", icon: TrendingUp, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
];

type PayModal = { invoiceId: string; client: string; amount: number } | null;

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payModal, setPayModal] = useState<PayModal>(null);
  const [payMethod, setPayMethod] = useState<"stripe" | "mpesa">("stripe");
  const [mpesaPhone, setMpesaPhone] = useState("0743993715");
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const filtered = MOCK_INVOICES.filter((inv) => {
    const matchSearch = !search || inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.includes(search);
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handlePay = async () => {
    setPayLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPayLoading(false);
    setPaySuccess(true);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices & Billing</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage invoices, payments, and subscriptions</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-semibold mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.subtitle}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1 bg-background">
          {["all", "draft", "sent", "paid", "overdue", "partial"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                statusFilter === s ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Invoice #</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((inv) => {
                const statusCfg = STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.id} className="group hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-medium">{inv.id}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{inv.issueDate}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{inv.client}</p>
                      <p className="text-xs text-muted-foreground">{inv.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-mono font-semibold">${inv.amount.toLocaleString()}</p>
                      {inv.paid > 0 && inv.paid < inv.amount && (
                        <p className="text-xs text-emerald-600 mt-0.5">
                          ${inv.paid.toLocaleString()} paid
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.class}`}>
                        <statusCfg.icon className="h-3 w-3" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{inv.dueDate}</td>
                    <td className="px-4 py-4">
                      {inv.method === "stripe" && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CreditCard className="h-3.5 w-3.5" /> Stripe
                        </div>
                      )}
                      {inv.method === "mpesa" && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                          <Smartphone className="h-3.5 w-3.5" /> M-Pesa
                        </div>
                      )}
                      {!inv.method && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="rounded-md p-1.5 hover:bg-muted transition-colors">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="rounded-md p-1.5 hover:bg-muted transition-colors">
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {["sent", "overdue", "partial"].includes(inv.status) && (
                          <button
                            onClick={() => { setPayModal({ invoiceId: inv.id, client: inv.client, amount: inv.amount - inv.paid }); setPaySuccess(false); }}
                            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
                          >
                            Pay
                          </button>
                        )}
                        <button className="rounded-md p-1.5 hover:bg-muted transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-2xl border bg-card shadow-2xl p-6">
            {paySuccess ? (
              <div className="text-center py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Payment Initiated!</h2>
                <p className="text-sm text-muted-foreground">
                  {payMethod === "mpesa"
                    ? `An M-Pesa STK push has been sent to ${mpesaPhone}. Please check your phone to complete payment.`
                    : "Stripe payment link has been sent to the client."}
                </p>
                <button onClick={() => setPayModal(null)} className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-1">Collect Payment</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  {payModal.client} · <span className="font-mono font-semibold text-foreground">${payModal.amount.toLocaleString()}</span>
                </p>

                {/* Method select */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    onClick={() => setPayMethod("stripe")}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${payMethod === "stripe" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-muted"}`}
                  >
                    <CreditCard className={`h-7 w-7 ${payMethod === "stripe" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">Stripe</span>
                    <span className="text-xs text-muted-foreground">Card / Bank</span>
                  </button>
                  <button
                    onClick={() => setPayMethod("mpesa")}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${payMethod === "mpesa" ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20" : "hover:bg-muted"}`}
                  >
                    <Smartphone className={`h-7 w-7 ${payMethod === "mpesa" ? "text-emerald-500" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">M-Pesa</span>
                    <span className="text-xs text-muted-foreground">STK Push</span>
                  </button>
                </div>

                {payMethod === "mpesa" && (
                  <div className="mb-5">
                    <label className="text-xs font-medium text-muted-foreground">M-Pesa Phone Number</label>
                    <input
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="07XXXXXXXXX"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">We'll send an STK push to this number</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setPayModal(null)}
                    className="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={payLoading}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
                      payMethod === "mpesa" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {payLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {payLoading ? "Processing..." : payMethod === "mpesa" ? "Send STK Push" : "Send Payment Link"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
