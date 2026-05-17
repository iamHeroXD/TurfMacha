"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials, cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/turfs", label: "Browse" },
  { href: "/turfs?sport=football", label: "Football" },
  { href: "/turfs?sport=cricket", label: "Cricket" },
  { href: "/turfs?sport=badminton", label: "Badminton" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    logout();
    router.push("/");
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));

  return (
    <>
      <nav className={cn(
        "fixed top-0 inset-x-0 z-50 h-14 transition-colors duration-200",
        scrolled ? "bg-[#0a0a0a] border-b border-white/[0.07]" : "bg-transparent"
      )}>
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <span className="text-black font-bold text-xs">T</span>
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">
              TurfBook
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors duration-150",
                  isActive(l.href)
                    ? "text-white bg-white/[0.06]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-[10px] bg-emerald-500/20 text-emerald-400">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm text-white/70 max-w-[100px] truncate">
                    {user.full_name.split(" ")[0]}
                  </span>
                  <ChevronDown className={cn("hidden md:block h-3.5 w-3.5 text-white/40 transition-transform", menuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-10 w-52 bg-[#161616] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/[0.06]">
                        <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                        <p className="text-xs text-white/40 truncate mt-0.5">{user.email}</p>
                        <span className="mt-2 inline-block text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/user"}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                        </Link>
                        <Link
                          href="/dashboard/user/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <User className="h-3.5 w-3.5" /> Profile
                        </Link>
                        <div className="border-t border-white/[0.06] my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden md:flex">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-[#0a0a0a] border-t border-white/[0.07]"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "block px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isActive(l.href)
                        ? "text-white bg-white/[0.07]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex gap-2 pt-3 border-t border-white/[0.06] mt-2">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full">Sign in</Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
