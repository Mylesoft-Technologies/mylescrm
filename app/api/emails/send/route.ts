import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSignedInUser } from "@workos-inc/authkit-nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSignedInUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { to, cc, bcc, subject, body, contactId, dealId, orgId, userId, templateId, scheduledAt } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields: to, subject, body" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      cc: cc ?? [],
      bcc: bcc ?? [],
      subject,
      html: body,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
    });

    if (error || !data) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error?.message ?? "Failed to send email" }, { status: 500 });
    }

    // Save email to Convex
    await convex.mutation(api.emails.saveEmailMessage as any, {
      orgId,
      contactId,
      dealId,
      sentBy: userId,
      resendId: data.id,
      direction: "outbound",
      from: process.env.RESEND_FROM_EMAIL!,
      to: Array.isArray(to) ? to : [to],
      cc,
      bcc,
      subject,
      body,
      status: scheduledAt ? "sent" : "sent",
      templateId,
      sentAt: Date.now(),
    });

    return NextResponse.json({ success: true, messageId: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
