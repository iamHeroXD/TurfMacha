import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  keySecret: string
): boolean {
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");
  // Constant-time comparison prevents timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(razorpaySignature, "hex")
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  try {
    body = await request.json();
    if (
      !body.bookingId ||
      !body.razorpayOrderId ||
      !body.razorpayPaymentId ||
      !body.razorpaySignature
    ) {
      throw new Error("Missing required fields");
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "Payment configuration error" },
      { status: 500 }
    );
  }

  // Verify Razorpay signature — prevents fake payment confirmation
  let signatureValid = false;
  try {
    signatureValid = verifyRazorpaySignature(
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
      keySecret
    );
  } catch {
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 400 }
    );
  }

  if (!signatureValid) {
    // Mark booking as failed — signature mismatch means tampered payment
    await supabase
      .from("bookings")
      .update({ status: "cancelled", payment_status: "failed" })
      .eq("id", body.bookingId)
      .eq("user_id", user.id);

    return NextResponse.json(
      { error: "Payment verification failed. Invalid signature." },
      { status: 400 }
    );
  }

  // Fetch the booking and verify it belongs to the authenticated user
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("id, user_id, status, razorpay_order_id, total_price, payment_id")
    .eq("id", body.bookingId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  // Verify the Razorpay order ID matches what we stored
  if (booking.razorpay_order_id !== body.razorpayOrderId) {
    return NextResponse.json(
      { error: "Order ID mismatch" },
      { status: 400 }
    );
  }

  // Idempotency: already confirmed
  if (booking.status === "confirmed" && booking.payment_id) {
    return NextResponse.json({ success: true, bookingId: booking.id });
  }

  // Confirm the booking
  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      payment_status: "paid",
      payment_id: body.razorpayPaymentId,
    })
    .eq("id", body.bookingId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to confirm booking. Contact support." },
      { status: 500 }
    );
  }

  // Fire-and-forget: send WhatsApp/SMS confirmation (don't block the response)
  sendBookingConfirmationAsync(booking.id, user.id).catch(() => {});

  return NextResponse.json({ success: true, bookingId: booking.id });
}

async function sendBookingConfirmationAsync(bookingId: string, userId: string) {
  try {
    const supabase = await createClient();
    const { data: fullBooking } = await supabase
      .from("bookings")
      .select("*, turf:turfs(name), user:users(full_name, phone)")
      .eq("id", bookingId)
      .single();

    if (!fullBooking?.user?.phone) return;

    const { sendBookingConfirmation } = await import("@/lib/messaging/msg91");
    const { format } = await import("date-fns");

    await sendBookingConfirmation({
      recipientPhone: fullBooking.user.phone,
      recipientName: fullBooking.user.full_name,
      turfName: fullBooking.turf?.name ?? "the turf",
      slotDate: format(new Date(fullBooking.slot_date), "d MMM yyyy"),
      startTime: fullBooking.start_time,
      duration: `${fullBooking.duration_hours} hour${fullBooking.duration_hours > 1 ? "s" : ""}`,
      totalPrice: `₹${fullBooking.total_price}`,
      bookingId: fullBooking.id,
    });
  } catch {
    // Silently fail — messaging is non-critical
  }
}
