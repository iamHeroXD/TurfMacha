import type { Metadata } from "next";
import Link from "next/link";
import { Search, CalendarCheck, Smartphone, Play, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How it Works",
  description: "From finding a ground to kicking off — TurfMacha makes turf booking seamless in 4 simple steps.",
};

const STEPS = [
  {
    icon: Search,
    title: "Find a Turf",
    description:
      "Browse through verified turfs in Trivandrum. Filter by location, price, and amenities to find the perfect ground for your game.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a Slot",
    description:
      "Check real-time availability. Select your preferred date and time slot. No more calling owners to check if the ground is free.",
  },
  {
    icon: Smartphone,
    title: "Book & Pay",
    description:
      "Pay securely through the app. You can even split the cost with your teammates directly within TurfMacha.",
  },
  {
    icon: Play,
    title: "Play",
    description:
      "Show up at the turf, show your booking confirmation, and start playing. It's that simple!",
  },
];

const FAQS = [
  {
    q: "Can I cancel my booking?",
    a: "Yes, you can cancel upcoming bookings from your dashboard before the slot starts. Cancellation policies vary by turf.",
  },
  {
    q: "How does payment work?",
    a: "We support UPI, credit/debit cards, net banking, and popular wallets via Razorpay. Payment is taken upfront to secure your slot.",
  },
  {
    q: "What if the turf is unavailable on the day?",
    a: "In the rare case of a last-minute cancellation by the turf owner, you will receive a full refund within 3-5 business days.",
  },
  {
    q: "Can I book for a group?",
    a: "Absolutely. Share the turf link with your squad and split the payment. One booking covers the entire slot.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0B3D2E] mb-5">
            How TurfMacha Works
          </h1>
          <p className="text-xl text-[#1F2937]/65 leading-relaxed">
            From finding a ground to kicking off, we&apos;ve made the entire process seamless.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mb-20">
          <div className="hidden lg:block absolute top-16 left-0 w-full h-0.5 bg-[#0B3D2E]/8 -z-10" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="flex flex-col items-center text-center group">
                <div className="relative w-24 h-24 bg-[#0B3D2E] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-[#0B3D2E]/20 transform group-hover:-translate-y-2 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#A3E635] rounded-full flex items-center justify-center font-display font-bold text-[#0B3D2E] text-sm border-4 border-white">
                    {index + 1}
                  </div>
                  <Icon className="w-8 h-8 text-[#A3E635]" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1F2937] mb-3">{title}</h3>
                <p className="text-[#1F2937]/60 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-[#0B3D2E] rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A3E635]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#166534]/50 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-5">
              Ready to hit the ground?
            </h2>
            <p className="text-white/65 text-base mb-10 leading-relaxed">
              Download the TurfMacha app now and book your first game in Trivandrum.
            </p>
            <Link
              href="/turfs"
              className="inline-flex items-center gap-2 bg-[#A3E635] text-[#0B3D2E] font-bold text-base px-8 py-4 rounded-full hover:bg-[#B8E872] transition-colors shadow-lg"
            >
              Browse Turfs Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-[#0B3D2E] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-display font-bold text-[#1F2937] mb-2">{q}</h3>
                <p className="text-[#1F2937]/65 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
