import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Razorpay sends webhooks as POST with X-Razorpay-Signature header.
// Signature = HMAC-SHA256(raw_body, webhook_secret).
// Webhook secret is set separately in Razorpay dashboard.

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    // Pad both to equal length before timingSafeEqual to prevent length mismatch errors
    const a = Buffer.from(expected.padEnd(64, "0"));
    const b = Buffer.from(signature.padEnd(64, "0").slice(0, 64));
    return (
      expected.length === signature.length && crypto.timingSafeEqual(a, b)
    );
  } catch {
    return false;
  }
}

// Use service role client — webhook arrives without user session context
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  return createAdminClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Atomically reverse TurfCoins earned for a booking
async function reverseTurfCoins(
  supabase: ReturnType<typeof getAdminClient>,
  bookingId: string
) {
  // Find the earn transaction for this booking
  const { data: txns } = await supabase
    .from("coin_transactions")
    .select("user_id, amount")
    .eq("booking_id", bookingId)
    .eq("type", "earn");

  if (!txns?.length) return;

  for (const tx of txns) {
    // Deduct from balance (never below 0)
    await supabase.rpc("deduct_coins_safe", {
      p_user_id: tx.user_id,
      p_amount: tx.amount,
      p_booking_id: bookingId,
    });
  }
}

// Wrapper to avoid unhandled rejections from fire-and-forget coin reversal
async function safeRevertCoins(
  supabase: ReturnType<typeof getAdminClient>,
  bookingId: string
) {
  try {
    await reverseTurfCoins(supabase, bookingId);
  } catch (err) {
    console.error("[webhook] coin reversal failed for booking", bookingId, err);
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Read raw body for signature verification (must read before parsing)
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    console.warn("[webhook] Invalid signature — possible spoofed request");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event: string;
    payload: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          status?: string;
          amount?: number;
          error_description?: string;
        };
      };
      refund?: {
        entity?: {
          id?: string;
          payment_id?: string;
          amount?: number;
        };
      };
      order?: {
        entity?: {
          id?: string;
          receipt?: string;
          status?: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let supabase: ReturnType<typeof getAdminClient>;
  try {
    supabase = getAdminClient();
  } catch (err) {
    console.error("[webhook] Admin client init failed:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const eventType = event.event;
  console.log("[webhook] Processing event:", eventType);

  try {
    switch (eventType) {
      case "payment.captured":
      case "order.paid": {
        const orderId =
          event.payload.payment?.entity?.order_id ??
          event.payload.order?.entity?.id;
        const paymentId = event.payload.payment?.entity?.id;

        if (!orderId) break;

        // Find booking by Razorpay order ID
        const { data: booking } = await supabase
          .from("bookings")
          .select("id, status, payment_status")
          .eq("razorpay_order_id", orderId)
          .single();

        if (!booking) break;

        // Idempotency: already confirmed
        if (booking.status === "confirmed" && booking.payment_status === "paid") {
          break;
        }

        // Confirm the booking
        await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: "paid",
            ...(paymentId ? { payment_id: paymentId } : {}),
          })
          .eq("id", booking.id);

        console.log("[webhook] Booking confirmed via webhook:", booking.id);
        break;
      }

      case "payment.failed": {
        const orderId = event.payload.payment?.entity?.order_id;
        if (!orderId) break;

        const { data: booking } = await supabase
          .from("bookings")
          .select("id, status")
          .eq("razorpay_order_id", orderId)
          .single();

        if (!booking) break;

        // Only cancel if not already confirmed (race with /verify endpoint)
        if (booking.status !== "confirmed") {
          await supabase
            .from("bookings")
            .update({ status: "cancelled", payment_status: "failed" })
            .eq("id", booking.id);

          console.log("[webhook] Booking cancelled (payment failed):", booking.id);
        }
        break;
      }

      case "refund.processed": {
        const paymentId = event.payload.refund?.entity?.payment_id;
        if (!paymentId) break;

        const { data: booking } = await supabase
          .from("bookings")
          .select("id, status, payment_status")
          .eq("payment_id", paymentId)
          .single();

        if (!booking) break;

        // Mark as refunded
        await supabase
          .from("bookings")
          .update({ status: "cancelled", payment_status: "refunded" })
          .eq("id", booking.id);

        // Reverse TurfCoins earned for this booking
        await safeRevertCoins(supabase, booking.id);

        console.log("[webhook] Booking refunded:", booking.id);
        break;
      }

      default:
        // Acknowledge unknown events without processing
        console.log("[webhook] Unhandled event type:", eventType);
        break;
    }
  } catch (err) {
    console.error("[webhook] Processing error:", err);
    // Return 500 so Razorpay retries
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
