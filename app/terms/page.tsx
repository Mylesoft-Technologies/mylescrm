import { MarketingShell, SectionHeader } from "@/components/marketing/site";

export const metadata = {
  title: "Terms of Service | MylesCRM",
  description: "Terms of service for using MylesCRM.",
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <main className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Terms"
            title="Terms of Service"
            text="These terms summarize the expected professional use of MylesCRM, a MylesCorp Technologies product, and the responsibilities of customers using the platform."
          />
          <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-8 text-sm leading-7 text-slate-600 shadow-sm">
            <TermsSection title="Use of the service" text="MylesCRM is provided for lawful business relationship management, sales operations, reporting, communications, invoicing, and related customer workflows." />
            <TermsSection title="Customer responsibility" text="Customers are responsible for the accuracy of data entered into the platform, user permissions, account security, and compliance with applicable laws when contacting prospects or customers." />
            <TermsSection title="Payments and subscriptions" text="Paid plans are presented in KSh/KES unless otherwise agreed in writing. Payment providers may apply their own processing rules, verification steps, and transaction requirements." />
            <TermsSection title="Availability" text="We work to keep MylesCRM reliable, but service availability may be affected by maintenance, infrastructure providers, third-party integrations, or events outside our control." />
            <TermsSection title="MylesCorp standards" text="Customers should use MylesCRM in a way that aligns with professional, lawful, and service-minded customer engagement. The product is built to support responsible growth, not abusive outreach." />
            <TermsSection title="Updates" text="These terms may be updated as the product evolves. Continued use of the service means acceptance of the latest applicable terms." />
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}

function TermsSection({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2">{text}</p>
    </section>
  );
}
