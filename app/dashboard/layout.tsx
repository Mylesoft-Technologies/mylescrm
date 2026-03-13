"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, Building2, TrendingUp, Kanban,
  Calendar, Mail, FileText, BarChart3, Bot, CreditCard,
  Settings, Bell, Search, ChevronDown, Sun, Moon, LogOut,
  Menu, X, Zap, Target, Activity, ChevronRight
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "CRM",
    items: [
      { href: "/dashboard/contacts", label: "Contacts", icon: Users },
      { href: "/dashboard/companies", label: "Companies", icon: Building2 },
      { href: "/dashboard/deals", label: "Deals", icon: TrendingUp },
      { href: "/dashboard/pipeline", label: "Pipeline", icon: Kanban },
      { href: "/dashboard/activities", label: "Activities", icon: Activity },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/dashboard/emails", label: "Emails", icon: Mail },
      { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/dashboard/ai", label: "AI Assistant", icon: Bot },
      { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/dashboard/billing", label: "Invoices & Billing", icon: CreditCard },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`mylescrm-sidebar fixed inset-y-0 left-0 z-30 flex w-64 flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-semibold text-white">MylesCRM</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white/40 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Org switcher */}
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 text-primary text-xs font-bold">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">My Workspace</p>
            <p className="text-xs text-white/40">Free Plan</p>
          </div>
          <ChevronDown className="h-4 w-4 text-white/40" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-hidden px-3 py-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`mylescrm-sidebar-item ${isActive ? "active" : ""}`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/8 p-3 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center text-xs font-bold text-white">
              JA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">Jonathan Ayany</p>
              <p className="text-xs text-white/40 truncate">ayany004@gmail.com</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/30" />
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <button
            onClick={() => setCmdOpen(true)}
            className="flex flex-1 max-w-sm items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/70 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search anything...</span>
            <kbd className="ml-auto hidden sm:flex items-center gap-1 text-xs border rounded px-1.5 py-0.5 bg-background">
              <span>⌘</span>K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-500 text-xs font-bold text-white cursor-pointer">
              JA
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
