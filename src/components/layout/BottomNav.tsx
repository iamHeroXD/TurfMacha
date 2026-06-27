"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Coins, User, Calendar, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

// Auth screens own the full viewport — no tab bar there.
const HIDE_ON = ["/login", "/signup", "/forgot-password", "/reset-password", "/admin"];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (HIDE_ON.some((r) => pathname.startsWith(r))) return null;

  // Role-aware app navigation. "Home" is the dashboard (the app's true home),
  // since the marketing landing page no longer exists.
  const links =
    user?.role === "owner"
      ? [
          { href: "/dashboard/owner",          icon: Home,             label: "Home"     },
          { href: "/dashboard/owner/turfs",    icon: LayoutDashboard,  label: "My Turfs" },
          { href: "/dashboard/owner/bookings", icon: Calendar,         label: "Bookings" },
          { href: "/dashboard/user/profile",   icon: User,             label: "Profile"  },
        ]
      : [
          { href: "/dashboard/user",           icon: Home,     label: "Home"     },
          { href: "/turfs",                    icon: Search,   label: "Explore"  },
          { href: "/dashboard/user/bookings",  icon: Calendar, label: "Bookings" },
          { href: "/dashboard/user/wallet",    icon: Coins,    label: "Wallet"   },
          { href: "/dashboard/user/profile",   icon: User,     label: "Profile"  },
        ];

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="fixed bottom-0 inset-x-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="bg-[#F4F1EB]/97 border-t border-[#0D4D36]/10 supports-[backdrop-filter]:backdrop-blur-md">
        <div className="flex items-center justify-around px-2 h-14 max-w-md mx-auto">
          {links.map(({ href, icon: Icon, label }) => {
            const base = href.split("?")[0];
            // Dashboard "Home" tabs are exact-match so they don't stay lit on
            // nested screens (e.g. /dashboard/user/bookings).
            const exact = base === "/dashboard/user" || base === "/dashboard/owner";
            const active = exact ? pathname === base : pathname.startsWith(base);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl min-w-0 group"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-tab"
                    className="absolute inset-0 rounded-2xl bg-[#0D4D36]/8"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <motion.span whileTap={{ scale: 0.82 }} transition={{ duration: 0.12 }} className="relative z-10">
                  <Icon
                    className={cn(
                      "h-[19px] w-[19px] transition-colors duration-150",
                      active ? "text-[#0D4D36]" : "text-[#111111]/35 group-hover:text-[#111111]/55"
                    )}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                </motion.span>
                <span className={cn(
                  "text-[9.5px] font-bold relative z-10 transition-colors duration-150",
                  active ? "text-[#0D4D36]" : "text-[#111111]/35"
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
