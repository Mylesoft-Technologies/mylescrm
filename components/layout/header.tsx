"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell, Search, Sun, Moon, Command } from "lucide-react";
import { useTheme } from "next-themes";
import { timeAgo } from "@/types";
import type { User } from "@workos-inc/node";

interface Props { user: User }

export function DashboardHeader({ user }: Props) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground w-64 cursor-pointer hover:border-primary/50 transition-colors">
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1">Search anything…</span>
        <kbd className="flex items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[10px]">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors relative"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border bg-card shadow-xl">
              <div className="flex items-center justify-between border-b p-4">
                <p className="font-semibold text-sm">Notifications</p>
                <button className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground">
                You're all caught up! 🎉
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
      </div>
    </header>
  );
}
