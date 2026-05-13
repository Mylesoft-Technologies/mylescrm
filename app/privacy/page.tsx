import { MarketingShell, SectionHeader } from "@/components/marketing/site";

export const metadata = {
  title: "Privacy Policy | MylesCRM",
  description: "MylesCRM privacy policy for customer data, CRM records, communications, and service operations.",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <main className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Privacy"
            title="Privacy Policy"
            text="This page explains how MylesCRM handles business contact data, account information, communications, and operational records."
          />
          <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-8 text-sm leading-7 text-slate-600 shadow-sm">
            <PolicySection title="Information we process" text="MylesCRM may process account details, CRM records, contact information, company information, sales activity, invoices, payment references, support messages, and usage data required to operate the platform." />
            <PolicySection title="How information is used" text="Information is used to provide CRM functionality, authenticate users, support customer workflows, improve product reliability, communicate with customers, and protect the service from abuse." />
            <PolicySection title="Service providers" text="MylesCRM may rely on trusted providers for hosting, authentication, email delivery, payments, analytics, and infrastructure operations. These providers are used only for service delivery and operational support." />
            <PolicySection title="Data protection" text="We use reasonable administrative, technical, and organizational safeguards to protect customer data. Access should be limited to authorized users and service operations." />
            <PolicySection title="Contact" text="For privacy questions, contact the MylesCRM team through the contact page or the official support channels listed on this website." />
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}

function PolicySection({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2">{text}</p>
    </section>
  );
}
