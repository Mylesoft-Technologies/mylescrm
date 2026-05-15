import {
  CTASection,
  MarketingShell,
  ProductPreview,
  SectionHeader,
  industrySolutions,
} from "@/components/marketing/site";

export const metadata = {
  title: "Industries | MylesCRM",
  description: "Explore how MylesCRM supports SMEs, real estate, insurance, field sales, education, and AI-ready growth teams.",
};

export default function IndustriesPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Industries"
              title="CRM workflows shaped around the way African teams actually sell."
              text="MylesCRM is flexible enough for many sectors, but it is especially useful where relationships, timing, field activity, proposals, and repeat follow-up determine revenue."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {industrySolutions.map((solution) => (
                <div key={solution.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <solution.icon className="mb-4 h-6 w-6 text-[#1d5fd6]" />
                  <h2 className="text-lg font-semibold text-slate-950">{solution.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{solution.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">Shared operating layer</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Every industry still needs the same revenue discipline.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Capture the lead, understand the account, move the deal, send the follow-up, invoice cleanly, and report honestly. MylesCRM gives each sector a practical structure for that work.
              </p>
            </div>
            <ProductPreview />
          </div>
        </section>
        <CTASection />
      </main>
    </MarketingShell>
  );
}
