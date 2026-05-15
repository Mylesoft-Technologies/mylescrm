import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  Check,
  Clock,
  CreditCard,
  GitBranch,
  Globe2,
  Headphones,
  HeartHandshake,
  Layers3,
  LockKeyhole,
  Mail,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

const phone = "254743993715";
const liveChatMessage = encodeURIComponent(
  "Hi MylesCRM team, I am visiting the website and would like help choosing the right CRM plan."
);
const whatsappMessage = encodeURIComponent(
  "Hi MylesCRM team, I would like a professional CRM consultation for my business."
);

export const navItems = [
  { href: "/features", label: "Features" },
  { href: "/industries", label: "Industries" },
  { href: "/implementation", label: "Implementation" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
];

export const featureHighlights = [
  {
    icon: Users,
    title: "Contact intelligence",
    text: "Unify contacts, companies, notes, deal history, activity timelines, and account ownership in one workspace.",
  },
  {
    icon: GitBranch,
    title: "Pipeline management",
    text: "Track every opportunity from lead to close with stages, owners, expected value, probability, and next actions.",
  },
  {
    icon: Bot,
    title: "AI sales assistant",
    text: "Draft follow-ups, summarize accounts, score leads, and surface deal risks before they slow the team down.",
  },
  {
    icon: BarChart3,
    title: "Revenue reporting",
    text: "Monitor pipeline value, win rates, forecast health, activity volume, and overdue follow-ups in real time.",
  },
  {
    icon: Mail,
    title: "Email workflows",
    text: "Send sales emails, save activity against contacts and deals, and keep communication context close to revenue.",
  },
  {
    icon: CreditCard,
    title: "Payments and invoicing",
    text: "Create invoices, track payments, and support local checkout flows including M-Pesa for East African teams.",
  },
];

export const mylesCorpStats = [
  ["2020", "founded in Kenya"],
  ["500+", "schools transformed"],
  ["50K+", "lives impacted"],
  ["18", "products across sectors"],
  ["47", "counties reached"],
  ["24/7", "support mindset"],
];

export const mylesPrinciples = [
  {
    letter: "M",
    title: "Mastery",
    text: "We build with discipline, craft, and continuous improvement so sales teams get software that feels dependable every day.",
    tags: ["Excellence", "Expertise", "Growth"],
  },
  {
    letter: "Y",
    title: "Youth Empowerment",
    text: "MylesCRM carries the wider MylesCorp belief that African talent deserves tools, mentorship, and systems that unlock serious opportunity.",
    tags: ["Education", "Mentorship", "Next generation"],
  },
  {
    letter: "L",
    title: "Leadership",
    text: "We design for accountable teams: clear ownership, ethical customer communication, and leaders who can see what needs action.",
    tags: ["Integrity", "Courage", "Accountability"],
  },
  {
    letter: "E",
    title: "Entrepreneurship",
    text: "We help ambitious organizations move faster, test smarter sales motions, and turn customer conversations into measurable growth.",
    tags: ["Innovation", "Ownership", "Value creation"],
  },
  {
    letter: "S",
    title: "Service",
    text: "We treat CRM as a service discipline: understand the customer, follow through, and create impact that is shared beyond the sale.",
    tags: ["Impact", "Community", "Purpose"],
  },
];

export const productPillars = [
  {
    icon: Globe2,
    title: "Built by Africans, for African markets",
    text: "MylesCRM understands regional business rhythms: relationship-led selling, mobile-first follow-up, M-Pesa readiness, and KSh reporting.",
  },
  {
    icon: Rocket,
    title: "Part of a wider product family",
    text: "The CRM sits inside MylesCorp's AI-powered portfolio across education, healthcare, agriculture, transport, and business operations.",
  },
  {
    icon: HeartHandshake,
    title: "Human relationships first",
    text: "Automation should strengthen trust. The product keeps notes, context, tasks, and payment history close to every customer conversation.",
  },
];

export const industrySolutions = [
  {
    icon: Building2,
    title: "SMEs and service businesses",
    text: "Replace scattered spreadsheets with one place for contacts, deal stages, invoices, owners, and follow-ups.",
  },
  {
    icon: Target,
    title: "Real estate and property teams",
    text: "Track buyers, landlords, properties, showings, commission pipelines, and post-visit follow-up.",
  },
  {
    icon: Activity,
    title: "Insurance and financial services",
    text: "Manage renewals, policy leads, account reviews, compliance-friendly notes, and activity accountability.",
  },
  {
    icon: Globe2,
    title: "Field sales and distribution",
    text: "Give reps a simple mobile-ready workspace for account updates after visits and route-based selling.",
  },
  {
    icon: HeartHandshake,
    title: "Education and institutional sales",
    text: "Support long buying cycles with stakeholder mapping, proposals, demos, approvals, and relationship history.",
  },
  {
    icon: Sparkles,
    title: "AI-ready growth teams",
    text: "Use scoring, drafting, summaries, and forecasting to turn customer data into daily action.",
  },
];

export const implementationSteps = [
  {
    title: "Discovery",
    text: "Map your sales process, team roles, current tools, data sources, pipeline stages, and reporting expectations.",
  },
  {
    title: "Configuration",
    text: "Set up contacts, companies, pipelines, permissions, KSh defaults, invoices, and local operating preferences.",
  },
  {
    title: "Migration",
    text: "Clean and import spreadsheets or existing CRM exports so teams begin with usable customer context.",
  },
  {
    title: "Training",
    text: "Train managers and reps around practical daily workflows: follow-up, deal movement, notes, and forecast hygiene.",
  },
  {
    title: "Launch",
    text: "Go live with a measured adoption plan, support channel, and clear first-week operating rhythm.",
  },
  {
    title: "Optimization",
    text: "Review pipeline quality, activity patterns, reporting gaps, and automation opportunities after real usage begins.",
  },
];

export const securityPractices = [
  {
    icon: LockKeyhole,
    title: "Authentication boundary",
    text: "Protected dashboard and API workflows sit behind WorkOS AuthKit while public marketing pages remain accessible to buyers.",
  },
  {
    icon: ShieldCheck,
    title: "Least-access operating model",
    text: "CRM access should be assigned by role so users only see and act on the customer data they need.",
  },
  {
    icon: Layers3,
    title: "Managed infrastructure",
    text: "The app is deployed through Vercel and Convex so production releases, functions, and data operations use managed platforms.",
  },
  {
    icon: BookOpen,
    title: "Responsible data habits",
    text: "MylesCRM is built for professional customer engagement: accurate records, lawful outreach, and respectful communication.",
  },
];

export const plans = [
  {
    name: "Starter",
    price: "KSh 3,500",
    description: "For small sales teams moving away from spreadsheets.",
    features: ["5 users", "1,000 contacts", "3 pipelines", "Email integration", "Basic reports"],
  },
  {
    name: "Growth",
    price: "KSh 9,500",
    description: "For growing teams that need AI, automation, and stronger reporting.",
    features: ["25 users", "10,000 contacts", "Unlimited pipelines", "AI lead scoring", "Revenue forecasting", "Email sequences"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "KSh 24,000",
    description: "For larger organizations with advanced controls and scale needs.",
    features: ["Unlimited users", "Unlimited contacts", "All AI features", "API access", "SSO-ready architecture"],
  },
];

export const faqs = [
  {
    q: "Is MylesCRM built for East African businesses?",
    a: "Yes. It supports practical sales workflows for regional teams, including KES-first operations, M-Pesa payment flows, and field-sales friendly customer records.",
  },
  {
    q: "Can we start without migrating everything at once?",
    a: "Yes. Most teams start with contacts, companies, and one sales pipeline, then add reporting, email workflows, invoicing, and AI features as the process matures.",
  },
  {
    q: "Does the CRM include AI?",
    a: "Yes. MylesCRM includes AI-assisted lead scoring, email drafting, pipeline insight, and revenue forecasting capabilities for supported plans.",
  },
  {
    q: "Can we talk to someone before choosing a plan?",
    a: "Yes. Use the WhatsApp or live chat buttons, or open the contact page to request a consultation with the MylesCRM team.",
  },
  {
    q: "Is MylesCRM connected to MylesCorp Technologies?",
    a: "Yes. MylesCRM is a MylesCorp Technologies product and follows the same mission, service culture, and M.Y.L.E.S. operating principles used across the product portfolio.",
  },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#132033]">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d5fd6] text-white">
            <Zap className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">MylesCRM</span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="rounded-lg bg-[#1d5fd6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#174fb5]">
            Book a demo
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d5fd6] text-white">
              <Zap className="h-4 w-4" />
            </span>
            <span className="font-semibold">MylesCRM</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            A MylesCorp Technologies product for teams that need cleaner pipelines, faster follow-up, and better sales visibility.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Transforming Industries, Empowering Generations.
          </p>
        </div>
        <FooterColumn title="Product" links={[["Features", "/features"], ["Industries", "/industries"], ["Implementation", "/implementation"], ["Security", "/security"]]} />
        <FooterColumn title="Company" links={[["About", "/about"], ["Resources", "/resources"], ["Contact", "/contact"]]} />
        <FooterColumn title="Legal" links={[["Terms", "/terms"], ["Privacy", "/privacy"]]} />
      </div>
      <div className="border-t border-slate-200 px-5 py-5 text-center text-sm text-slate-500">
        Powered by{" "}
        <a href="https://mylescorptech.com" className="font-semibold text-[#1d5fd6] hover:underline">
          MylesCorp Technologies
        </a>
      </div>
    </footer>
  );
}

export function ValuesGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {mylesPrinciples.map((value) => (
        <div key={value.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#132033] text-lg font-semibold text-white">
            {value.letter}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">{value.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{value.text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {value.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MylesCorpBand() {
  return (
    <section className="bg-[#132033] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#56c5b6]">A MylesCorp product</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Built on the same mission transforming African industries.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            MylesCorp Technologies builds AI-powered software for education, healthcare, agriculture, transport, and business teams. MylesCRM brings that same local expertise into revenue operations.
          </p>
          <a href="https://mylescorptech.com/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#56c5b6]">
            Read the MylesCorp story <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {mylesCorpStats.map(([value, label]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-sm leading-5 text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-slate-950">{title}</h2>
      <div className="space-y-2">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="block text-sm text-slate-600 hover:text-slate-950">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FloatingHomeActions() {
  return (
    <>
      <a
        href={`sms:+${phone}?body=${liveChatMessage}`}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-[#132033] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-[#223551]"
        aria-label="Start live chat with MylesCRM"
      >
        <Headphones className="h-4 w-4" />
        <span className="hidden sm:inline">Live chat</span>
      </a>
      <a
        href={`https://wa.me/${phone}?text=${whatsappMessage}`}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#128c7e] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#0f766e]"
        aria-label="Chat with MylesCRM on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </>
  );
}

export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs font-medium text-slate-500">MylesCRM Revenue Workspace</span>
      </div>
      <div className="grid min-h-[360px] grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-[#132033] p-4 text-white lg:block">
          <div className="mb-6 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#56c5b6]" />
            <span className="text-sm font-semibold">MylesCRM</span>
          </div>
          {["Dashboard", "Contacts", "Pipeline", "Reports", "AI Assistant"].map((item, index) => (
            <div key={item} className={`mb-2 rounded-md px-3 py-2 text-sm ${index === 2 ? "bg-white/12 text-white" : "text-white/55"}`}>
              {item}
            </div>
          ))}
        </aside>
        <div className="p-5">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-[#1d5fd6]">Pipeline health</p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">KSh 12.8M active pipeline</h2>
            </div>
            <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">AI win forecast: 68%</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["New leads", "42", "+18%"],
              ["Hot deals", "17", "KSh 4.2M"],
              ["Follow-ups due", "9", "Today"],
            ].map(([label, value, meta]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{meta}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ["Lead", "24 deals", "bg-slate-400"],
              ["Qualified", "18 deals", "bg-blue-500"],
              ["Proposal", "12 deals", "bg-amber-500"],
              ["Closing", "7 deals", "bg-emerald-500"],
            ].map(([stage, deals, color]) => (
              <div key={stage} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-sm font-semibold text-slate-900">{stage}</span>
                </div>
                <p className="text-xs text-slate-500">{deals}</p>
                <div className="mt-3 space-y-2">
                  <span className="block h-12 rounded-md bg-slate-100" />
                  <span className="block h-12 rounded-md bg-slate-100" />
                  <span className="block h-12 rounded-md bg-slate-100 md:hidden lg:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d5fd6]">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{text}</p>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {featureHighlights.map((feature) => (
        <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <feature.icon className="mb-4 h-6 w-6 text-[#1d5fd6]" />
          <h2 className="text-lg font-semibold text-slate-950">{feature.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
        </div>
      ))}
    </div>
  );
}

export function PricingGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.name} className={`rounded-lg border bg-white p-6 shadow-sm ${plan.highlighted ? "border-[#1d5fd6] ring-2 ring-[#1d5fd6]/10" : "border-slate-200"}`}>
          {plan.highlighted && <p className="mb-3 text-sm font-semibold text-[#1d5fd6]">Most popular</p>}
          <h2 className="text-xl font-semibold text-slate-950">{plan.name}</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{plan.description}</p>
          <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            {plan.price}<span className="text-base font-medium text-slate-500">/mo</span>
          </p>
          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/contact" className={`mt-6 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${plan.highlighted ? "bg-[#1d5fd6] text-white hover:bg-[#174fb5]" : "border border-slate-200 text-slate-900 hover:bg-slate-50"}`}>
            Talk to sales <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}

export const proofStats = [
  ["18", "MylesCorp product ecosystem"],
  ["47", "Kenyan counties reached"],
  ["KSh", "default sales currency"],
  ["24/7", "support-led mindset"],
];

export const useCases = [
  { icon: Building2, title: "SMEs and startups", text: "Move from scattered spreadsheets to one sales command center." },
  { icon: Target, title: "Real estate teams", text: "Track buyers, landlords, properties, showings, and commission pipelines." },
  { icon: Activity, title: "Insurance and finance", text: "Manage renewals, policy leads, tasks, and follow-up accountability." },
  { icon: Clock, title: "Field sales teams", text: "Give reps a simple place to update deals, contacts, and activities after meetings." },
  { icon: ShieldCheck, title: "Management teams", text: "See revenue forecasts, account ownership, and sales activity without chasing updates." },
  { icon: Sparkles, title: "AI-ready operations", text: "Use AI to score leads, draft communication, and highlight pipeline risk." },
];

export const contactMethods = [
  { icon: Phone, label: "Phone and SMS", value: "+254 743 993 715", href: `tel:+${phone}` },
  { icon: MessageCircle, label: "WhatsApp", value: "Start a WhatsApp consultation", href: `https://wa.me/${phone}?text=${whatsappMessage}` },
  { icon: Mail, label: "Email", value: "Request a CRM demo", href: "mailto:support@mylesoft.com?subject=MylesCRM%20Demo%20Request" },
];

export function CTASection() {
  return (
    <section className="bg-[#132033] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#56c5b6]">Ready when your team is</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">Build a cleaner sales process before the next lead slips away.</h2>
        </div>
        <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#132033] hover:bg-slate-100">
          Book a consultation <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
