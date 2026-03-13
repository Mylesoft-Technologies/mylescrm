import type { Id } from "@/convex/_generated/dataModel";

export type OrgPlan = "free" | "starter" | "growth" | "enterprise";
export type UserRole = "super_admin" | "admin" | "sales_manager" | "sales_rep" | "finance_officer" | "viewer";
export type ContactStatus = "lead" | "prospect" | "customer" | "churned" | "inactive";
export type DealStatus = "open" | "won" | "lost" | "on_hold";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type InvoiceStatus = "draft" | "sent" | "viewed" | "partial" | "paid" | "overdue" | "cancelled";
export type ActivityType = "call" | "email" | "meeting" | "task" | "note" | "deal_stage_change" | "deal_won" | "deal_lost" | "contact_created" | "company_created" | "file_uploaded" | "payment_received";
export type LeadGrade = "A" | "B" | "C" | "D" | "F";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

export interface StatsCard {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface KanbanColumn {
  _id: Id<"pipeline_stages">;
  name: string;
  color: string;
  probability: number;
  deals: DealWithRelations[];
  totalValue: number;
  isWon: boolean;
  isLost: boolean;
}

export interface DealWithRelations {
  _id: Id<"deals">;
  title: string;
  value: number;
  currency: string;
  probability: number;
  status: DealStatus;
  priority: string;
  aiScore?: number;
  stageId: Id<"pipeline_stages">;
  contact?: { firstName: string; lastName: string; email?: string; avatar?: string } | null;
  company?: { name: string; logo?: string } | null;
  assignee?: { firstName: string; lastName: string; avatar?: string } | null;
  stage?: { name: string; color: string } | null;
  expectedCloseDate?: number;
  lastActivityAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface ContactWithRelations {
  _id: Id<"contacts">;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  status: ContactStatus;
  leadScore?: number;
  source?: string;
  tags: string[];
  company?: { name: string; logo?: string } | null;
  assignee?: { firstName: string; lastName: string } | null;
  deals?: DealWithRelations[];
  lastContactedAt?: number;
  createdAt: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ForecastData {
  summary: string;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  forecastByMonth: { month: string; pessimistic: number; realistic: number; optimistic: number }[];
  topDeals: { title: string; value: number; probability: number; recommendation: string }[];
  risks: string[];
  opportunities: string[];
}

export interface EmailDraft {
  subject: string;
  body: string;
  preview: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  maxUsers: number;
  maxContacts: number;
  features: PlanFeature[];
  highlighted?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams getting started",
    monthlyPrice: 29,
    annualPrice: 24,
    maxUsers: 5,
    maxContacts: 1000,
    features: [
      { name: "Up to 5 users", included: true },
      { name: "1,000 contacts", included: true },
      { name: "3 pipelines", included: true },
      { name: "Email integration", included: true },
      { name: "Activity timeline", included: true },
      { name: "Basic reports", included: true },
      { name: "AI features", included: false },
      { name: "Email sequences", included: false },
      { name: "API access", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For scaling sales teams",
    monthlyPrice: 79,
    annualPrice: 65,
    maxUsers: 25,
    maxContacts: 10000,
    highlighted: true,
    features: [
      { name: "Up to 25 users", included: true },
      { name: "10,000 contacts", included: true },
      { name: "Unlimited pipelines", included: true },
      { name: "Email + sequences", included: true },
      { name: "Activity timeline", included: true },
      { name: "Advanced reports", included: true },
      { name: "AI lead scoring + chat", included: true },
      { name: "Revenue forecasting", included: true },
      { name: "API access", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: 199,
    annualPrice: 165,
    maxUsers: 999,
    maxContacts: 999999,
    features: [
      { name: "Unlimited users", included: true },
      { name: "Unlimited contacts", included: true },
      { name: "Unlimited pipelines", included: true },
      { name: "Email + sequences", included: true },
      { name: "Activity timeline", included: true },
      { name: "Custom reports", included: true },
      { name: "All AI features", included: true },
      { name: "Revenue forecasting", included: true },
      { name: "Full API access", included: true },
    ],
  },
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

export function formatCurrency(amount: number, currency = "USD"): string {
  const curr = CURRENCIES.find((c) => c.code === currency);
  if (!curr) return `${currency} ${amount.toLocaleString()}`;
  return `${curr.symbol}${amount.toLocaleString()}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
