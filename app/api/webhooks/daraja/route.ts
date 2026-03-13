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

      // Find invoice by CheckoutRequestID and record payment
      // In production, you'd look up the invoice by checkoutRequestId
      // await convex.mutation(api.payments.recordPayment, { ... });

    } else {
      // Payment failed or cancelled
      console.log("M-Pesa payment failed:", stkCallback.ResultDesc);
    }

    // Always return 200 to M-Pesa
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error("M-Pesa webhook error:", error);
    // Still return 200 to prevent M-Pesa retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
