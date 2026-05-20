"use client";

import Image from "next/image";
import { Search, MapPin, Star, Home, Calendar, User, Heart } from "lucide-react";

const TURFS = [
  {
    name: "Kazhakootam Sports Hub",
    loc: "Kazhakootam · 2.1 km",
    img: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600",
    rating: "4.9",
    reviews: "124",
    price: "₹1,200",
    sport: "⚽",
  },
  {
    name: "Kowdiar Turf Arena",
    loc: "Kowdiar · 4.5 km",
    img: "https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba6?auto=format&fit=crop&q=80&w=600",
    rating: "4.7",
    reviews: "89",
    price: "₹1,500",
    sport: "🏏",
  },
];

export function PhoneMockup() {
  return (
    /* Device shell */
    <div
      className="relative mx-auto select-none animate-float"
      style={{ width: 280, height: 580 }}
    >
      {/* Outer frame */}
      <div
        className="absolute inset-0 rounded-[2.8rem] bg-[#0a0a0a] shadow-[0_40px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden"
        style={{ padding: 10 }}
      >
        {/* Screen */}
        <div className="w-full h-full rounded-[2.1rem] bg-[#F4F1EB] overflow-hidden flex flex-col relative">

          {/* Dynamic island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-20 h-5 bg-[#0a0a0a] rounded-full" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-10 pb-0 shrink-0 relative z-10">
            <span className="text-[9px] font-bold text-[#111111]">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 items-end h-3">
                {[2, 3, 4, 3].map((h, i) => (
                  <div key={i} className="w-0.5 bg-[#111111] rounded-full" style={{ height: h * 2.5 }} />
                ))}
              </div>
              <svg viewBox="0 0 16 12" className="w-3.5 h-3 fill-[#111111]">
                <path d="M8 2.4C5.6 2.4 3.4 3.4 1.8 5L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2L14.2 5C12.6 3.4 10.4 2.4 8 2.4z" opacity=".3"/>
                <path d="M8 6C6.4 6 5 6.6 3.8 7.6L2 5.8C3.6 4.4 5.7 3.6 8 3.6s4.4.8 6 2.2L12.2 7.6C11 6.6 9.6 6 8 6z" opacity=".6"/>
                <path d="M8 9.6c-1 0-1.9.4-2.6 1L8 14l2.6-3.4c-.7-.6-1.6-1-2.6-1z"/>
              </svg>
              <svg viewBox="0 0 25 12" className="w-5 h-3 fill-[#111111]">
                <rect x="0" y="1" width="21" height="10" rx="3" opacity=".35"/>
                <rect x="1" y="2" width="16" height="8" rx="2"/>
                <path d="M22 4v4a2 2 0 000-4z"/>
              </svg>
            </div>
          </div>

          {/* App header */}
          <div className="px-4 pt-2 pb-3 bg-white border-b border-[#E7E2DA] shrink-0 relative z-10">
            <div className="flex justify-between items-center mb-2.5">
              <div>
                <p className="text-[8.5px] text-[#9E9284] font-medium leading-none mb-0.5">Your location</p>
                <div className="flex items-center gap-1 text-[#0D4D36] font-bold text-[11px]">
                  <MapPin className="w-3 h-3 text-[#A6D96A]" />
                  Trivandrum, Kerala
                </div>
              </div>
              <div className="w-7 h-7 bg-[#F4F1EB] rounded-full flex items-center justify-center border border-[#E7E2DA]">
                <User className="w-3.5 h-3.5 text-[#0D4D36]" />
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9E9284]" />
              <div className="w-full bg-[#F4F1EB] text-[9.5px] rounded-xl py-2 pl-7 pr-3 text-[#9E9284] border border-[#E7E2DA]">
                Search turfs, areas...
              </div>
            </div>
          </div>

          {/* Scroll content */}
          <div className="flex-1 overflow-hidden px-3.5 pt-3 pb-14 flex flex-col gap-3">
            {/* Section heading */}
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-[11px] text-[#111111]">Popular Near You</h3>
              <span className="text-[9px] text-[#0D4D36] font-semibold">See all →</span>
            </div>

            {/* Turf cards */}
            {TURFS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl overflow-hidden border border-[#E7E2DA] shadow-sm">
                {/* Image */}
                <div className="h-24 bg-[#E7E2DA] relative overflow-hidden">
                  <Image src={t.img} alt={t.name} fill className="object-cover" sizes="240px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Sport badge */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-[9px] font-bold">
                    {t.sport} {t.sport === "⚽" ? "Football" : "Cricket"}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-[9px] font-bold">{t.rating}</span>
                    <span className="text-[8px] text-[#9E9284]">({t.reviews})</span>
                  </div>

                  {/* Heart */}
                  <button className="absolute bottom-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-[#9E9284]" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <h4 className="font-bold text-[#111111] text-[10px] leading-tight">{t.name}</h4>
                  <p className="text-[8.5px] text-[#9E9284] flex items-center gap-0.5 mt-0.5 mb-2">
                    <MapPin className="w-2 h-2 shrink-0" /> {t.loc}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[#0D4D36] font-bold text-[11px]">{t.price}</span>
                      <span className="text-[8px] text-[#9E9284] font-normal"> /hr</span>
                    </div>
                    <button className="bg-[#0D4D36] text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[#E7E2DA] px-5 pt-2 pb-4 flex justify-between items-center z-20 rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
            {[
              { icon: Home,     label: "Home",    active: true  },
              { icon: Search,   label: "Explore", active: false },
              { icon: Calendar, label: "My Slots",active: false },
              { icon: User,     label: "Profile", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className={`flex flex-col items-center gap-0.5 ${active ? "text-[#0D4D36]" : "text-[#C4BAB0]"}`}>
                <Icon className="w-4 h-4" />
                <span className={`text-[7.5px] font-semibold ${active ? "" : "font-medium"}`}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Side buttons (volume + power) */}
      <div className="absolute top-[22%] -left-[3px] h-8 w-[3px] bg-[#222] rounded-l-sm" />
      <div className="absolute top-[32%] -left-[3px] h-6 w-[3px] bg-[#222] rounded-l-sm" />
      <div className="absolute top-[23%] -right-[3px] h-10 w-[3px] bg-[#222] rounded-r-sm" />
    </div>
  );
}
