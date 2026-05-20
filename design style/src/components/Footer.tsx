import React from 'react';
import { MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="bg-turf-emerald text-turf-cream pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-turf-lime rounded-xl flex items-center justify-center transform -rotate-6">
                <MapPin className="w-6 h-6 text-turf-emerald" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                TurfMacha
              </span>
            </div>
            <p className="text-turf-cream/70 mb-6">
              Kerala's #1 turf booking platform. Making sports accessible, one
              tap at a time.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-turf-lime hover:text-turf-emerald transition-colors">
                
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-turf-lime hover:text-turf-emerald transition-colors">
                
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-turf-lime hover:text-turf-emerald transition-colors">
                
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Cities</h4>
            <ul className="space-y-3 text-turf-cream/70">
              <li>
                <Link
                  to="/turfs"
                  className="hover:text-turf-lime transition-colors">
                  
                  Trivandrum (Live)
                </Link>
              </li>
              <li>
                <span className="text-turf-cream/40 cursor-not-allowed">
                  Kochi (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-turf-cream/40 cursor-not-allowed">
                  Calicut (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-turf-cream/40 cursor-not-allowed">
                  Thrissur (Coming Soon)
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-turf-cream/70">
              <li>
                <Link
                  to="/about"
                  className="hover:text-turf-lime transition-colors">
                  
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/for-owners"
                  className="hover:text-turf-lime transition-colors">
                  
                  Partner with us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-turf-lime transition-colors">
                  
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-turf-lime transition-colors">
                  
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Get the App</h4>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="transition-transform hover:scale-105 active:scale-95 inline-block">
                
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-[40px] w-auto object-contain" />
                
              </a>
              <a
                href="#"
                className="transition-transform hover:scale-105 active:scale-95 inline-block">
                
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-[56px] -ml-2 w-auto object-contain"
                  style={{
                    marginTop: '-8px',
                    marginBottom: '-8px'
                  }} />
                
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-turf-cream/50">
          <p>© {new Date().getFullYear()} TurfMacha. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/legal" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/legal" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>);

}