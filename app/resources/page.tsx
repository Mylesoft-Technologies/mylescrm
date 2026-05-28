import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection, MarketingShell, SectionHeader } from "@/components/marketing/site";

export const metadata = {
  title: "Resources",
  description: "Practical MylesCRM resources for CRM readiness, implementation planning, sales operations, and KSh-first reporting.",
};

const resources = [
  {
    title: "CRM readiness checklist",
    text: "The questions to answer before moving from spreadsheets or scattered tools into a structured CRM.",
    href: "/implementation",
  },
  {
    title: "Pipeline hygiene guide",
    text: "How to define stages, next actions, expected close dates, and manager reviews without slowing reps down.",
    href: "/features",
  },
  {
    title: "KSh-first revenue operations",
    text: "Why local currency defaults matter for pricing, invoices, forecasts, and sales performance conversations.",
    href: "/pricing",
  },
  {
    title: "Security and access basics",
    text: "A practical overview of authentication boundaries, user roles, and responsible CRM data habits.",
    href: "/security",
  },
];

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Resources"
              title="Practical guidance for building a cleaner sales operation."
              text="MylesCRM resources are written for founders, sales managers, and operations teams who need useful decisions, not generic CRM theory."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {resources.map((resource) => (
                <Link key={resource.title} href={resource.href} className="group rounded-lg border border-border bg-card p-6 shadow-sm hover:border-primary">
                  <h2 className="text-lg font-semibold text-foreground">{resource.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <CTASection />
      </main>
    </MarketingShell>
  );
}
