import React from 'react';
import { Search, CalendarCheck, Play, Smartphone } from 'lucide-react';
export function HowItWorks() {
  const steps = [
  {
    icon: <Search className="w-8 h-8 text-turf-lime" />,
    title: 'Find a Turf',
    description:
    'Browse through verified turfs in Trivandrum. Filter by location, price, and amenities to find the perfect ground for your game.'
  },
  {
    icon: <CalendarCheck className="w-8 h-8 text-turf-lime" />,
    title: 'Pick a Slot',
    description:
    'Check real-time availability. Select your preferred date and time slot. No more calling owners to check if the ground is free.'
  },
  {
    icon: <Smartphone className="w-8 h-8 text-turf-lime" />,
    title: 'Book & Pay',
    description:
    'Pay securely through the app. You can even split the cost with your teammates directly within TurfMacha.'
  },
  {
    icon: <Play className="w-8 h-8 text-turf-lime" />,
    title: 'Play',
    description:
    "Show up at the turf, show your booking confirmation, and start playing. It's that simple!"
  }];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-turf-emerald mb-6">
            How TurfMacha Works
          </h1>
          <p className="text-xl text-turf-charcoal/70">
            From finding a ground to kicking off, we've made the entire process
            seamless.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-turf-cream -translate-y-1/2 -z-10"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) =>
            <div
              key={index}
              className="relative flex flex-col items-center text-center group">
              
                <div className="w-24 h-24 bg-turf-emerald rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-turf-emerald/20 transform group-hover:-translate-y-2 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-turf-lime rounded-full flex items-center justify-center font-bold text-turf-emerald border-4 border-white">
                    {index + 1}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 bg-turf-emerald rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-turf-lime/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-turf-green/50 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to hit the ground?
            </h2>
            <p className="text-turf-cream/80 text-lg mb-10">
              Download the TurfMacha app now and book your first game in
              Trivandrum.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="transition-transform hover:scale-105 active:scale-95 inline-block bg-black rounded-xl p-1">
                
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-[48px] w-auto" />
                
              </a>
              <a
                href="#"
                className="transition-transform hover:scale-105 active:scale-95 inline-block bg-black rounded-xl p-1">
                
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Google Play"
                  className="h-[68px] -ml-2 w-auto object-contain"
                  style={{
                    marginTop: '-10px',
                    marginBottom: '-10px'
                  }} />
                
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>);

}