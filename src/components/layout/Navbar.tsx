"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Menu, X, LogOut, User, LayoutDashboard, ChevronDown, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    router.push("/");
    setMenuOpen(false);
  };

  const navLinks = [
    { href: "/turfs", label: "Browse Turfs" },
    { href: "/turfs?sport=football", label: "Football" },
    { href: "/turfs?sport=cricket", label: "Cricket" },
    { href: "/turfs?sport=badminton", label: "Badminton" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/8 shadow-2xl shadow-black/40"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all group-hover:scale-105">
                <Zap className="h-4 w-4 text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Turf<span className="gradient-text">Book</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "text-white bg-white/8"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-white/8 transition-colors group"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="text-[11px] bg-emerald-500/20 text-emerald-400">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm text-white/80 font-medium">
                      {user.full_name.split(" ")[0]}
                    </span>
                    <ChevronDown className={cn(
                      "hidden md:block h-3.5 w-3.5 text-white/40 transition-transform duration-200",
                      menuOpen && "rotate-180"
                    )} />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-11 w-56 rounded-2xl border border-white/10 bg-[#0d0d25]/98 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/8">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback className="text-sm bg-emerald-500/20 text-emerald-400">
                                {getInitials(user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                              <p className="text-xs text-white/40 truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium capitalize">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {user.role}
                            </span>
                          </div>
                        </div>
                        <div className="p-1.5">
                          <Link
                            href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/user"}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all group"
                          >
                            <LayoutDashboard className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/user/profile"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all group"
                          >
                            <User className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                            My Profile
                          </Link>
                          <div className="border-t border-white/8 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400/80 hover:text-red-300 hover:bg-red-500/8 transition-all"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="hidden md:flex text-white/70">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="shadow-lg shadow-emerald-500/20">
                      Get started
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/8 bg-[#0a0a1a]/98 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive(link.href)
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/8"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex gap-2 pt-2 border-t border-white/8 mt-3">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full">Sign in</Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </div>
                )}
                {user && (
                  <div className="pt-2 border-t border-white/8 mt-3 space-y-1">
                    <Link
                      href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/user"}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/80 hover:bg-red-500/8 transition-all"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Dropdown backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
