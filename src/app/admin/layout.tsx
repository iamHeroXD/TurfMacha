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

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <Loader2 className="h-6 w-6 text-[#0B3D2E]/40 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <div className="text-center">
          <ShieldAlert className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-[#6B7280] text-sm font-medium">Admin access required</p>
          <p className="text-[#9CA3AF] text-xs mt-1">Log in with an admin account to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 bg-[#FAF7F0]">
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
            <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-3 py-2">Admin Panel</p>
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors",
                    active
                      ? "bg-[#0B3D2E] text-white font-semibold"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-20 inset-x-0 z-40 px-4">
          <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-1 flex gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] transition-colors",
                    active ? "bg-[#0B3D2E] text-white" : "text-[#9CA3AF]"
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
