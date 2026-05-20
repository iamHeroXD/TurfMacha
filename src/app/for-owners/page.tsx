import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Users, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "For Owners — Partner with TurfMacha",
  description: "List your turf on TurfMacha and reach thousands of players in Kerala. Manage bookings, grow revenue, and fill empty slots.",
};

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Increase Revenue",
    desc: "Fill empty slots during off-peak hours by reaching thousands of active players in Trivandrum.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Say goodbye to double bookings and messy WhatsApp chats. Manage everything in one dashboard.",
  },
  {
    icon: Users,
    title: "Customer Insights",
    desc: "Understand your peak times, most loyal customers, and revenue trends with detailed analytics.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Get paid instantly and securely. Reduce no-shows with our upfront payment system.",
  },
];

export default function ForOwnersPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A3E635]/20 text-[#0B3D2E] font-medium text-sm mb-6">
              Partner with TurfMacha
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#0B3D2E] mb-6 leading-tight">
              Grow your turf business on autopilot.
            </h1>
            <p className="text-lg text-[#1F2937]/65 mb-8 leading-relaxed">
              Join Trivandrum&apos;s largest sports community. Manage bookings, increase utilisation,
              and boost your revenue with our comprehensive turf management software.
            </p>
            <Link href="/signup?role=owner">
              <button className="bg-[#0B3D2E] text-white px-8 py-4 rounded-full font-display font-bold text-base hover:bg-[#A3E635] hover:text-[#0B3D2E] transition-colors flex items-center gap-2 group shadow-lg shadow-[#0B3D2E]/25">
                Become a Partner{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0B3D2E]/15 to-[#A3E635]/15 rounded-3xl transform rotate-3" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?auto=format&fit=crop&q=80&w=1200"
              alt="Turf Owner"
              className="rounded-3xl shadow-2xl relative z-10 object-cover h-[420px] w-full"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center text-[#1F2937] mb-12">
            Why partner with us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#FAF7F0] rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#0B3D2E]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1F2937] mb-2">{title}</h3>
                <p className="text-[#1F2937]/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration form */}
        <div className="bg-[#FAF7F0] rounded-[2.5rem] p-8 md:p-14 border border-[#0B3D2E]/8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1F2937] mb-4">
              Ready to list your turf?
            </h2>
            <p className="text-[#1F2937]/60 text-base">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>
          <form className="space-y-4 text-left bg-white p-8 rounded-3xl shadow-sm max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Your Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition-shadow text-sm"
                  placeholder="Arjun Sreekumar"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition-shadow text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Turf Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition-shadow text-sm"
                placeholder="e.g. Green Arena Sports Hub"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Location in Trivandrum</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition-shadow text-sm"
                placeholder="e.g. Kazhakootam"
              />
            </div>
            <Link href="/signup?role=owner">
              <button
                type="button"
                className="w-full bg-[#0B3D2E] text-white font-display font-bold text-base py-4 rounded-xl hover:bg-[#0B3D2E]/90 transition-colors mt-2 shadow-lg shadow-[#0B3D2E]/20"
              >
                Submit Request
              </button>
            </Link>
          </form>
        </div>

      </div>
    </div>
  );
}
