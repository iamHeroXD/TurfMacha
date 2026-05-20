"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

/* Simple social SVG icons (brand icons removed from lucide-react v1.x) */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const CITIES = [
  { label: "Trivandrum (Live)", href: "/turfs" },
  { label: "Kochi (Coming Soon)",    href: null  },
  { label: "Calicut (Coming Soon)",  href: null  },
  { label: "Thrissur (Coming Soon)", href: null  },
];

const COMPANY = [
  { label: "About Us",       href: "/about"      },
  { label: "How it Works",   href: "/how-it-works"},
  { label: "For Owners",     href: "/for-owners" },
  { label: "Contact",        href: "/contact"    },
];

const LEGAL = [
  { label: "Privacy Policy",   href: "/legal" },
  { label: "Terms of Service", href: "/legal" },
];

export function Footer() {
  return (
    <footer className="bg-[#0B3D2E] text-[#FAF7F0] pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#A3E635] rounded-xl flex items-center justify-center transform -rotate-6 shadow-lg">
                <MapPin className="w-6 h-6 text-[#0B3D2E]" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                TurfMacha
              </span>
            </div>
            <p className="text-[#FAF7F0]/65 mb-6 leading-relaxed text-sm">
              Kerala&apos;s #1 turf booking platform. Making sports accessible, one tap at a time.
            </p>
            <div className="flex gap-3">
              {[
                { icon: InstagramIcon, href: "#" },
                { icon: TwitterIcon,   href: "#" },
                { icon: FacebookIcon,  href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href + Icon.name}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#A3E635] hover:text-[#0B3D2E] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Cities</h4>
            <ul className="space-y-3 text-[#FAF7F0]/65 text-sm">
              {CITIES.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <Link href={href} className="hover:text-[#A3E635] transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-[#FAF7F0]/35 cursor-not-allowed">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-[#FAF7F0]/65 text-sm">
              {COMPANY.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#A3E635] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Get the App</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="transition-transform hover:scale-105 active:scale-95 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-[40px] w-auto object-contain"
                />
              </a>
              <a href="#" className="transition-transform hover:scale-105 active:scale-95 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-[56px] -ml-2 w-auto object-contain"
                  style={{ marginTop: "-8px", marginBottom: "-8px" }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#FAF7F0]/40">
          <p>© {new Date().getFullYear()} TurfMacha. All rights reserved.</p>
          <div className="flex gap-6">
            {LEGAL.map(({ label, href }) => (
              <Link key={label} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
