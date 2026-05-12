import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const PLAN_LIMITS: Record<string, { maxUsers: number; maxContacts: number; features: string[] }> = {
  free: {
    maxUsers: 3,
    maxContacts: 250,
    features: ["contacts", "companies", "deals", "pipeline", "activities"],
  },
  starter: {
    maxUsers: 5,
    maxContacts: 1000,
    features: ["contacts", "companies", "deals", "pipeline", "activities", "email", "reports"],
  },
  growth: {
    maxUsers: 25,
    maxContacts: 10000,
    features: ["contacts", "companies", "deals", "pipeline", "activities", "email", "sequences", "reports", "ai", "forecasting"],
  },
  enterprise: {
    maxUsers: 999,
    maxContacts: 999999,
    features: ["contacts", "companies", "deals", "pipeline", "activities", "email", "sequences", "reports", "ai", "forecasting", "api"],
  },
};

function getPlanFromSubscription(sub: Stripe.Subscription) {
  const priceId = sub.items.data[0]?.price.id;
  if (!priceId) return sub.metadata.plan ?? "free";

  const priceToPlan: Record<string, string> = {
    [process.env.STRIPE_STARTER_MONTHLY_PRICE_ID ?? ""]: "starter",
    [process.env.STRIPE_STARTER_ANNUAL_PRICE_ID ?? ""]: "starter",
    [process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID ?? ""]: "growth",
    [process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID ?? ""]: "growth",
    [process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID ?? ""]: "enterprise",
    [process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID ?? ""]: "enterprise",
  };

  return sub.metadata.plan ?? priceToPlan[priceId] ?? "free";
}

function mapStripeStatus(status: Stripe.Subscription.Status) {
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "past_due" || status === "unpaid" || status === "incomplete") return "past_due";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  return "paused";
}

function getCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer) {
  return typeof customer === "string" ? customer : customer.id;
}

async function syncSubscription(sub: Stripe.Subscription) {
  const orgId = sub.metadata.orgId;
  if (!orgId) {
    await convex.mutation(api.organizations.logWebhookHttp as any, {
      provider: "stripe",
      event: "subscription_missing_org",
      payload: sub,
      status: "ignored",
      error: "Stripe subscription metadata did not include orgId",
      receivedAt: Date.now(),
    });
    return;
  }

  const plan = getPlanFromSubscription(sub);
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  const periodStart = (sub as any).current_period_start;
  const periodEnd = (sub as any).current_period_end;

  await convex.mutation(api.organizations.upsertStripeSubscription as any, {
    orgId,
    stripeSubscriptionId: sub.id,
    stripeCustomerId: getCustomerId(sub.customer),
    stripePriceId: sub.items.data[0]?.price.id ?? "",
    plan,
    status: mapStripeStatus(sub.status),
    currentPeriodStart: typeof periodStart === "number" ? periodStart * 1000 : Date.now(),
    currentPeriodEnd: typeof periodEnd === "number" ? periodEnd * 1000 : Date.now(),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    canceledAt: sub.canceled_at ? sub.canceled_at * 1000 : undefined,
    ...limits,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await convex.mutation(api.organizations.logWebhookHttp as any, {
          provider: "stripe",
          event: event.type,
          payload: invoice,
          status: "processed",
          receivedAt: Date.now(),
        });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await convex.mutation(api.organizations.logWebhookHttp as any, {
          provider: "stripe",
          event: event.type,
          payload: invoice,
          status: "processed",
          receivedAt: Date.now(),
        });
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
