import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function initiateRazorpayRefund(
  paymentId: string,
  amountPaise: number
): Promise<{ id: string }> {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay credentials not configured");

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${credentials}` },
    body: JSON.stringify({ amount: amountPaise }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.description || "Razorpay refund failed");
  }
  return response.json();
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let bookingId: string;
  try {
    const body = await request.json();
    if (!body.bookingId) throw new Error("Missing bookingId");
    bookingId = body.bookingId;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }

  // Fetch booking — must belong to this user
  const { data: booking, error: fetchErr } = await supabase
    .from("bookings")
    .select("id, user_id, status, payment_status, payment_id, total_price, slot_date, start_time")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (fetchErr || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Cannot cancel already-cancelled or past bookings
  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Booking is already cancelled." }, { status: 409 });
  }

  // Cannot cancel if slot has already started
  const slotStart = new Date(`${booking.slot_date}T${booking.start_time}`);
  if (slotStart <= new Date()) {
    return NextResponse.json(
      { error: "Cannot cancel a booking after the slot has started." },
      { status: 409 }
    );
  }

  // Cancel the booking in DB first
  const { error: updateErr } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (updateErr) {
    return NextResponse.json({ error: "Failed to cancel booking." }, { status: 500 });
  }

  // If payment was made, initiate Razorpay refund
  if (booking.payment_status === "paid" && booking.payment_id) {
    try {
      await initiateRazorpayRefund(
        booking.payment_id,
        booking.total_price * 100 // INR → paise
      );
      // Mark refund as initiated (webhook will set payment_status = "refunded" when processed)
      await supabase
        .from("bookings")
        .update({ payment_status: "refunded" })
        .eq("id", bookingId);

      return NextResponse.json({ success: true, refunded: true });
    } catch (err) {
      // Booking is already cancelled; log refund failure but don't revert
      console.error("[refund] Razorpay refund initiation failed:", err);
      return NextResponse.json({
        success: true,
        refunded: false,
        refundNote: "Booking cancelled. Refund will be processed manually within 3-5 business days.",
      });
    }
  }

  // Unpaid booking — just cancelled, no refund needed
  return NextResponse.json({ success: true, refunded: false });
}
