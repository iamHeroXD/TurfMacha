import { test, expect } from "@playwright/test";
import crypto from "crypto";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

// Unit-style tests for the webhook signature verification logic
test.describe("Razorpay webhook security", () => {
  function makeSignature(body: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(body).digest("hex");
  }

  test("webhook rejects missing signature", async ({ request }) => {
    const res = await request.post(`${BASE}/api/payments/webhook`, {
      data: JSON.stringify({ event: "payment.captured", payload: {} }),
      headers: { "content-type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });

  test("webhook rejects invalid signature", async ({ request }) => {
    const body = JSON.stringify({ event: "payment.captured", payload: {} });
    const res = await request.post(`${BASE}/api/payments/webhook`, {
      data: body,
      headers: {
        "content-type": "application/json",
        "x-razorpay-signature": "badsignature",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("create-order requires auth", async ({ request }) => {
    const res = await request.post(`${BASE}/api/payments/create-order`, {
      data: { turfId: "test", slotDate: "2026-01-01", startTime: "10:00", endTime: "11:00", durationHours: 1, totalPrice: 500, sport: "football" },
    });
    expect(res.status()).toBe(401);
  });

  test("verify requires auth", async ({ request }) => {
    const res = await request.post(`${BASE}/api/payments/verify`, {
      data: { bookingId: "test", razorpayOrderId: "test", razorpayPaymentId: "test", razorpaySignature: "test" },
    });
    expect(res.status()).toBe(401);
  });

  test("delete-user requires admin auth", async ({ request }) => {
    const res = await request.delete(`${BASE}/api/admin/delete-user`, {
      data: { userId: "test-user-id" },
    });
    expect(res.status()).toBe(401);
  });
});
