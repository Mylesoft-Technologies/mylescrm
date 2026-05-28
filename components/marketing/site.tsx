import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
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
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <div className="pt-28">{children}</div>
      <footer className="px-4 py-12">
        <Footer />
      </footer>
    </div>
  );
}

export function ValuesGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {mylesPrinciples.map((value) => (
        <div key={value.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
            {value.letter}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{value.text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {value.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
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
    <section className="border-y border-border bg-muted/30 px-5 py-16 text-foreground lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">A MylesCorp product</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Built on the same mission transforming African industries.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            MylesCorp Technologies builds AI-powered software for education, healthcare, agriculture, transport, and business teams. MylesCRM brings that same local expertise into revenue operations.
          </p>
          <a href="https://mylescorptech.com/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            Read the MylesCorp story <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {mylesCorpStats.map(([value, label]) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FloatingHomeActions() {
  return (
    <>
      <a
        href={`sms:+${phone}?body=${liveChatMessage}`}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
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
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-primary/10">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">MylesCRM Revenue Workspace</span>
      </div>
      <div className="grid min-h-[360px] grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-border bg-muted/50 p-4 text-foreground lg:block">
          <div className="mb-6 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">MylesCRM</span>
          </div>
          {["Dashboard", "Contacts", "Pipeline", "Reports", "AI Assistant"].map((item, index) => (
            <div key={item} className={`mb-2 rounded-md px-3 py-2 text-sm ${index === 2 ? "bg-primary/15 text-foreground" : "text-muted-foreground"}`}>
              {item}
            </div>
          ))}
        </aside>
        <div className="p-5">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-primary">Pipeline health</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">KSh 12.8M active pipeline</h2>
            </div>
            <div className="rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">AI win forecast: 68%</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["New leads", "42", "+18%"],
              ["Hot deals", "17", "KSh 4.2M"],
              ["Follow-ups due", "9", "Today"],
            ].map(([label, value, meta]) => (
              <div key={label} className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
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
              <div key={stage} className="rounded-lg border border-border bg-background p-3">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-sm font-semibold text-foreground">{stage}</span>
                </div>
                <p className="text-xs text-muted-foreground">{deals}</p>
                <div className="mt-3 space-y-2">
                  <span className="block h-12 rounded-md bg-muted" />
                  <span className="block h-12 rounded-md bg-muted" />
                  <span className="block h-12 rounded-md bg-muted md:hidden lg:block" />
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
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{text}</p>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {featureHighlights.map((feature) => (
        <div key={feature.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <feature.icon className="mb-4 h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{feature.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
        </div>
      ))}
    </div>
  );
}

export function PricingGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.name} className={`rounded-lg border bg-card p-6 shadow-sm ${plan.highlighted ? "border-primary ring-2 ring-primary/10" : "border-border"}`}>
          {plan.highlighted && <p className="mb-3 text-sm font-semibold text-primary">Most popular</p>}
          <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
          <p className="mt-5 text-4xl font-semibold tracking-tight text-foreground">
            {plan.price}<span className="text-base font-medium text-muted-foreground">/mo</span>
          </p>
          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/contact" className={`mt-6 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${plan.highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border text-foreground hover:bg-muted"}`}>
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
  { icon: Mail, label: "Email", value: "Request a CRM demo", href: "mailto:support@mylescorptech.com?subject=MylesCRM%20Demo%20Request" },
];

export function CTASection() {
  return (
    <section className="border-y border-border bg-muted/30 px-5 py-16 text-foreground lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Ready when your team is</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">Build a cleaner sales process before the next lead slips away.</h2>
        </div>
        <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Book a consultation <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
