import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';
export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-turf-lime/10 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-turf-emerald/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-turf-emerald/10 text-turf-emerald font-medium text-sm mb-6 border border-turf-emerald/20">
              <span className="w-2 h-2 rounded-full bg-turf-lime animate-pulse"></span>
              Now live in Trivandrum (Coming soon: Kochi, Calicut)
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-turf-emerald leading-[1.1] mb-6">
              Book turf. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-turf-emerald to-turf-green">
                Skip the chaos.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-turf-charcoal/80 mb-8 leading-relaxed max-w-lg">
              Your ground. Your game. One tap away. Join thousands of players in
              Trivandrum booking their favorite turfs instantly.{' '}
              <span className="font-display font-bold text-turf-emerald ml-1">
                കളിക്കാം!
              </span>
            </p>

            {/* Trust Strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 mb-10">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) =>
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-turf-cream" />

                  )}
                </div>
                <div className="text-sm font-medium text-turf-charcoal">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-turf-emerald font-bold">
                      4.8
                    </span>
                  </div>
                  50k+ bookings
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-turf-emerald/20"></div>
              <div className="flex items-center gap-2 text-sm font-medium text-turf-charcoal">
                <CheckCircle2 className="w-5 h-5 text-turf-lime" />
                500+ Turfs Verified
              </div>
            </div>

            {/* Download Badges - CRITICAL: Exact same height */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="transition-transform hover:scale-105 active:scale-95 inline-block">
                
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-[48px] w-auto object-contain" />
                
              </a>
              <a
                href="#"
                className="transition-transform hover:scale-105 active:scale-95 inline-block">
                
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-[68px] -ml-2 w-auto object-contain"
                  style={{
                    marginTop: '-10px',
                    marginBottom: '-10px'
                  }} />
                
              </a>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative lg:ml-auto w-full max-w-md mx-auto lg:max-w-none flex justify-center">
            {/* Decorative elements behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-turf-lime/20 to-turf-emerald/5 rounded-full blur-3xl -z-10"></div>

            <PhoneMockup />

            {/* Floating Badge */}
            <div
              className="absolute bottom-20 -left-6 sm:-left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce"
              style={{
                animationDuration: '3s'
              }}>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Booking Confirmed
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Kazhakootam Arena • 7 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}