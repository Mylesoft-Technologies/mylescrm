import { CTASection, MarketingShell, SectionHeader, proofStats } from "@/components/marketing/site";

export const metadata = {
  title: "About | MylesCRM",
  description: "Learn about MylesCRM and the mission to help sales teams manage relationships, pipelines, and revenue with confidence.",
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <main>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="About MylesCRM"
              title="A CRM built for teams that cannot afford missed follow-ups."
              text="MylesCRM is designed by MylesCorp Technologies to help growing teams organize relationships, manage opportunities, forecast revenue, and convert customer conversations into measurable business outcomes."
            />
            <div className="grid gap-4 md:grid-cols-4">
              {proofStats.map(([value, label]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-3xl font-semibold text-slate-950">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Our approach</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-3">
                {[
                  ["Clarity", "Every record, deal, task, and follow-up should be easy to find and act on."],
                  ["Speed", "Sales teams need a system that helps them move faster, not another place to do admin."],
                  ["Accountability", "Managers need honest pipeline visibility and reps need clear next steps."],
                ].map(([title, text]) => (
                  <div key={title}>
                    <h3 className="font-semibold text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <CTASection />
      </main>
    </MarketingShell>
  );
}
