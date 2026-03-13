import { redirect } from "next/navigation";
import { getSignedInUser } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { Zap, ArrowRight, Check, Bot, TrendingUp, Users, GitBranch, BarChart3 } from "lucide-react";

export default async function HomePage() {
  const { user } = await getSignedInUser();
  if (user) redirect("/dashboard/dashboard");

  return (
    <div className="min-h-screen bg-[hsl(222,47%,6%)] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold">MylesCRM</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link href="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="mx-auto max-w-5xl px-8 pt-24 pb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <Bot className="h-3.5 w-3.5" />
          AI-powered CRM for modern sales teams
        </div>
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-balance">
          Close more deals with{" "}
          <span className="bg-gradient-to-r from-brand-400 to-teal-400 bg-clip-text text-transparent">
            AI-driven insights
          </span>
        </h1>
        <p className="mb-10 text-xl text-white/60 max-w-2xl mx-auto text-balance">
          MylesCRM combines intelligent lead scoring, AI email drafting, predictive forecasting, and a beautiful pipeline — all in one platform built for global teams.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold hover:bg-primary/90 transition-all hover:scale-105">
            Start 14-day free trial <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-white/80 hover:bg-white/5 transition-colors">
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-sm text-white/40">No credit card required · Cancel anytime</p>
      </div>

      {/* Feature grid */}
      <div className="mx-auto max-w-5xl px-8 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Bot, title: "AI Chat Assistant", desc: "Ask questions about your pipeline, get instant insights and recommendations." },
            { icon: TrendingUp, title: "Lead Scoring", desc: "AI scores every lead A–F based on engagement, demographics, and behavior." },
            { icon: GitBranch, title: "Kanban Pipeline", desc: "Drag-and-drop deal management with win probability and rotten deal alerts." },
            { icon: Users, title: "Contact Intelligence", desc: "Unified contact profiles with full activity timeline and company linkage." },
            { icon: BarChart3, title: "Revenue Forecasting", desc: "Pessimistic, realistic, and optimistic forecasts powered by AI." },
            { icon: Zap, title: "Email Sequences", desc: "AI-drafted emails and automated follow-up sequences via Resend." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <f.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <p className="mb-1.5 font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="mx-auto max-w-5xl px-8 pb-24">
        <h2 className="mb-12 text-center text-3xl font-bold">Simple, transparent pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Starter", price: "$29", desc: "For small teams", features: ["5 users", "1,000 contacts", "3 pipelines", "Email integration", "Basic reports"], cta: "Start free" },
            { name: "Growth", price: "$79", desc: "For scaling teams", features: ["25 users", "10,000 contacts", "Unlimited pipelines", "AI lead scoring", "Revenue forecasting", "Email sequences"], cta: "Start free", highlight: true },
            { name: "Enterprise", price: "$199", desc: "For large orgs", features: ["Unlimited users", "Unlimited contacts", "All AI features", "Full API access", "White-label", "SSO & SAML"], cta: "Contact sales" },
          ].map((p) => (
            <div key={p.name} className={`rounded-xl border p-6 ${p.highlight ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-white/5 bg-white/[0.02]"}`}>
              {p.highlight && <div className="mb-3 text-xs font-semibold text-primary uppercase tracking-wider">Most popular</div>}
              <p className="text-lg font-bold">{p.name}</p>
              <p className="text-sm text-white/50 mb-4">{p.desc}</p>
              <p className="text-3xl font-bold mb-1">{p.price}<span className="text-base font-normal text-white/50">/mo</span></p>
              <ul className="my-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="h-3.5 w-3.5 text-teal-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${p.highlight ? "bg-primary hover:bg-primary/90" : "border border-white/10 hover:bg-white/5"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-white/30">
        © 2025 MylesCRM by Mylesoft Technologies. Built with ❤️ for global sales teams.
      </footer>
    </div>
  );
}
