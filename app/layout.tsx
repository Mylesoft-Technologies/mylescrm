import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "MylesCRM — AI-Powered CRM",
    template: "%s | MylesCRM",
  },
  description:
    "The modern AI-powered CRM for fast-growing teams. Manage contacts, deals, and pipelines with AI automation.",
  keywords: ["CRM", "sales", "pipeline", "AI", "contacts", "deals"],
  authors: [{ name: "Jonathan Myles" }],
  creator: "MylesCorp Technologies Ltd",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "MylesCRM — AI-Powered CRM",
    description: "The modern AI-powered CRM for fast-growing teams.",
    siteName: "MylesCRM",
  },
  twitter: {
    card: "summary_large_image",
    title: "MylesCRM",
    description: "AI-Powered CRM for modern sales teams",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ConvexClientProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.625rem",
                  fontSize: "0.875rem",
                },
              }}
            />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
