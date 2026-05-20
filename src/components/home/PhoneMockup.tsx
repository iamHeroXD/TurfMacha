"use client";

import { Search, MapPin, Star, Home, Calendar, User } from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] h-[610px] bg-black rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden animate-float">
      {/* iPhone Notch */}
      <div className="absolute top-0 inset-x-0 h-7 w-36 mx-auto bg-black rounded-b-3xl z-20 flex justify-center items-center gap-2">
        <div className="w-10 h-1.5 bg-gray-800 rounded-full" />
        <div className="w-2 h-2 bg-gray-800 rounded-full" />
      </div>

      {/* Screen */}
      <div className="w-full h-full bg-gray-50 flex flex-col relative z-10 overflow-hidden pt-8">
        {/* App Header */}
        <div className="px-4 pt-4 pb-3 bg-white rounded-b-3xl shadow-sm z-10">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-[10px] text-gray-500 font-medium">Current Location</p>
              <div className="flex items-center gap-1 text-[#0B3D2E] font-bold text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#A3E635]" />
                Trivandrum, Kerala
              </div>
            </div>
            <div className="w-9 h-9 bg-[#FAF7F0] rounded-full flex items-center justify-center border border-[#0B3D2E]/10">
              <User className="w-4 h-4 text-[#0B3D2E]" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              readOnly
              placeholder="Search for turfs..."
              className="w-full bg-gray-100 text-xs rounded-xl py-2.5 pl-8 pr-3 outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 hide-scrollbar">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-display font-bold text-base text-gray-900">Popular Near You</h3>
            <span className="text-[10px] text-[#0B3D2E] font-semibold">See all</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                name: "Kazhakootam Sports Hub",
                loc: "Kazhakootam (2.1 km)",
                img: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600",
                rating: "4.9",
                price: "₹1,200",
              },
              {
                name: "Kowdiar Turf Arena",
                loc: "Kowdiar (4.5 km)",
                img: "https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba6?auto=format&fit=crop&q=80&w=600",
                rating: "4.7",
                price: "₹1,500",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                <div className="h-28 bg-gray-200 rounded-xl mb-2.5 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-bold">{t.rating}</span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 text-xs">{t.name}</h4>
                <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5 mb-2">
                  <MapPin className="w-2.5 h-2.5" /> {t.loc}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#0B3D2E] font-bold text-xs">
                    {t.price} <span className="text-[9px] text-gray-400 font-normal">/hr</span>
                  </span>
                  <button className="bg-[#0B3D2E] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-5 py-3 flex justify-between items-center pb-7 z-20 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center gap-0.5 text-[#0B3D2E]">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-semibold">Home</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-gray-400">
            <Search className="w-5 h-5" />
            <span className="text-[9px] font-medium">Explore</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-gray-400">
            <Calendar className="w-5 h-5" />
            <span className="text-[9px] font-medium">Bookings</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-medium">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
