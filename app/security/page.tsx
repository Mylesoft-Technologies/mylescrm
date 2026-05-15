import {
  CTASection,
  MarketingShell,
  SectionHeader,
  securityPractices,
} from "@/components/marketing/site";

export const metadata = {
  title: "Security | MylesCRM",
  description: "Review MylesCRM security, authentication, data responsibility, and managed infrastructure practices.",
};

export default function SecurityPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Security"
              title="Professional CRM work needs trust at the foundation."
              text="MylesCRM keeps the public buying experience open while protecting dashboard workflows behind an authentication boundary, managed infrastructure, and responsible data practices."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {securityPractices.map((practice) => (
                <div key={practice.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <practice.icon className="mb-4 h-6 w-6 text-[#1d5fd6]" />
                  <h2 className="text-lg font-semibold text-slate-950">{practice.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{practice.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">Operational responsibility</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Security is also a workflow habit.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A CRM is only as trustworthy as the data inside it. MylesCRM encourages clean ownership, accurate records, lawful outreach, and careful access management so teams can grow without losing customer trust.
            </p>
          </div>
        </section>
        <CTASection />
      </main>
    </MarketingShell>
  );
}
