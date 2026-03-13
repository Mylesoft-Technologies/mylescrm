import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@workos-inc/authkit-nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

const PRICE_MAP: Record<string, Record<string, string>> = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!,
  },
  growth: {
    monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID!,
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID!,
  },
};

export async function POST(req: NextRequest) {
  try {
    const authSession = await getSession();
  const user = authSession?.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan, billing, orgId, stripeCustomerId } = await req.json();
    const priceId = PRICE_MAP[plan]?.[billing];
    if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId ?? undefined,
      customer_email: stripeCustomerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: { orgId, userId: user.id, plan, billing },
      subscription_data: {
        metadata: { orgId, userId: user.id },
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
