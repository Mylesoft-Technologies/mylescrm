"use client";

import { useState } from "react";
import {
  Search, Plus, Filter, Download, Upload, MoreHorizontal,
  Star, Mail, Phone, Building2, Tag, ChevronDown, SlidersHorizontal,
  UserCheck, Trash2, Bot, ArrowUpDown
} from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  lead: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  prospect: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  customer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  churned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const SCORE_COLORS: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  B: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  C: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  D: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  F: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// Mock data
const MOCK_CONTACTS = [
  { id: "1", firstName: "Amara", lastName: "Osei", email: "amara@techcorp.io", phone: "+254 712 345 678", company: "TechCorp Kenya", title: "CTO", status: "customer", score: 92, grade: "A", tags: ["VIP", "Enterprise"], lastContact: "2h ago", deals: 3, avatar: "AO" },
  { id: "2", firstName: "Priya", lastName: "Nair", email: "priya@safariltd.com", phone: "+254 733 891 234", company: "Safari Logistics", title: "Procurement Manager", status: "prospect", score: 78, grade: "B", tags: ["Logistics"], lastContact: "1d ago", deals: 1, avatar: "PN" },
  { id: "3", firstName: "James", lastName: "Mwangi", email: "j.mwangi@retailhub.co.ke", phone: "+254 722 567 890", company: "Retail Hub Kenya", title: "CEO", status: "lead", score: 61, grade: "C", tags: ["Retail", "SMB"], lastContact: "3d ago", deals: 0, avatar: "JM" },
  { id: "4", firstName: "Sofia", lastName: "Rodrigues", email: "sofia@edutech.com", phone: "+1 415 234 5678", company: "EduTech Solutions", title: "VP Sales", status: "prospect", score: 85, grade: "A", tags: ["SaaS", "EdTech"], lastContact: "4h ago", deals: 2, avatar: "SR" },
  { id: "5", firstName: "Kemi", lastName: "Adeyemi", email: "kemi@realtyng.com", phone: "+234 802 345 6789", company: "Realty Nigeria", title: "Director", status: "customer", score: 74, grade: "B", tags: ["Real Estate"], lastContact: "2d ago", deals: 4, avatar: "KA" },
  { id: "6", firstName: "David", lastName: "Ochieng", email: "d.ochieng@fintech.io", phone: "+254 711 234 567", company: "FinTech Africa", title: "Head of Engineering", status: "lead", score: 45, grade: "D", tags: ["FinTech"], lastContact: "1w ago", deals: 0, avatar: "DO" },
  { id: "7", firstName: "Mei", lastName: "Zhang", email: "mei@globalretail.sg", phone: "+65 9123 4567", company: "Global Retail SG", title: "Operations Manager", status: "prospect", score: 69, grade: "C", tags: ["E-commerce", "Asia"], lastContact: "5h ago", deals: 1, avatar: "MZ" },
  { id: "8", firstName: "Omar", lastName: "Hassan", email: "omar@techstartup.ae", phone: "+971 50 123 4567", company: "TechStartup UAE", title: "Founder", status: "lead", score: 88, grade: "A", tags: ["Startup", "MENA"], lastContact: "6h ago", deals: 0, avatar: "OH" },
];

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-teal-500 to-emerald-600",
  "from-purple-500 to-violet-600",
  "from-orange-400 to-red-500",
  "from-pink-400 to-rose-500",
];

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = MOCK_CONTACTS.filter((c) => {
    const matchesSearch =
      !search ||
      `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((c) => c.id)));
  };

  const getAvatarColor = (name: string) =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div className="p-6 space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_CONTACTS.length} total · {MOCK_CONTACTS.filter((c) => c.status === "customer").length} customers
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" /> Import
          </button>
          <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Contact
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 rounded-lg border p-1 bg-background">
          {["all", "lead", "prospect", "customer", "churned"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                statusFilter === s
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          {showFilters && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </button>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-primary/5 px-4 py-2.5 text-sm">
          <span className="font-medium text-primary">{selected.size} selected</span>
          <div className="h-4 w-px bg-border" />
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Bot className="h-3.5 w-3.5" /> AI Score
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Mail className="h-3.5 w-3.5" /> Send Email
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <UserCheck className="h-3.5 w-3.5" /> Assign
          </button>
          <button className="flex items-center gap-1.5 text-destructive hover:text-destructive/80 transition-colors ml-auto">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Contact <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Company</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">AI Score</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tags</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Deals</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Last Contact</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  className={`group hover:bg-muted/30 transition-colors ${
                    selected.has(contact.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(contact.id)}
                      onChange={() => toggleSelect(contact.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/dashboard/contacts/${contact.id}`} className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(contact.firstName)} text-xs font-bold text-white`}>
                        {contact.avatar}
                      </div>
                      <div>
                        <p className="font-medium hover:text-primary transition-colors">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {contact.email && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" /> {contact.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{contact.company}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5">{contact.title}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[contact.status]}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${SCORE_COLORS[contact.grade]}`}>
                        {contact.grade}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${contact.score}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{contact.score}/100</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <span key={tag} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      contact.deals > 0
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {contact.deals} {contact.deals === 1 ? "deal" : "deals"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{contact.lastContact}</td>
                  <td className="px-4 py-3.5">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1.5 hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {MOCK_CONTACTS.length} contacts
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`h-7 w-7 rounded-md text-xs transition-colors ${
                  p === 1
                    ? "bg-primary text-white"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
