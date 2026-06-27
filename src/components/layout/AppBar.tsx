"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, LayoutDashboard, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/layout/NotificationCenter";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";

// Routes that own their full-screen layout (auth screens) — no app bar there.
const BARE_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

// Top-level destinations show the brand; deeper screens show a back button.
const ROOT_TABS = ["/dashboard/user", "/dashboard/owner", "/turfs"];

export function AppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  if (BARE_ROUTES.some((r) => pathname.startsWith(r)) || pathname.startsWith("/admin")) {
    return null;
  }

  const isRoot =
    pathname === "/" || ROOT_TABS.some((r) => pathname === r);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    logout();
    router.replace("/login");
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-[#F4F1EB]/92 supports-[backdrop-filter]:backdrop-blur-md border-b border-[#0D4D36]/8"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="h-14 max-w-2xl mx-auto px-3 flex items-center justify-between">
        {/* Left: brand on root screens, back button on deeper screens */}
        {isRoot ? (
          <Link href="/dashboard/user" className="flex items-center gap-2" aria-label="Home">
            <BrandMark size={30} />
            <span className="font-display font-bold text-lg text-[#0D4D36] tracking-tight">
              TurfMacha
            </span>
          </Link>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-1 -ml-1 pr-2 py-2 text-[#0D4D36]"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-semibold">Back</span>
          </motion.button>
        )}

        {/* Right: notifications + profile menu */}
        <div className="flex items-center gap-1">
          {user && <NotificationCenter />}

          {user && (
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center p-1 rounded-full hover:bg-[#0D4D36]/8 transition-colors"
                aria-label="Account menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="text-[11px] bg-[#0D4D36]/10 text-[#0D4D36] font-bold">
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-11 z-50 w-56 bg-white border border-[#E7E2DA] rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="p-3.5 border-b border-[#E7E2DA]">
                        <p className="text-sm font-semibold text-[#111111] truncate">{user.full_name}</p>
                        <p className="text-xs text-[#5F5F5F] truncate mt-0.5">{user.email}</p>
                        <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#0D4D36]/8 text-[#0D4D36] border border-[#0D4D36]/15 capitalize font-bold">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        {[
                          {
                            href: user.role === "owner" ? "/dashboard/owner" : "/dashboard/user",
                            icon: LayoutDashboard,
                            label: "Dashboard",
                          },
                          { href: "/dashboard/user/profile", icon: User, label: "Profile" },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#5F5F5F] hover:text-[#111111] hover:bg-[#F4F1EB] transition-colors"
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
                          </Link>
                        ))}
                        <div className="border-t border-[#E7E2DA] my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
