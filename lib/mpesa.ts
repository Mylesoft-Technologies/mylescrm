// M-Pesa Daraja API helper
// Docs: https://developer.safaricom.co.ke/Documentation

export interface StkPushParams {
  phone: string;        // 0712345678 or 254712345678
  amount: number;       // Must be integer (KES)
  accountRef: string;   // e.g. invoice number
  description?: string;
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface DarajaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number; // 0 = success
      ResultDesc: string;
      CallbackMetadata?: {
        Item: { Name: string; Value: any }[];
      };
    };
  };
}

export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+254")) return cleaned.slice(1);
  if (cleaned.startsWith("0")) return `254${cleaned.slice(1)}`;
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) return `254${cleaned}`;
  return cleaned;
}

export async function getMpesaToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  if (!res.ok) throw new Error("Failed to get M-Pesa access token");
  const { access_token } = await res.json();
  return access_token;
}

export function getMpesaTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
}

export function getMpesaPassword(timestamp: string): string {
  return Buffer.from(
    `${process.env.MPESA_BUSINESS_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");
}

export async function initiateStkPush(params: StkPushParams): Promise<StkPushResponse> {
  const token = await getMpesaToken();
  const timestamp = getMpesaTimestamp();
  const password = getMpesaPassword(timestamp);
  const phone = normalizePhone(params.phone);
  const amount = Math.ceil(params.amount);

  const body = {
    BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: params.accountRef,
    TransactionDesc: params.description ?? "MylesCRM Payment",
  };

  const res = await fetch(
    `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  if (!res.ok || data.ResponseCode !== "0") {
    throw new Error(
      data.errorMessage ?? data.ResponseDescription ?? "STK Push failed"
    );
  }

  return data;
}

export async function queryStkPushStatus(checkoutRequestId: string): Promise<any> {
  const token = await getMpesaToken();
  const timestamp = getMpesaTimestamp();
  const password = getMpesaPassword(timestamp);

  const res = await fetch(
    `${process.env.MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    }
  );

  return res.json();
}

export function parseCallbackMetadata(
  items: { Name: string; Value: any }[]
): Record<string, any> {
  return Object.fromEntries(items.map((i) => [i.Name, i.Value]));
}
