"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Switch theme"
      className="relative inline-flex h-9 w-[72px] items-center justify-center rounded-full border border-border bg-background/80 px-2 transition-colors"
    >
      <span
        aria-hidden="true"
        className="absolute h-7 w-7 translate-x-[18px] rounded-full bg-muted shadow-sm transition-transform dark:-translate-x-[18px]"
      />

      <div className="relative z-10 flex w-full items-center justify-between">
        <Moon
          className="h-4 w-4 opacity-35 transition-opacity dark:text-secondary dark:opacity-100"
          aria-hidden="true"
          strokeWidth={1.8}
        />
        <Sun
          className="h-4 w-4 opacity-100 transition-opacity dark:opacity-35"
          aria-hidden="true"
          strokeWidth={1.8}
        />
      </div>
    </button>
  );
}
