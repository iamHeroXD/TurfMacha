import React from 'react';
import { Check, Smartphone, Zap, Shield, Heart } from 'lucide-react';
import { PhoneMockup } from '../components/PhoneMockup';
export function Download() {
  const features = [
  'Instant turf booking with real-time slot availability',
  'Split payments easily with your squad',
  'Track all your upcoming and past bookings',
  'Exclusive offers for app users',
  'Live chat support in Malayalam & English',
  'Push notifications for booking reminders'];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-turf-lime/20 text-turf-emerald font-medium text-sm mb-6">
              <Smartphone className="w-4 h-4" /> Get the app
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-turf-emerald leading-[1.1] mb-6">
              Download TurfMacha. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-turf-emerald to-turf-green">
                Start playing today.
              </span>
            </h1>

            <p className="text-lg text-turf-charcoal/80 mb-10 leading-relaxed max-w-lg">
              Available on iOS and Android. Free to download. No subscription
              required.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
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

            {/* QR Code visual */}
            <div className="inline-flex items-center gap-5 bg-white p-5 rounded-2xl border border-turf-emerald/10 shadow-sm">
              <div className="w-24 h-24 bg-turf-emerald rounded-xl p-2 shrink-0">
                <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-0.5">
                  {/* Faux QR code */}
                  {Array.from({
                    length: 49
                  }).map((_, i) => {
                    // Corner squares
                    const row = Math.floor(i / 7);
                    const col = i % 7;
                    const isCorner =
                    row < 2 && col < 2 ||
                    row < 2 && col > 4 ||
                    row > 4 && col < 2;
                    const isPattern = i * 7 % 13 < 6;
                    return (
                      <div
                        key={i}
                        className={`rounded-sm ${isCorner || isPattern ? 'bg-turf-lime' : 'bg-transparent'}`} />);


                  })}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Scan to download
                </p>
                <p className="font-bold text-turf-emerald">
                  Point your camera here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Available in App Store & Play Store
                </p>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative lg:ml-auto w-full max-w-md mx-auto flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-turf-lime/20 to-turf-emerald/5 rounded-full blur-3xl -z-10"></div>
            <PhoneMockup />
          </div>
        </div>

        {/* What's inside */}
        <div className="mt-24 bg-white rounded-[2.5rem] p-8 md:p-12 border border-turf-emerald/5">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-turf-emerald mb-4">
              What's inside the app
            </h2>
            <p className="text-turf-charcoal/70">
              Everything you need to play more, organize less.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-5 max-w-3xl mx-auto">
            {features.map((feature, i) =>
            <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-turf-lime/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check
                  className="w-4 h-4 text-turf-emerald"
                  strokeWidth={3} />
                
                </div>
                <p className="text-turf-charcoal">{feature}</p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100 grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-turf-cream rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-turf-emerald" />
              </div>
              <p className="font-bold text-turf-emerald">15 MB</p>
              <p className="text-sm text-gray-500">Lightweight</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-turf-cream rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-turf-emerald" />
              </div>
              <p className="font-bold text-turf-emerald">100% Secure</p>
              <p className="text-sm text-gray-500">UPI & Cards</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-turf-cream rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-turf-emerald" />
              </div>
              <p className="font-bold text-turf-emerald">4.8 ★</p>
              <p className="text-sm text-gray-500">10k+ ratings</p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}