import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  scheduledAt?: string;
  tags?: { name: string; value: string }[];
}

export async function sendEmail(options: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: options.from ?? `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    cc: options.cc,
    bcc: options.bcc,
    reply_to: options.replyTo,
    scheduled_at: options.scheduledAt,
    tags: options.tags,
  });

  if (error) throw new Error(error.message);
  return data;
}

export function buildWelcomeEmail(firstName: string, orgName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'DM Sans', sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #2550ed, #14b8a6); padding: 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .body { padding: 40px; }
    .body p { color: #334155; line-height: 1.6; margin: 0 0 16px; }
    .cta { display: inline-block; background: #2550ed; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 8px 0; }
    .footer { padding: 24px 40px; background: #f8fafc; text-align: center; color: #94a3b8; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ Welcome to MylesCRM</h1>
    </div>
    <div class="body">
      <p>Hi ${firstName},</p>
      <p>Welcome to <strong>MylesCRM</strong>! Your workspace for <strong>${orgName}</strong> is ready. You have a 14-day free trial to explore all features.</p>
      <p>Here's what you can do today:</p>
      <ul style="color: #334155; line-height: 2;">
        <li>Import or add your first contacts</li>
        <li>Set up your sales pipeline</li>
        <li>Try the AI lead scoring on your contacts</li>
        <li>Compose your first AI-drafted email</li>
      </ul>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta">Go to Dashboard →</a>
    </div>
    <div class="footer">
      MylesCRM by Mylesoft Technologies · ayany004@gmail.com<br>
      You're receiving this because you signed up for MylesCRM.
    </div>
  </div>
</body>
</html>`;
}

export function buildInvoiceEmail(invoiceNumber: string, amount: string, currency: string, dueDate: string, contactName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'DM Sans', sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
    .header { background: #1e318b; padding: 32px 40px; }
    .header h1 { color: white; margin: 0; font-size: 22px; }
    .body { padding: 40px; }
    .invoice-box { background: #f8fafc; border-radius: 10px; padding: 20px; margin: 20px 0; }
    .cta { display: inline-block; background: #22c55e; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>📄 Invoice ${invoiceNumber}</h1></div>
    <div class="body">
      <p>Dear ${contactName},</p>
      <p>Please find your invoice details below:</p>
      <div class="invoice-box">
        <p><strong>Invoice:</strong> ${invoiceNumber}</p>
        <p><strong>Amount Due:</strong> ${currency} ${amount}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <p>You can pay via:</p>
      <ul>
        <li>Card (Stripe) — click the button below</li>
        <li>M-Pesa — Paybill or STK Push (contact us)</li>
      </ul>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="cta">Pay Invoice →</a>
    </div>
  </div>
</body>
</html>`;
}
