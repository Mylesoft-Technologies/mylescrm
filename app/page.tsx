import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  CTASection,
  FeatureGrid,
  FloatingHomeActions,
  MarketingShell,
  PricingGrid,
  ProductPreview,
  faqs,
  proofStats,
  useCases,
} from "@/components/marketing/site";

export default function HomePage() {
  return (
    <MarketingShell>
      <main>
        <section className="bg-white px-5 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-[#1d5fd6]">
                <TrendingUp className="h-4 w-4" />
                AI-powered CRM for serious sales teams
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                MylesCRM
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Manage leads, contacts, deals, email follow-ups, invoices, and sales forecasts from one polished CRM built for ambitious teams in East Africa and beyond.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1d5fd6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#174fb5]">
                  Book a demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/features" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                  Explore features
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {proofStats.map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">Why teams choose it</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                The core CRM work, rebuilt around speed and accountability.
              </h2>
            </div>
            <FeatureGrid />
          </div>
        </section>

        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">Use cases</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Built for teams where follow-up, timing, and relationship memory matter.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                MylesCRM fits sales-driven organizations that need visibility without forcing reps into heavy, slow software.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <item.icon className="mb-3 h-5 w-5 text-[#1d5fd6]" />
                  <h3 className="font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">Operating model</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                  From first touch to paid invoice.
                </h2>
              </div>
              <p className="text-base leading-7 text-slate-600">
                The public site research pointed to a simple truth: buyers need to see the complete customer journey quickly. MylesCRM presents that journey as one connected sales workspace.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { title: "Capture", text: "Create leads, import contacts, and assign ownership.", icon: MessageSquareText },
                { title: "Prioritize", text: "Use AI scoring and deal context to focus the day.", icon: BarChart3 },
                { title: "Close", text: "Move deals, send follow-ups, and track commitments.", icon: CheckCircle2 },
                { title: "Retain", text: "Manage invoices, payments, reports, and customer history.", icon: ShieldCheck },
              ].map(({ title, text, icon: Icon }) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <Icon className="mb-4 h-6 w-6 text-[#1d5fd6]" />
                  <h3 className="font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Start focused, then scale the sales engine.
              </h2>
            </div>
            <PricingGrid />
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Questions before you book?</h2>
            </div>
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {faqs.map((item) => (
                <div key={item.q} className="p-6">
                  <h3 className="font-semibold text-slate-950">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <FloatingHomeActions />
    </MarketingShell>
  );
}
