import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// M-Pesa Daraja STK callback
http.route({
  path: "/mpesa/callback",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const callback = body?.Body?.stkCallback;

      if (callback?.ResultCode === 0 && callback?.CallbackMetadata?.Item) {
        const items = callback.CallbackMetadata.Item as { Name: string; Value: any }[];
        const get = (name: string) => items.find((i: any) => i.Name === name)?.Value;

        const receiptNumber = get("MpesaReceiptNumber");
        const amount = get("Amount");
        const transactionId = get("TransactionDate");
        const phone = get("PhoneNumber");

        console.log("M-Pesa payment confirmed:", {
          checkoutRequestId: callback.CheckoutRequestID,
          amount,
          receiptNumber,
        });

        // Log webhook
        await ctx.runMutation(api.organizations.logWebhookHttp as any, {
          provider: "mpesa",
          event: "stk_callback",
          payload: body,
          status: "processed",
          receivedAt: Date.now(),
        });
      }

      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
