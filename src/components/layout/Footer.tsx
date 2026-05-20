"use client";

import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

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
    <footer className="bg-[#0D4D36] text-[#F4F1EB] pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <BrandMark size={40} />
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                TurfMacha
              </span>
            </div>
            <p className="text-[#F4F1EB]/65 mb-6 leading-relaxed text-sm">
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
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#A6D96A] hover:text-[#0D4D36] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Cities</h4>
            <ul className="space-y-3 text-[#F4F1EB]/65 text-sm">
              {CITIES.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <Link href={href} className="hover:text-[#A6D96A] transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-[#F4F1EB]/35 cursor-not-allowed">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-[#F4F1EB]/65 text-sm">
              {COMPANY.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#A6D96A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-[#F4F1EB]/65 text-sm">
              {LEGAL.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#A6D96A] transition-colors">{label}</Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="hover:text-[#A6D96A] transition-colors">Help Center</Link>
              </li>
            </ul>
            <div className="mt-8 p-4 rounded-2xl bg-white/8 border border-white/10">
              <p className="text-white/80 text-xs font-semibold mb-1">Questions?</p>
              <a href="mailto:hello@turfmacha.com" className="text-[#A6D96A] text-sm font-medium hover:underline">
                hello@turfmacha.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#F4F1EB]/40">
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