"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Coins, User, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/admin")
  ) return null;

  const links = [
    { href: "/",           icon: Home,           label: "Home"      },
    { href: "/turfs",      icon: Search,         label: "Explore"   },
    ...(user?.role === "user"
      ? [{ href: "/dashboard/user/wallet", icon: Coins, label: "Wallet" }]
      : []),
    {
      href: user?.role === "owner" ? "/dashboard/owner" : "/dashboard/user",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    { href: "/dashboard/user/profile", icon: User, label: "Profile" },
  ];

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="md:hidden fixed bottom-0 inset-x-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="bg-[#F4F1EB]/97 border-t border-[#E7E2DA] supports-[backdrop-filter]:backdrop-blur-md">
        <div className="flex items-center justify-around px-2 h-14 max-w-sm mx-auto">
          {links.map(({ href, icon: Icon, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);
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
                <motion.span
                  whileTap={{ scale: 0.82 }}
                  transition={{ duration: 0.12 }}
                  className="relative z-10"
                >
                  <Icon
                    className={cn(
                      "h-[19px] w-[19px] transition-colors duration-150",
                      active
                        ? "text-[#0D4D36]"
                        : "text-[#9E9284] group-hover:text-[#5F5F5F]"
                    )}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                </motion.span>
                <span
                  className={cn(
                    "text-[9.5px] font-semibold relative z-10 transition-colors duration-150",
                    active ? "text-[#0D4D36]" : "text-[#9E9284]"
                  )}
                >
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
