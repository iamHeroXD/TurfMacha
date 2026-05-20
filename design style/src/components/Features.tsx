import React from 'react';
import { CalendarCheck, Map, Zap, ShieldCheck } from 'lucide-react';
const features = [
{
  icon: <Map className="w-6 h-6 text-turf-emerald" />,
  title: 'Find Turfs Near You',
  description:
  'Discover the best football and cricket turfs in your city with real-time availability and distance tracking.'
},
{
  icon: <Zap className="w-6 h-6 text-turf-emerald" />,
  title: 'Instant Booking',
  description:
  'No more calling owners. Pick your slot, pay securely online, and get instant confirmation.'
},
{
  icon: <CalendarCheck className="w-6 h-6 text-turf-emerald" />,
  title: 'Manage Matches',
  description:
  'Split payments with your squad, send invites, and keep track of all your upcoming games in one place.'
},
{
  icon: <ShieldCheck className="w-6 h-6 text-turf-emerald" />,
  title: 'Verified Grounds',
  description:
  'Every turf on TurfMacha is physically verified for quality, lighting, and amenities.'
}];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-turf-emerald mb-4">
            Everything you need for the perfect game
          </h2>
          <p className="text-lg text-turf-charcoal/70">
            We've built the ultimate platform for sports enthusiasts in Kerala.
            Less time organizing, more time playing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) =>
          <div
            key={index}
            className="bg-turf-cream/50 rounded-3xl p-8 border border-turf-emerald/5 hover:border-turf-lime/50 transition-colors group">
            
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-turf-emerald mb-3">
                {feature.title}
              </h3>
              <p className="text-turf-charcoal/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>);

}