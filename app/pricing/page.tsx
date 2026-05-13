import { CTASection, MarketingShell, PricingGrid, SectionHeader, faqs } from "@/components/marketing/site";

export const metadata = {
  title: "Pricing | MylesCRM",
  description: "Simple MylesCRM pricing for starter, growth, and enterprise sales teams.",
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Pricing"
              title="Choose the CRM plan that matches your sales motion."
              text="Start with the essentials, then add AI, forecasting, automation, and deeper reporting as your pipeline grows."
            />
            <PricingGrid />
          </div>
        </section>
        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              eyebrow="Questions"
              title="Plan questions, answered clearly."
              text="A quick guide for teams comparing MylesCRM with spreadsheets, legacy CRMs, or custom internal tools."
            />
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {faqs.map((item) => (
                <div key={item.q} className="p-6">
                  <h2 className="font-semibold text-slate-950">{item.q}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CTASection />
      </main>
    </MarketingShell>
  );
}
