import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the TurfMacha team. We're here to help players and turf owners.",
};

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+91 98765 43210",
    desc: "Chat with us instantly",
    href: "https://wa.me/919876543210",
  },
  {
    icon: Mail,
    title: "Email",
    value: "hello@turfmacha.com",
    desc: "We reply within 24 hours",
    href: "mailto:hello@turfmacha.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 98765 43210",
    desc: "Mon – Sat, 9 AM – 6 PM",
    href: "tel:+919876543210",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "Technopark, Trivandrum",
    desc: "Kerala, India — 695581",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0B3D2E] mb-5">
            Get in touch
          </h1>
          <p className="text-xl text-[#1F2937]/65">
            Whether you&apos;re a player with a question or a turf owner looking to partner — we&apos;re here.
          </p>
        </div>

        {/* Contact channels */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {CHANNELS.map(({ icon: Icon, title, value, desc, href }) => {
            const Wrapper = href ? "a" : "div";
            return (
              <Wrapper
                key={title}
                {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#0B3D2E]/20 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-[#FAF7F0] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#0B3D2E]/8 transition-colors">
                  <Icon className="w-5 h-5 text-[#0B3D2E]" />
                </div>
                <div>
                  <p className="font-display font-bold text-[#0B3D2E] mb-0.5">{title}</p>
                  <p className="font-semibold text-[#1F2937] text-sm">{value}</p>
                  <p className="text-[#1F2937]/50 text-xs mt-0.5">{desc}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-display font-bold text-[#1F2937] mb-8">Send us a message</h2>
          <form className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Subject</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent"
                placeholder="How can we help you?"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Message</label>
              <textarea
                rows={5}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="button"
              className="w-full bg-[#0B3D2E] text-white font-display font-bold text-base py-4 rounded-xl hover:bg-[#0B3D2E]/90 transition-colors shadow-lg shadow-[#0B3D2E]/20"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
