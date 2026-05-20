import React from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  Home,
  Calendar,
  User } from
'lucide-react';
export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[320px] h-[650px] bg-black rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden animate-float">
      {/* iPhone Notch */}
      <div className="absolute top-0 inset-x-0 h-7 w-40 mx-auto bg-black rounded-b-3xl z-20 flex justify-center items-center gap-2">
        <div className="w-12 h-1.5 bg-gray-800 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
      </div>

      {/* Screen Content */}
      <div className="w-full h-full bg-gray-50 flex flex-col relative z-10 overflow-hidden pt-8">
        {/* App Header */}
        <div className="px-5 pt-4 pb-2 bg-white rounded-b-3xl shadow-sm z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Current Location
              </p>
              <div className="flex items-center gap-1 text-turf-emerald font-bold">
                <MapPin className="w-4 h-4 text-turf-lime" />
                Trivandrum, Kerala
              </div>
            </div>
            <div className="w-10 h-10 bg-turf-cream rounded-full flex items-center justify-center border border-turf-emerald/10">
              <User className="w-5 h-5 text-turf-emerald" />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for turfs..."
              className="w-full bg-gray-100 text-sm rounded-xl py-2.5 pl-9 pr-4 outline-none focus:ring-2 focus:ring-turf-lime"
              readOnly />
            
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-24 hide-scrollbar">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-display font-bold text-lg text-gray-900">
              Popular Near You
            </h3>
            <span className="text-xs text-turf-emerald font-medium">
              See all
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Turf Card 1 */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="h-32 bg-gray-200 rounded-xl mb-3 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600"
                  alt="Turf"
                  className="w-full h-full object-cover" />
                
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">
                Kazhakootam Sports Hub
              </h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 mb-3">
                <MapPin className="w-3 h-3" /> Kazhakootam (2.1 km)
              </p>
              <div className="flex justify-between items-center">
                <div className="text-turf-emerald font-bold text-sm">
                  ₹1,200{' '}
                  <span className="text-xs text-gray-400 font-normal">/hr</span>
                </div>
                <button className="bg-turf-emerald text-white text-xs font-medium px-4 py-1.5 rounded-lg">
                  Book
                </button>
              </div>
            </div>

            {/* Turf Card 2 */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="h-32 bg-gray-200 rounded-xl mb-3 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba6?auto=format&fit=crop&q=80&w=600"
                  alt="Turf"
                  className="w-full h-full object-cover" />
                
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">4.7</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">
                Kowdiar Turf Arena
              </h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 mb-3">
                <MapPin className="w-3 h-3" /> Kowdiar (4.5 km)
              </p>
              <div className="flex justify-between items-center">
                <div className="text-turf-emerald font-bold text-sm">
                  ₹1,500{' '}
                  <span className="text-xs text-gray-400 font-normal">/hr</span>
                </div>
                <button className="bg-turf-emerald text-white text-xs font-medium px-4 py-1.5 rounded-lg">
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center pb-8 z-20 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center gap-1 text-turf-emerald">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-medium">Explore</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium">Bookings</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </div>
        </div>
      </div>
    </div>);

}