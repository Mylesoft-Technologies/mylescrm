import {
  CTASection,
  MarketingShell,
  MylesCorpBand,
  SectionHeader,
  ValuesGrid,
  mylesCorpStats,
  productPillars,
} from "@/components/marketing/site";

export const metadata = {
  title: "About",
  description: "Learn how MylesCRM carries the MylesCorp mission, values, and African innovation focus into customer relationship management.",
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="About MylesCRM"
              title="A MylesCorp product built for teams that cannot afford missed follow-ups."
              text="MylesCRM is customer relationship management shaped by the same MylesCorp mission: transforming African industries through intelligent, practical software that drives efficiency, accessibility, and sustainable growth."
            />
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {mylesCorpStats.map(([value, label]) => (
                <div key={label} className="rounded-lg border border-border bg-card p-5 text-center shadow-sm">
                  <p className="text-2xl font-semibold text-foreground">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Mission</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Turn relationship work into measurable growth.</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  MylesCRM helps organizations capture customer context, act on the right opportunities, and build operating discipline around follow-up, forecasting, invoices, and retention.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Vision</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Be the trusted CRM for African sales teams.</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  The long-term goal is a CRM that bridges the digital divide for SMEs, institutions, and enterprises by making powerful sales systems simple, local, and AI-ready.
                </p>
              </div>
            </div>
            <div className="mt-10 rounded-lg border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">How the MylesCorp approach becomes CRM practice</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-3">
                {[
                  ["Discovery", "Understand the actual sales motion before forcing teams into rigid software habits."],
                  ["Design", "Create practical screens that are fast to scan, local to the market, and respectful of daily sales work."],
                  ["Deployment", "Support onboarding, training, iteration, and measurable impact after the product goes live."],
                ].map(([title, text]) => (
                  <div key={title}>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted/20 px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Core values"
              title="The M.Y.L.E.S. principle cuts across every product."
              text="These values are adapted from MylesCorp's operating framework and shape how MylesCRM is designed, supported, and improved."
            />
            <ValuesGrid />
          </div>
        </section>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Product identity"
              title="MylesCRM belongs to a bigger African innovation story."
              text="The CRM is focused on sales teams, but it inherits a broad product culture built across education, healthcare, agriculture, transport, and business operations."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {productPillars.map((pillar) => (
                <div key={pillar.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <pillar.icon className="mb-4 h-6 w-6 text-primary" />
                  <h2 className="font-semibold text-foreground">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <MylesCorpBand />
        <CTASection />
      </main>
    </MarketingShell>
  );
}
