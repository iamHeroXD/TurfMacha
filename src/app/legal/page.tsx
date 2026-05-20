import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms of Service",
  description: "TurfMacha's Privacy Policy and Terms of Service.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-[#0D4D36] mb-4">Privacy Policy & Terms</h1>
        <p className="text-[#111111]/55 mb-12">Last updated: January 2025</p>

        <div className="space-y-12">
          <section className="bg-white rounded-2xl p-8 border border-[#E7E2DA]">
            <h2 className="text-2xl font-display font-bold text-[#0D4D36] mb-4">Privacy Policy</h2>
            <div className="space-y-4 text-[#111111]/70 text-sm leading-relaxed">
              <p>
                TurfMacha (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy
                explains how we collect, use, and safeguard your information.
              </p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">Information We Collect</h3>
              <p>We collect information you provide directly, such as your name, email address, phone number, and payment details when you create an account or make a booking.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">How We Use Your Information</h3>
              <p>We use your information to process bookings, send confirmations, provide customer support, and improve our services. We do not sell your personal data to third parties.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">Data Security</h3>
              <p>All data is encrypted in transit and at rest. Payments are processed by Razorpay, a PCI-DSS compliant payment gateway. We never store card details on our servers.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">Contact</h3>
              <p>For privacy-related questions, email us at privacy@turfmacha.com.</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#E7E2DA]">
            <h2 className="text-2xl font-display font-bold text-[#0D4D36] mb-4">Terms of Service</h2>
            <div className="space-y-4 text-[#111111]/70 text-sm leading-relaxed">
              <p>By using TurfMacha, you agree to these terms. Please read them carefully.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">Bookings</h3>
              <p>All bookings are subject to availability. Once confirmed, a booking cannot be transferred to another user. Cancellations must be made before the slot start time.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">Payments</h3>
              <p>Payments are collected upfront to secure your slot. Refunds for cancellations are processed within 5–7 business days, depending on your payment method.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">User Conduct</h3>
              <p>Users are expected to respect turf facilities and other players. Misuse of the platform may result in account suspension.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">Turf Owners</h3>
              <p>Owners are responsible for maintaining accurate availability and facility information. Double-booking or misrepresentation may result in removal from the platform.</p>
              <h3 className="font-display font-bold text-[#111111] text-base mt-6">Changes to Terms</h3>
              <p>We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}