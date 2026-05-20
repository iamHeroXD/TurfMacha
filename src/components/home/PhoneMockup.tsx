"use client";

import { Star, MapPin, Home, Search, Calendar, User, Heart, CheckCircle2 } from "lucide-react";

/* ── Turf card data ── */
const TURFS = [
  {
    name: "Kazhakootam Arena",
    loc: "Kazhakootam · 2.1 km",
    rating: "4.9",
    reviews: "124",
    price: "₹1,200",
    sport: "⚽ Football",
    slots: ["6 PM", "7 PM", "8 PM"],
    gradient: "from-[#0D4D36] via-[#1a6b4a] to-[#2d8a5e]",
    accentColor: "#A6D96A",
  },
  {
    name: "Kowdiar Turf Hub",
    loc: "Kowdiar · 4.5 km",
    rating: "4.7",
    reviews: "89",
    price: "₹1,500",
    sport: "🏏 Cricket",
    slots: ["5 PM", "6 PM"],
    gradient: "from-[#1a3a5c] via-[#1e4d7a] to-[#2563a8]",
    accentColor: "#60a5fa",
  },
];

/* ── Inline turf "screenshot" card ── */
function TurfScreenCard({ turf, compact = false }: { turf: typeof TURFS[0]; compact?: boolean }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E7E2DA] shadow-sm">

      {/* Hero — CSS drawn field, no external image */}
      <div className={`relative bg-gradient-to-br ${turf.gradient} overflow-hidden`}
        style={{ height: compact ? 76 : 88 }}>

        {/* Field lines — pure CSS SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 240 90" preserveAspectRatio="xMidYMid slice">
          {/* Outer rectangle */}
          <rect x="12" y="8" width="216" height="74" rx="2" fill="none" stroke="white" strokeWidth="1.5"/>
          {/* Centre line */}
          <line x1="120" y1="8" x2="120" y2="82" stroke="white" strokeWidth="1"/>
          {/* Centre circle */}
          <circle cx="120" cy="45" r="16" fill="none" stroke="white" strokeWidth="1"/>
          <circle cx="120" cy="45" r="2" fill="white"/>
          {/* Penalty boxes */}
          <rect x="12" y="24" width="36" height="42" fill="none" stroke="white" strokeWidth="1"/>
          <rect x="192" y="24" width="36" height="42" fill="none" stroke="white" strokeWidth="1"/>
          {/* Goal boxes */}
          <rect x="12" y="31" width="16" height="28" fill="none" stroke="white" strokeWidth="1"/>
          <rect x="212" y="31" width="16" height="28" fill="none" stroke="white" strokeWidth="1"/>
        </svg>

        {/* Floodlight dots */}
        <div className="absolute top-1.5 left-3 w-1 h-1 rounded-full bg-white/40" />
        <div className="absolute top-1.5 right-3 w-1 h-1 rounded-full bg-white/40" />

        {/* Sport badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg">
          <span className="text-[8.5px] font-bold text-[#111111]">{turf.sport}</span>
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg">
          <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
          <span className="text-[8.5px] font-bold">{turf.rating}</span>
          <span className="text-[7px] text-[#9E9284]">({turf.reviews})</span>
        </div>

        {/* Fav */}
        <button className="absolute bottom-2 right-2 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center">
          <Heart className="w-2.5 h-2.5 text-[#9E9284]" />
        </button>

        {/* Price bottom left */}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 rounded-lg">
          <span className="text-[8.5px] font-bold text-white">{turf.price}<span className="text-[7px] opacity-70"> /hr</span></span>
        </div>
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <h4 className="font-bold text-[#111111] text-[10px] leading-tight">{turf.name}</h4>
        </div>
        <p className="text-[8px] text-[#9E9284] flex items-center gap-0.5 mb-2">
          <MapPin className="w-2 h-2 shrink-0" /> {turf.loc}
        </p>

        {/* Available slots */}
        <div className="flex items-center gap-1 mb-2">
          {turf.slots.map((slot) => (
            <span key={slot} className="text-[7.5px] font-semibold px-1.5 py-0.5 rounded-md border border-[#E7E2DA] text-[#5F5F5F] bg-[#F4F1EB]">
              {slot}
            </span>
          ))}
          <span className="text-[7px] text-[#9E9284] ml-0.5">available</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#0D4D36] font-bold text-[10px]">{turf.price}<span className="text-[8px] text-[#9E9284] font-normal"> /hr</span></span>
          <button
            className="text-white text-[8.5px] font-bold px-2.5 py-1 rounded-lg"
            style={{ background: "#0D4D36" }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup() {
  return (
    <div
      className="relative mx-auto select-none animate-float"
      style={{ width: 280, height: 590 }}
    >
      {/* ── Device shell ── */}
      <div
        className="absolute inset-0 rounded-[2.8rem] overflow-hidden"
        style={{
          background: "#0a0a0a",
          boxShadow: "0 48px 96px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.1)",
          padding: 9,
        }}
      >
        {/* ── Screen ── */}
        <div className="w-full h-full rounded-[2.2rem] overflow-hidden flex flex-col bg-[#F4F1EB] relative">

          {/* Dynamic island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-[72px] h-[18px] bg-[#0a0a0a] rounded-full" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-9 pb-0 shrink-0 z-10 relative">
            <span className="text-[9px] font-bold text-[#111111] tracking-tight">9:41</span>
            <div className="flex items-center gap-1">
              {/* Signal bars */}
              <div className="flex gap-[2px] items-end h-2.5">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-[2.5px] bg-[#111111] rounded-full" style={{ height: h }} />
                ))}
              </div>
              {/* Wifi */}
              <svg viewBox="0 0 20 14" className="w-3.5 h-2.5 fill-[#111111]">
                <path d="M10 11l2 2-2 2-2-2 2-2zm0-4C7.4 7 5 8 3.2 9.8L1.5 8.1C3.7 5.9 6.7 4.5 10 4.5s6.3 1.4 8.5 3.6l-1.7 1.7C15 8 12.6 7 10 7zm0-5C5.8 2 2.1 3.8 0 6.6l-1.7-1.7C1.2 1.7 5.3 0 10 0s8.8 1.7 11.7 4.9L20 6.6C17.9 3.8 14.2 2 10 2z" opacity=".3"/>
                <path d="M10 7C7.4 7 5 8 3.2 9.8l1.7 1.7C6.3 10 8.1 9 10 9s3.7 1 5.1 2.5l1.7-1.7C15 8 12.6 7 10 7zm0 4l2 2-2 2-2-2 2-2z"/>
              </svg>
              {/* Battery */}
              <div className="flex items-center gap-[1px]">
                <div className="w-5 h-2.5 rounded-[2px] border border-[#111111] relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 bg-[#111111] rounded-sm" style={{ width: "75%" }} />
                </div>
                <div className="w-[1.5px] h-1.5 bg-[#111111] rounded-r-full opacity-60" />
              </div>
            </div>
          </div>

          {/* ── App header ── */}
          <div className="px-4 pt-2 pb-2.5 bg-white border-b border-[#E7E2DA] shrink-0 z-10 relative">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-[8px] text-[#9E9284] font-medium leading-none mb-0.5">Your location</p>
                <div className="flex items-center gap-1 text-[#0D4D36] font-bold text-[10.5px]">
                  <MapPin className="w-2.5 h-2.5 text-[#A6D96A]" />
                  Trivandrum, Kerala
                </div>
              </div>
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-[#0D4D36]/10 border border-[#0D4D36]/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#0D4D36]" />
              </div>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 bg-[#F4F1EB] rounded-xl px-2.5 py-1.5 border border-[#E7E2DA]">
              <Search className="w-2.5 h-2.5 text-[#9E9284] shrink-0" />
              <span className="text-[8.5px] text-[#9E9284]">Search turfs, areas...</span>
            </div>
          </div>

          {/* ── Sport filter pills ── */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-white border-b border-[#E7E2DA] shrink-0 overflow-hidden">
            {[
              { label: "⚽ All", active: true },
              { label: "🏏 Cricket", active: false },
              { label: "🏸 Badminton", active: false },
            ].map(({ label, active }) => (
              <span key={label}
                className={`text-[7.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border ${
                  active
                    ? "bg-[#0D4D36] text-white border-[#0D4D36]"
                    : "bg-white text-[#5F5F5F] border-[#E7E2DA]"
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* ── Scroll content ── */}
          <div className="flex-1 overflow-hidden px-3 pt-3 pb-14 flex flex-col gap-2.5">

            {/* Section heading + count */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[10.5px] text-[#111111]">Turfs Near You</h3>
              <span className="text-[8px] text-[#0D4D36] font-semibold">24 results</span>
            </div>

            {/* Booking confirmed badge */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#0D4D36]/8 border border-[#0D4D36]/15 rounded-xl">
              <CheckCircle2 className="w-3 h-3 text-[#0D4D36] shrink-0" />
              <div className="min-w-0">
                <p className="text-[8px] font-bold text-[#0D4D36] leading-none">Booking confirmed!</p>
                <p className="text-[7px] text-[#5F5F5F] mt-0.5">Kazhakootam Arena · Today 7 PM</p>
              </div>
            </div>

            {/* Turf cards */}
            {TURFS.map((t) => (
              <TurfScreenCard key={t.name} turf={t} />
            ))}
          </div>

          {/* ── Bottom nav ── */}
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[#E7E2DA] px-4 pt-1.5 pb-4 flex justify-between items-center z-20"
            style={{ borderRadius: "0 0 2.2rem 2.2rem" }}>
            {[
              { icon: Home,      label: "Home",     active: true  },
              { icon: Search,    label: "Explore",  active: false },
              { icon: Calendar,  label: "Bookings", active: false },
              { icon: User,      label: "Profile",  active: false },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className={`flex flex-col items-center gap-0.5 ${active ? "text-[#0D4D36]" : "text-[#C4BAB0]"}`}>
                <div className={`relative ${active ? "p-1 bg-[#0D4D36]/8 rounded-lg" : ""}`}>
                  <Icon className="w-[15px] h-[15px]" strokeWidth={active ? 2.4 : 1.8} />
                  {active && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#A6D96A] rounded-full border border-white" />}
                </div>
                <span className={`text-[7px] font-semibold`}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Physical side buttons ── */}
      {/* Volume up */}
      <div className="absolute rounded-l-sm" style={{ top: "19%", left: -3, width: 3, height: 26, background: "#1c1c1e" }} />
      {/* Volume down */}
      <div className="absolute rounded-l-sm" style={{ top: "28%", left: -3, width: 3, height: 26, background: "#1c1c1e" }} />
      {/* Power */}
      <div className="absolute rounded-r-sm" style={{ top: "24%", right: -3, width: 3, height: 40, background: "#1c1c1e" }} />

      {/* ── Screen glare ── */}
      <div className="absolute top-8 left-8 w-16 h-32 rounded-full bg-white/[0.04] blur-xl pointer-events-none" style={{ transform: "rotate(-20deg)" }} />
    </div>
  );
}
