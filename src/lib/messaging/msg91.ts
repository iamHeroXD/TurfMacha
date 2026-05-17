/**
 * MSG91 WhatsApp & SMS integration for India market.
 *
 * Setup:
 * 1. Create account at msg91.com
 * 2. Enable WhatsApp Business API
 * 3. Create message templates (see below)
 * 4. Set environment variables:
 *    MSG91_AUTH_KEY=your_auth_key
 *    MSG91_WHATSAPP_SENDER_ID=your_sender_id
 *    MSG91_SMS_SENDER_ID=TRFMCH (or your 6-char sender)
 *    MSG91_SMS_TEMPLATE_ID=your_booking_confirmation_template_id
 *
 * Fallback: If WhatsApp fails or number has no WA, falls back to SMS.
 */

const MSG91_BASE = "https://api.msg91.com/api/v5";
const WHATSAPP_BASE = "https://api.msg91.com/api/v5.1";

export interface BookingMessageData {
  recipientPhone: string;   // E.164 format: +91XXXXXXXXXX
  recipientName: string;
  turfName: string;
  slotDate: string;         // "15 Jan 2026"
  startTime: string;        // "06:00 PM"
  duration: string;         // "1 hour"
  totalPrice: string;       // "₹800"
  bookingId: string;
}

type DeliveryResult = {
  success: boolean;
  channel: "whatsapp" | "sms" | "none";
  error?: string;
};

async function sendWhatsApp(data: BookingMessageData): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_WHATSAPP_SENDER_ID;

  if (!authKey || !senderId) return false;

  try {
    const res = await fetch(`${WHATSAPP_BASE}/whatsapp/whatsapp-outbound-message/bulk/`, {
      method: "POST",
      headers: {
        authkey: authKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        integrated_number: senderId,
        content_type: "template",
        payload: {
          to: data.recipientPhone.replace("+", ""),
          type: "template",
          template: {
            name: "booking_confirmation",  // Must be pre-approved in MSG91/Meta
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: data.recipientName },
                  { type: "text", text: data.turfName },
                  { type: "text", text: data.slotDate },
                  { type: "text", text: data.startTime },
                  { type: "text", text: data.duration },
                  { type: "text", text: data.totalPrice },
                  { type: "text", text: data.bookingId.slice(0, 8).toUpperCase() },
                ],
              },
            ],
          },
        },
      }),
    });

    const json = await res.json().catch(() => ({}));
    return res.ok && json.type !== "error";
  } catch {
    return false;
  }
}

async function sendSMS(data: BookingMessageData): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SMS_SENDER_ID ?? "TRFMCH";
  const templateId = process.env.MSG91_SMS_TEMPLATE_ID;

  if (!authKey || !templateId) return false;

  // Format the message text (must match DLT registered template in India)
  const message =
    `TurfMacha: Booking Confirmed! ` +
    `${data.turfName} on ${data.slotDate} at ${data.startTime} (${data.duration}). ` +
    `Amount: ${data.totalPrice}. Ref: ${data.bookingId.slice(0, 8).toUpperCase()}`;

  try {
    const url = new URL(`${MSG91_BASE}/sendhttp.php`);
    url.searchParams.set("authkey", authKey);
    url.searchParams.set("mobiles", data.recipientPhone.replace("+", ""));
    url.searchParams.set("message", message);
    url.searchParams.set("sender", senderId);
    url.searchParams.set("route", "4");          // Transactional route
    url.searchParams.set("DLT_TE_ID", templateId);
    url.searchParams.set("country", "91");

    const res = await fetch(url.toString());
    const text = await res.text();
    // MSG91 returns "message_id:XXXXX" on success or "error" prefix on failure
    return !text.toLowerCase().startsWith("error") && res.ok;
  } catch {
    return false;
  }
}

/** Send booking confirmation via WhatsApp first, SMS as fallback. */
export async function sendBookingConfirmation(
  data: BookingMessageData
): Promise<DeliveryResult> {
  if (!process.env.MSG91_AUTH_KEY) {
    return { success: false, channel: "none", error: "MSG91_AUTH_KEY not configured" };
  }

  if (!data.recipientPhone) {
    return { success: false, channel: "none", error: "No phone number" };
  }

  // Try WhatsApp first (preferred for India)
  const whatsappOk = await sendWhatsApp(data);
  if (whatsappOk) return { success: true, channel: "whatsapp" };

  // Fall back to SMS
  const smsOk = await sendSMS(data);
  if (smsOk) return { success: true, channel: "sms" };

  return { success: false, channel: "none", error: "All delivery channels failed" };
}

/** Send booking cancellation notification */
export async function sendCancellationNotice(data: {
  recipientPhone: string;
  recipientName: string;
  turfName: string;
  slotDate: string;
  refundNote?: string;
}): Promise<DeliveryResult> {
  if (!process.env.MSG91_AUTH_KEY || !data.recipientPhone) {
    return { success: false, channel: "none" };
  }

  const message =
    `TurfMacha: Your booking at ${data.turfName} on ${data.slotDate} has been cancelled.` +
    (data.refundNote ? ` ${data.refundNote}` : "");

  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SMS_SENDER_ID ?? "TRFMCH";
  const templateId = process.env.MSG91_SMS_CANCEL_TEMPLATE_ID;

  if (!templateId) return { success: false, channel: "none" };

  try {
    const url = new URL(`${MSG91_BASE}/sendhttp.php`);
    url.searchParams.set("authkey", authKey);
    url.searchParams.set("mobiles", data.recipientPhone.replace("+", ""));
    url.searchParams.set("message", message);
    url.searchParams.set("sender", senderId);
    url.searchParams.set("route", "4");
    url.searchParams.set("DLT_TE_ID", templateId);
    url.searchParams.set("country", "91");

    const res = await fetch(url.toString());
    const text = await res.text();
    return {
      success: !text.toLowerCase().startsWith("error") && res.ok,
      channel: "sms",
    };
  } catch {
    return { success: false, channel: "none" };
  }
}
