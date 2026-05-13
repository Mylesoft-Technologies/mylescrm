import { CTASection, FeatureGrid, MarketingShell, ProductPreview, SectionHeader } from "@/components/marketing/site";

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
        <CTASection />
      </main>
    </MarketingShell>
  );
}
