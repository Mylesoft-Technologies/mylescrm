"use client";
import { useState } from "react";
import { Receipt, Plus, Search, DollarSign, Clock, CheckCircle2, AlertTriangle, Send, Smartphone } from "lucide-react";
import { formatCurrency } from "@/types";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const DEMO = [
  { _id:"1", invoiceNumber:"INV-0001", contact:"James Mwangi", company:"Safaricom PLC", status:"paid", total:450000, paidAmount:450000, currency:"KES", dueAt:Date.now()-864000000 },
  { _id:"2", invoiceNumber:"INV-0002", contact:"David Otieno", company:"Andela Kenya", status:"sent", total:190000, paidAmount:0, currency:"KES", dueAt:Date.now()+1728000000 },
  { _id:"3", invoiceNumber:"INV-0003", contact:"Sarah Ndungu", company:"M-KOPA Solar", status:"overdue", total:280000, paidAmount:0, currency:"KES", dueAt:Date.now()-432000000 },
  { _id:"4", invoiceNumber:"INV-0004", contact:"Anne Waweru", company:"Kenya Airways", status:"draft", total:620000, paidAmount:0, currency:"KES", dueAt:Date.now()+3456000000 },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [mpesaModal, setMpesaModal] = useState<any>(null);
  const [mpesaPhone, setMpesaPhone] = useState("");

  const filtered = DEMO.filter((i) => !search || i.invoiceNumber.includes(search) || i.contact.toLowerCase().includes(search.toLowerCase()));
  const totalRevenue = DEMO.filter(i=>i.status==="paid").reduce((s,i)=>s+i.total,0);
  const outstanding = DEMO.filter(i=>["sent","partial"].includes(i.status)).reduce((s,i)=>s+(i.total-i.paidAmount),0);

  const handleMpesa = async () => {
    if (!mpesaPhone) return toast.error("Enter M-Pesa number");
    toast.loading("Sending STK Push...", { id: "mpesa" });
    await new Promise(r=>setTimeout(r,2000));
    toast.success("STK Push sent! Check your phone.", { id: "mpesa" });
    setMpesaModal(null); setMpesaPhone("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Invoices</h1><p className="text-sm text-muted-foreground">Billing via Stripe & M-Pesa Daraja</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"><Plus className="h-4 w-4" /> New Invoice</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue,"KES"), icon: DollarSign, color: "text-emerald-500" },
          { label: "Outstanding", value: formatCurrency(outstanding,"KES"), icon: Clock, color: "text-amber-500" },
          { label: "Overdue", value: DEMO.filter(i=>i.status==="overdue").length, icon: AlertTriangle, color: "text-red-500" },
          { label: "Paid", value: DEMO.filter(i=>i.status==="paid").length, icon: CheckCircle2, color: "text-teal-500" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">{s.label}</p><s.icon className={"h-4 w-4 "+s.color} /></div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 w-64">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invoices…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/30">{["Invoice","Client","Status","Amount","Due","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv._id} className="border-b hover:bg-muted/20">
                <td className="px-4 py-3 text-sm font-mono font-medium">{inv.invoiceNumber}</td>
                <td className="px-4 py-3"><p className="text-sm font-medium">{inv.contact}</p><p className="text-xs text-muted-foreground">{inv.company}</p></td>
                <td className="px-4 py-3"><span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium "+(STATUS_COLORS[inv.status]??"")}>{inv.status}</span></td>
                <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(inv.total,inv.currency)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(inv.dueAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {inv.status!=="paid" && (
                    <div className="flex gap-1">
                      <button onClick={()=>toast.success("Invoice sent!")} className="flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-muted"><Send className="h-3 w-3"/>Send</button>
                      <button onClick={()=>setMpesaModal(inv)} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"><Smartphone className="h-3 w-3"/>M-Pesa</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mpesaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600"><Smartphone className="h-5 w-5 text-white" /></div>
              <div><p className="font-semibold">M-Pesa STK Push</p><p className="text-xs text-muted-foreground">{mpesaModal.invoiceNumber} · {formatCurrency(mpesaModal.total,mpesaModal.currency)}</p></div>
            </div>
            <label className="mb-1.5 block text-sm font-medium">Customer Phone</label>
            <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="0712345678" className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary mb-4" />
            <div className="flex gap-3">
              <button onClick={()=>setMpesaModal(null)} className="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleMpesa} className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Send Push</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
