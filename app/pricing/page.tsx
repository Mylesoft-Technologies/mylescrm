import { CTASection, MarketingShell, PricingGrid, SectionHeader, faqs } from "@/components/marketing/site";

export const metadata = {
  title: "Pricing",
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
        <section className="bg-muted/20 px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Included in every plan"
              title="KSh pricing with a service-led implementation mindset."
              text="Every plan keeps the product local-first: KES defaults, Africa/Nairobi readiness, CRM fundamentals, and access to the MylesCRM team for setup guidance."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["KSh-first billing", "Pricing, sample dashboards, invoices, and default organization setup use KES/KSh."],
                ["M-Pesa-ready workflows", "Payment collection flows are prepared for East African business habits and mobile money expectations."],
                ["MylesCorp support culture", "The same service principle behind MylesCorp products guides onboarding, training, and improvement."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-border bg-muted/40 p-6">
                  <h2 className="font-semibold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              eyebrow="Questions"
              title="Plan questions, answered clearly."
              text="A quick guide for teams comparing MylesCRM with spreadsheets, legacy CRMs, or custom internal tools."
            />
            <div className="divide-y divide-border rounded-lg border border-border bg-card">
              {faqs.map((item) => (
                <div key={item.q} className="p-6">
                  <h2 className="font-semibold text-foreground">{item.q}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</p>
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
