"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Calendar, ShieldAlert, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",          label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users",    label: "Users",    icon: Users           },
  { href: "/admin/turfs",    label: "Turfs",    icon: Building2       },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar        },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore();
  const pathname = usePathname();

  // Show spinner while auth state is being resolved — prevents "access required" flash
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-6 w-6 text-white/30 animate-spin" />
      </div>
    );
  }

  // Auth confirmed but not admin — show access denied
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <ShieldAlert className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Admin access required</p>
          <p className="text-white/25 text-xs mt-1">Log in with an admin account to continue</p>
        </div>
      </div>
    );
  }

  // Confirmed admin — render panel
  return (
    <div className="min-h-screen pt-14 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">Admin Panel</p>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-brand-400/10 text-brand-400 border border-brand-400/20"
                    : "text-white/45 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-20 inset-x-0 z-40 px-4">
          <div className="bg-[#161616] border border-white/[0.09] rounded-xl p-1 flex gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] transition-colors",
                    active ? "bg-brand-400/10 text-brand-400" : "text-white/40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-32 md:pb-0">{children}</main>
      </div>
    </div>
  );
}
