import React from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  ShieldCheck,
  ArrowRight } from
'lucide-react';
export function ForOwners() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-turf-lime/20 text-turf-emerald font-medium text-sm mb-6">
              Partner with TurfMacha
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-turf-emerald mb-6 leading-tight">
              Grow your turf business on autopilot.
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join Trivandrum's largest sports community. Manage bookings,
              increase utilization, and boost your revenue with our
              comprehensive turf management software.
            </p>
            <button className="bg-turf-emerald text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-turf-lime hover:text-turf-emerald transition-colors flex items-center gap-2 group">
              Become a Partner{' '}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-turf-emerald/20 to-turf-lime/20 rounded-3xl transform rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?auto=format&fit=crop&q=80&w=1200"
              alt="Turf Owner"
              className="rounded-3xl shadow-2xl relative z-10 object-cover h-[500px] w-full" />
            
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-display font-bold text-center mb-16">
            Why partner with us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            {
              icon: <TrendingUp className="w-6 h-6 text-turf-emerald" />,
              title: 'Increase Revenue',
              desc: 'Fill empty slots during off-peak hours by reaching thousands of active players in Trivandrum.'
            },
            {
              icon: <Calendar className="w-6 h-6 text-turf-emerald" />,
              title: 'Smart Scheduling',
              desc: 'Say goodbye to double bookings and messy WhatsApp chats. Manage everything in one dashboard.'
            },
            {
              icon: <Users className="w-6 h-6 text-turf-emerald" />,
              title: 'Customer Insights',
              desc: 'Understand your peak times, most loyal customers, and revenue trends with detailed analytics.'
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-turf-emerald" />,
              title: 'Secure Payments',
              desc: 'Get paid instantly and securely. Reduce no-shows with our upfront payment system.'
            }].
            map((benefit, i) =>
            <div
              key={i}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              
                <div className="w-12 h-12 bg-turf-cream rounded-xl flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-turf-cream rounded-[3rem] p-8 md:p-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to list your turf?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Fill out the form below and our team will get back to you within
              24 hours.
            </p>

            <form className="space-y-4 text-left bg-white p-8 rounded-3xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime"
                    placeholder="John Doe" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime"
                    placeholder="+91 98765 43210" />
                  
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turf Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime"
                  placeholder="e.g. Green Arena Sports Hub" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location in Trivandrum
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime"
                  placeholder="e.g. Kazhakootam" />
                
              </div>
              <button
                type="button"
                className="w-full bg-turf-emerald text-white font-bold text-lg py-4 rounded-xl hover:bg-turf-emerald/90 transition-colors mt-4">
                
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>);

}