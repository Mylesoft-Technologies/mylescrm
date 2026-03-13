"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, TrendingUp, GitBranch,
  Mail, Calendar, BarChart3, Bot, Receipt, Settings,
  ChevronLeft, Zap, Bell, LogOut
} from "lucide-react";
import { cn } from "@/types";
import type { User } from "@workos-inc/node";

const NAV = [
  { group: "Overview", items: [
    { label: "Dashboard", href: "/dashboard/dashboard", icon: LayoutDashboard },
  ]},
  { group: "CRM", items: [
    { label: "Contacts", href: "/dashboard/contacts", icon: Users },
    { label: "Companies", href: "/dashboard/companies", icon: Building2 },
    { label: "Deals", href: "/dashboard/deals", icon: TrendingUp },
    { label: "Pipeline", href: "/dashboard/pipeline", icon: GitBranch },
  ]},
  { group: "Engage", items: [
    { label: "Activities", href: "/dashboard/activities", icon: Zap },
    { label: "Emails", href: "/dashboard/emails", icon: Mail },
    { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  ]},
  { group: "Intelligence", items: [
    { label: "AI Assistant", href: "/dashboard/ai", icon: Bot },
    { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  ]},
  { group: "Finance", items: [
    { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
    { label: "Billing", href: "/dashboard/billing", icon: Receipt },
  ]},
  { group: "Settings", items: [
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ]},
];

interface Props { user: User }

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="mylescrm-sidebar flex w-60 flex-shrink-0 flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-[hsl(var(--sidebar-border))] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-[hsl(var(--sidebar-fg))]">MylesCRM</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hidden">
        {NAV.map((group) => (
          <div key={group.group} className="mb-1">
            <p className="mb-1 px-5 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-muted))]">
              {group.group}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "mylescrm-sidebar-item mx-2",
                    active && "active"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <div className="my-2 mx-4 border-b border-[hsl(var(--sidebar-border))]" />
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[hsl(var(--sidebar-fg))]">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-[10px] text-[hsl(var(--sidebar-muted))]">{user.email}</p>
          </div>
          <Link href="/api/auth/logout" className="text-[hsl(var(--sidebar-muted))] hover:text-red-400 transition-colors">
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
