import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
export function Contact() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-turf-emerald mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have a question or need help? We're here for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-turf-cream rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-turf-emerald" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                <p className="text-gray-600">support@turfmacha.com</p>
                <p className="text-gray-600">partners@turfmacha.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-turf-cream rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-turf-emerald" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Call Us</h3>
                <p className="text-gray-600">+91 98765 43210</p>
                <p className="text-sm text-gray-500 mt-1">
                  Mon-Sat, 9am to 6pm
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-turf-cream rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-turf-emerald" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Office</h3>
                <p className="text-gray-600">
                  Technopark Phase 3 Campus,
                  <br />
                  Trivandrum, Kerala 695581
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime"
                    placeholder="John Doe" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime"
                    placeholder="john@example.com" />
                  
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime"
                  placeholder="How can we help?" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-turf-lime resize-none"
                  placeholder="Type your message here...">
                </textarea>
              </div>
              <button
                type="button"
                className="w-full bg-turf-emerald text-white font-bold text-lg py-4 rounded-xl hover:bg-turf-emerald/90 transition-colors flex items-center justify-center gap-2">
                
                <MessageSquare className="w-5 h-5" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>);

}