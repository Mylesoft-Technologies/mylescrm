import {
  CTASection,
  FeatureGrid,
  MarketingShell,
  ProductPreview,
  SectionHeader,
  productPillars,
} from "@/components/marketing/site";

export const metadata = {
  title: "Features | MylesCRM",
  description: "Explore MylesCRM features for contacts, pipelines, AI sales insight, reporting, emails, invoicing, and payments.",
};

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Features"
              title="Everything your sales team needs to follow up faster."
              text="MylesCRM brings customer records, deal movement, AI guidance, reporting, and payment workflows into one focused sales workspace."
            />
            <FeatureGrid />
          </div>
        </section>
        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Workspace"
              title="A practical operating system for revenue."
              text="The interface is designed for fast scanning, clear ownership, and repeated daily use by reps, managers, and founders."
            />
            <ProductPreview />
          </div>
        </section>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Production workflows"
              title="Pages and workflows that support the full customer lifecycle."
              text="The product is organized around daily jobs: finding the right lead, knowing the next action, sending the follow-up, closing the deal, and keeping the customer relationship healthy."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Contacts", "Customer records, companies, lead scores, ownership, tags, and activity history."],
                ["Pipeline", "Kanban deal stages, value tracking, close probability, priorities, and expected dates."],
                ["AI assistant", "Lead scoring, email drafting, risk detection, and revenue forecasting support."],
                ["Billing", "Invoices, payment status, M-Pesa-ready collection flows, and KSh-first reporting."],
                ["Reports", "Revenue snapshots, pipeline health, activity trends, and deal performance."],
                ["Calendar", "Meeting visibility and follow-up discipline for reps and managers."],
                ["Email", "Sales communication workflows tied back to customer context."],
                ["Settings", "Organization defaults, including KES currency and Africa/Nairobi timezone."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="font-semibold text-slate-950">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="MylesCorp advantage"
              title="Designed for local growth, not imported complexity."
              text="MylesCRM combines proven CRM habits with the MylesCorp product philosophy: local expertise, AI where it helps, and service-minded implementation."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {productPillars.map((pillar) => (
                <div key={pillar.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <pillar.icon className="mb-4 h-6 w-6 text-[#1d5fd6]" />
                  <h2 className="font-semibold text-slate-950">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.text}</p>
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
