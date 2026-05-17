"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/signup");
  if (isAuth) return null;

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/turfs", icon: Search, label: "Explore" },
    { href: "/dashboard/user/favorites", icon: Heart, label: "Saved" },
    {
      href: user?.role === "owner" ? "/dashboard/owner" : "/dashboard/user",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    { href: "/dashboard/user/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-3 mb-3">
        <div className="bg-[#0d0d25]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-2 flex items-center justify-around shadow-2xl shadow-black/60">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("?")[0]);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-0"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-tab-bg"
                    className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200 relative z-10",
                    isActive ? "text-emerald-400" : "text-white/35"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200 relative z-10",
                    isActive ? "text-emerald-400" : "text-white/35"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
