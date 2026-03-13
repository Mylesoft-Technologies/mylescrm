"use client";

import { useState } from "react";
import { Building2, Plus, Search, Globe, TrendingUp, Users, Briefcase } from "lucide-react";
import { timeAgo } from "@/types";
import toast from "react-hot-toast";

const TYPE_COLORS: Record<string, string> = {
  prospect: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  customer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  partner: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  vendor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  competitor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// Demo data
const DEMO = [
  { _id: "1", name: "Safaricom PLC", industry: "Telecommunications", type: "customer", size: "1000+", website: "https://safaricom.co.ke", domain: "safaricom.co.ke", updatedAt: Date.now() - 3600000 },
  { _id: "2", name: "Andela Kenya", industry: "Technology", type: "prospect", size: "201-500", website: "https://andela.com", domain: "andela.com", updatedAt: Date.now() - 86400000 },
  { _id: "3", name: "M-KOPA Solar", industry: "Energy", type: "partner", size: "201-500", website: "https://m-kopa.com", domain: "m-kopa.com", updatedAt: Date.now() - 172800000 },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [companies, setCompanies] = useState(DEMO);
  const [newCompany, setNewCompany] = useState({ name: "", industry: "", website: "", type: "prospect", size: "" });

  const filtered = companies.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && c.type !== filterType) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newCompany.name) return toast.error("Company name is required");
    const id = String(Date.now());
    setCompanies([{ _id: id, ...newCompany, domain: "", updatedAt: Date.now() }, ...companies]);
    setNewCompany({ name: "", industry: "", website: "", type: "prospect", size: "" });
    setShowAdd(false);
    toast.success("Company added!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">Manage your accounts and organizations</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Company
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: companies.length, icon: Building2, color: "text-blue-500" },
          { label: "Customers", value: companies.filter((c) => c.type === "customer").length, icon: TrendingUp, color: "text-emerald-500" },
          { label: "Prospects", value: companies.filter((c) => c.type === "prospect").length, icon: Users, color: "text-amber-500" },
          { label: "Partners", value: companies.filter((c) => c.type === "partner").length, icon: Briefcase, color: "text-purple-500" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className={"h-4 w-4 " + s.color} />
            </div>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 flex-1 max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none">
          <option value="">All types</option>
          {["prospect", "customer", "partner", "vendor", "competitor"].map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              {["Company", "Type", "Industry", "Size", "Website", "Updated"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center text-sm text-muted-foreground"><Building2 className="mx-auto mb-3 h-8 w-8 opacity-30" />No companies found.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c._id} className="border-b hover:bg-muted/20 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold">{c.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      {c.domain && <p className="text-xs text-muted-foreground">{c.domain}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + (TYPE_COLORS[c.type] ?? "")}>{c.type}</span></td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{c.industry || "—"}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{c.size || "—"}</td>
                <td className="px-4 py-3">{c.website ? <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline"><Globe className="h-3 w-3" /> Visit</a> : <span className="text-sm text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{timeAgo(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border bg-card shadow-2xl p-6">
            <h2 className="mb-5 text-lg font-semibold">Add Company</h2>
            <div className="space-y-4">
              {([{ label: "Company Name *", key: "name", placeholder: "Acme Corp" }, { label: "Industry", key: "industry", placeholder: "Technology" }, { label: "Website", key: "website", placeholder: "https://acme.com" }] as const).map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                  <input value={(newCompany as any)[f.key]} onChange={(e) => setNewCompany({ ...newCompany, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Type</label>
                <select value={newCompany.type} onChange={(e) => setNewCompany({ ...newCompany, type: e.target.value })} className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none">
                  {["prospect", "customer", "partner", "vendor"].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">Add Company</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
