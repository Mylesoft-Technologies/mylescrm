import {
  CTASection,
  MarketingShell,
  SectionHeader,
  implementationSteps,
} from "@/components/marketing/site";

export const metadata = {
  title: "Implementation | MylesCRM",
  description: "See the MylesCRM implementation process from discovery and configuration to migration, training, launch, and optimization.",
};

export default function ImplementationPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Implementation"
              title="A clear path from messy sales data to a working CRM."
              text="MylesCRM implementation follows the MylesCorp service principle: understand the local workflow, configure carefully, train practically, and measure impact after launch."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {implementationSteps.map((step, index) => (
                <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#132033] text-sm font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-5 text-lg font-semibold text-slate-950">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {[
              ["Week 1", "Process discovery, user roles, pipeline design, and data readiness review."],
              ["Week 2", "Configuration, imports, dashboards, invoice setup, and team walkthroughs."],
              ["Week 3+", "Live adoption support, manager reviews, AI workflow tuning, and reporting improvements."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">{title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
        <CTASection />
      </main>
    </MarketingShell>
  );
}
