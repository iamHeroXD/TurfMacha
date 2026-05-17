import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { rateLimit, getRateLimitId } from "@/lib/rate-limit";

// Lazily create a Razorpay-compatible order using the Razorpay REST API directly
// (avoids adding the razorpay npm package dependency)
async function createRazorpayOrder(params: {
  amount: number; // in paise
  currency: string;
  receipt: string;
}): Promise<{ id: string; amount: number; currency: string }> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.description || "Razorpay order creation failed");
  }

  return response.json();
}

export async function POST(request: Request) {
  const supabase = await createClient();

  // Require authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 booking attempts per user per minute
  const rl = await rateLimit(
    getRateLimitId(request, "create-order", user.id),
    { limit: 10, windowSeconds: 60 }
  );
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.resetAt - Math.floor(Date.now() / 1000)) },
      }
    );
  }

  let body: {
    turfId: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    totalPrice: number;
    sport: string;
  };

  try {
    body = await request.json();
    // Basic input validation
    if (
      !body.turfId ||
      !body.slotDate ||
      !body.startTime ||
      !body.endTime ||
      !body.durationHours ||
      !body.totalPrice ||
      !body.sport
    ) {
      throw new Error("Missing required fields");
    }
    if (body.totalPrice <= 0 || body.durationHours <= 0) {
      throw new Error("Invalid price or duration");
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request body" },
      { status: 400 }
    );
  }

  // Verify the turf exists and is active
  const { data: turf, error: turfError } = await supabase
    .from("turfs")
    .select("id, price_per_hour, is_active")
    .eq("id", body.turfId)
    .eq("is_active", true)
    .single();

  if (turfError || !turf) {
    return NextResponse.json(
      { error: "Turf not found or unavailable" },
      { status: 404 }
    );
  }

  // Server-side price verification (prevent price tampering from client)
  const expectedPrice = turf.price_per_hour * body.durationHours;
  if (Math.abs(expectedPrice - body.totalPrice) > 0) {
    return NextResponse.json(
      { error: "Price mismatch. Please refresh and try again." },
      { status: 400 }
    );
  }

  // Create a pending booking in DB first (holds the slot)
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      turf_id: body.turfId,
      slot_date: body.slotDate,
      start_time: body.startTime,
      end_time: body.endTime,
      duration_hours: body.durationHours,
      total_price: body.totalPrice,
      status: "pending",
      payment_status: "unpaid",
      sport: body.sport,
    })
    .select("id")
    .single();

  if (bookingError) {
    const message = bookingError.message.includes("overlap")
      ? "This slot is already booked. Please choose another time."
      : "Failed to reserve slot. Please try again.";
    return NextResponse.json({ error: message }, { status: 409 });
  }

  // Create Razorpay order (amount in paise)
  let razorpayOrder: { id: string; amount: number; currency: string };
  try {
    razorpayOrder = await createRazorpayOrder({
      amount: body.totalPrice * 100, // convert INR to paise
      currency: "INR",
      receipt: booking.id,
    });
  } catch (err) {
    // Cancel the pending booking if Razorpay order creation fails
    await supabase
      .from("bookings")
      .update({ status: "cancelled", payment_status: "failed" })
      .eq("id", booking.id);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Payment service unavailable. Please try again.",
      },
      { status: 503 }
    );
  }

  // Store the Razorpay order ID on the booking
  await supabase
    .from("bookings")
    .update({ razorpay_order_id: razorpayOrder.id })
    .eq("id", booking.id);

  return NextResponse.json({
    bookingId: booking.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
}
