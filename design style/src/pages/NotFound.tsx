import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
export function NotFound() {
  return (
    <div className="pt-32 pb-20 min-h-[80vh] flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 with football */}
        <div className="relative inline-block mb-8">
          <div className="font-display font-extrabold text-[10rem] sm:text-[14rem] leading-none text-turf-emerald/10 select-none">
            4<span className="text-turf-emerald/10">0</span>4
          </div>
          {/* Football */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-[6px] border-turf-emerald flex items-center justify-center animate-bounce"
            style={{
              animationDuration: '2s'
            }}>
            
            <svg viewBox="0 0 100 100" className="w-full h-full p-2">
              <polygon points="50,20 65,30 60,48 40,48 35,30" fill="#0B3D2E" />
              <polygon points="20,50 35,30 40,48 30,65 20,65" fill="#0B3D2E" />
              <polygon points="80,50 65,30 60,48 70,65 80,65" fill="#0B3D2E" />
              <polygon points="35,75 40,48 60,48 65,75 50,82" fill="#0B3D2E" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-turf-emerald mb-4">
          This turf doesn't exist 🏃
        </h1>
        <p className="text-lg text-turf-charcoal/70 mb-10 max-w-md mx-auto">
          Looks like you've kicked the ball out of bounds. Let's get you back to
          the game.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="bg-turf-emerald text-white px-6 py-3 rounded-xl font-medium hover:bg-turf-emerald/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            
            <Home className="w-4 h-4" /> Go home
          </Link>
          <Link
            to="/turfs"
            className="bg-white border border-turf-emerald/20 text-turf-emerald px-6 py-3 rounded-xl font-medium hover:bg-turf-cream transition-colors flex items-center gap-2">
            
            <ArrowLeft className="w-4 h-4" /> Browse turfs
          </Link>
        </div>
      </div>
    </div>);

}