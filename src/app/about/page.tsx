import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Heart, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About TurfMacha",
  description: "TurfMacha is Kerala's #1 turf booking platform. Built by sports enthusiasts, for sports enthusiasts.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Sports First",
    desc: "We are players at heart. Every feature we build starts with the question: does this make getting on the pitch easier?",
  },
  {
    icon: MapPin,
    title: "Kerala Proud",
    desc: "Built in Trivandrum, for Trivandrum. We understand the local culture and the passion for football and cricket in Kerala.",
  },
  {
    icon: Target,
    title: "Zero Hassle",
    desc: "Our goal is to eliminate every friction point between wanting to play and actually playing. No calls. No confusion.",
  },
  {
    icon: Zap,
    title: "Move Fast",
    desc: "We ship fast and listen to feedback. If something doesn't work for players or owners, we fix it — quickly.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D4D36]/10 text-[#0D4D36] font-medium text-sm mb-6 border border-[#0D4D36]/20">
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0D4D36] mb-6 leading-tight">
            We built TurfMacha because we couldn&apos;t find a turf to play.
          </h1>
          <p className="text-xl text-[#111111]/65 leading-relaxed">
            Every weekend, we&apos;d spend 30 minutes calling 5 different turf owners just to find an open slot.
            So we built TurfMacha — and now we never have to do that again.
          </p>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          <div className="relative rounded-3xl overflow-hidden h-[380px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D4D36]/10 to-[#A6D96A]/10 rounded-3xl transform -rotate-2 z-10 pointer-events-none" />
            <Image
              src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=1200"
              alt="Football turf in Kerala"
              fill className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-[#0D4D36] mb-5">From Trivandrum, for Kerala</h2>
            <div className="space-y-4 text-[#111111]/70 leading-relaxed">
              <p>
                TurfMacha started in 2024 in Trivandrum, Kerala. We were a group of football-obsessed friends
                who were tired of the chaos of booking turfs — calling owners, getting busy tones,
                and discovering the turf was double-booked when we showed up.
              </p>
              <p>
                We built a simple app to solve our own problem. Thousands of players in Trivandrum found
                it useful, and turf owners loved the automatic bookings. Today, TurfMacha hosts 500+ turfs
                and has powered over 50,000 bookings across Kerala.
              </p>
              <p>
                Our mission is simple: make sports accessible to every player in India, starting with Kerala.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center text-[#111111] mb-12">What we stand for</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-3xl p-8 border border-[#E7E2DA] shadow-sm hover:shadow-md transition-shadow flex gap-5">
                <div className="w-12 h-12 bg-[#F4F1EB] rounded-2xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-[#0D4D36]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#111111] mb-2">{title}</h3>
                  <p className="text-[#111111]/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0D4D36] rounded-[2.5rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#A6D96A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Join the community</h2>
            <p className="text-white/65 mb-8 text-base">10,000+ players already use TurfMacha in Trivandrum. Your game is one tap away.</p>
            <Link href="/turfs">
              <button className="bg-[#A6D96A] text-[#0D4D36] font-display font-bold px-8 py-4 rounded-full text-base hover:bg-[#B8E872] transition-colors shadow-lg inline-flex items-center gap-2">
                Find a Turf <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}