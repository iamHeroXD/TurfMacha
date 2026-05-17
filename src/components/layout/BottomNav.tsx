"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) return null;

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/turfs", icon: Search, label: "Explore" },
    { href: "/dashboard/user/favorites", icon: Heart, label: "Saved" },
    { href: user?.role === "owner" ? "/dashboard/owner" : "/dashboard/user", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/user/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 safe-bottom">
      <div className="bg-[#0e0e0e] border-t border-white/[0.07]">
        <div className="flex items-center justify-around px-2 h-14">
          {links.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-0 transition-colors",
                  active ? "text-emerald-400" : "text-white/35 hover:text-white/60"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
