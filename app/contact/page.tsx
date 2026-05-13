import { ArrowRight } from "lucide-react";
import { MarketingShell, SectionHeader, contactMethods } from "@/components/marketing/site";

export const metadata = {
  title: "Contact | MylesCRM",
  description: "Contact MylesCRM for demos, sales consultations, onboarding support, and product questions.",
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              eyebrow="Contact"
              title="Talk to the MylesCRM team."
              text="Tell us about your team, your pipeline, and the customer workflows you want to improve. We will help you choose the right setup."
            />
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <a key={method.label} href={method.href} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-[#1d5fd6]">
                    <method.icon className="mt-1 h-5 w-5 text-[#1d5fd6]" />
                    <span>
                      <span className="block font-semibold text-slate-950">{method.label}</span>
                      <span className="mt-1 block text-sm text-slate-600">{method.value}</span>
                    </span>
                  </a>
                ))}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">Request a demo</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This form opens your email client with a structured demo request so your team can share the right details.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {["Company size", "Sales team size", "Current CRM", "Primary goal"].map((label) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
                      <p className="mt-2 text-sm text-slate-700">Include this in your message</p>
                    </div>
                  ))}
                </div>
                <a
                  href="mailto:support@mylesoft.com?subject=MylesCRM%20Demo%20Request&body=Hi%20MylesCRM%20team%2C%0A%0AI%20would%20like%20a%20professional%20demo.%0A%0ACompany%3A%0ASales%20team%20size%3A%0ACurrent%20CRM%3A%0APrimary%20goal%3A%0A%0AThank%20you."
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1d5fd6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#174fb5]"
                >
                  Send demo request <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
