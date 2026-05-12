import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface DarajaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value?: string | number }>;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: DarajaCallback = await req.json();
    const { stkCallback } = body.Body;

    console.log("M-Pesa callback received:", {
      checkoutRequestId: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc,
    });

    if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata) {
      // Payment successful
      const items = stkCallback.CallbackMetadata.Item;
      const getValue = (name: string) => items.find((i) => i.Name === name)?.Value;

      const amount = Number(getValue("Amount"));
      const mpesaReceiptNumber = String(getValue("MpesaReceiptNumber") ?? "");
      const transactionDate = String(getValue("TransactionDate") ?? "");
      const phoneNumber = String(getValue("PhoneNumber") ?? "");

      console.log("M-Pesa payment successful:", {
        amount,
        mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });

      const invoice = await convex.query(api.payments.getInvoiceByMpesaCheckout as any, {
        checkoutRequestId: stkCallback.CheckoutRequestID,
      });

      if (invoice) {
        await convex.mutation(api.payments.recordPayment as any, {
          orgId: invoice.orgId,
          invoiceId: invoice._id,
          contactId: invoice.contactId,
          method: "mpesa",
          amount,
          currency: invoice.currency,
          reference: mpesaReceiptNumber || stkCallback.CheckoutRequestID,
          mpesaReceiptNumber,
          mpesaTransactionId: transactionDate,
        });
      }

      await convex.mutation(api.organizations.logWebhookHttp as any, {
        orgId: invoice?.orgId,
        provider: "mpesa",
        event: "stk_callback",
        payload: body,
        status: invoice ? "processed" : "ignored",
        error: invoice ? undefined : "No invoice matched CheckoutRequestID",
        receivedAt: Date.now(),
      });

    } else {
      // Payment failed or cancelled
      console.log("M-Pesa payment failed:", stkCallback.ResultDesc);
      await convex.mutation(api.organizations.logWebhookHttp as any, {
        provider: "mpesa",
        event: "stk_callback",
        payload: body,
        status: "ignored",
        error: stkCallback.ResultDesc,
        receivedAt: Date.now(),
      });
    }

    // Always return 200 to M-Pesa
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error("M-Pesa webhook error:", error);
    // Still return 200 to prevent M-Pesa retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
