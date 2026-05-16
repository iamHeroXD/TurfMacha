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

  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/signup");
  if (isAuth) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-4 mb-4">
        <div className="glass-card px-2 py-2 flex items-center justify-around">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 bg-emerald-500/20 rounded-xl"
                  />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors relative z-10",
                    isActive ? "text-emerald-400" : "text-white/40"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium relative z-10",
                    isActive ? "text-emerald-400" : "text-white/40"
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
