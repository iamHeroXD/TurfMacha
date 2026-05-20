"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, LayoutDashboard, ChevronDown, MapPin, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/layout/NotificationCenter";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials, cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/turfs",        label: "Browse Turfs" },
  { href: "/how-it-works", label: "How it works"  },
  { href: "/for-owners",   label: "For Owners"   },
  { href: "/about",        label: "About"         },
];

const menuItemVariants = {
  hidden: { opacity: 0, x: -8 },
  show:   (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, duration: 0.18 },
  }),
};

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
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
      <motion.nav
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled || mobileOpen
            ? "bg-[#FAF7F0]/92 backdrop-blur-md shadow-sm py-3 border-b border-[#0B3D2E]/8"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <motion.div
                whileHover={{ rotate: -12, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-10 h-10 bg-[#0B3D2E] rounded-xl flex items-center justify-center transform -rotate-6 shadow-md"
              >
                <MapPin className="w-5 h-5 text-[#A3E635]" />
              </motion.div>
              <span className="font-display font-bold text-xl text-[#0B3D2E] tracking-tight">
                TurfMacha
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Main">
              {NAV_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative font-medium text-sm transition-colors pb-0.5",
                      active
                        ? "text-[#0B3D2E]"
                        : "text-[#1F2937]/70 hover:text-[#0B3D2E]"
                    )}
                  >
                    {l.label}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A3E635]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2 shrink-0">
              {user && <NotificationCenter />}

              {user ? (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#0B3D2E]/8 transition-colors"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="text-[10px] bg-[#0B3D2E]/10 text-[#0B3D2E] font-bold">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm text-[#1F2937]/70 max-w-[80px] truncate font-medium">
                      {user.full_name.split(" ")[0]}
                    </span>
                    <motion.span
                      animate={{ rotate: menuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="hidden md:block"
                    >
                      <ChevronDown className="h-3.5 w-3.5 text-[#1F2937]/50" />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
                      >
                        <div className="p-3.5 border-b border-gray-100">
                          <p className="text-sm font-semibold text-[#1F2937] truncate">{user.full_name}</p>
                          <p className="text-xs text-[#6B7280] truncate mt-0.5">{user.email}</p>
                          <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#0B3D2E]/8 text-[#0B3D2E] border border-[#0B3D2E]/15 capitalize font-bold">
                            {user.role}
                          </span>
                        </div>
                        <div className="p-1.5 space-y-0.5">
                          {[
                            { href: user.role === "owner" ? "/dashboard/owner" : "/dashboard/user", icon: LayoutDashboard, label: "Dashboard" },
                            { href: "/dashboard/user/profile", icon: User, label: "Profile" },
                          ].map(({ href, icon: Icon, label }, i) => (
                            <motion.div key={href} custom={i} variants={menuItemVariants} initial="hidden" animate="show">
                              <Link
                                href={href}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FAF7F0] transition-colors"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
                              </Link>
                            </motion.div>
                          ))}
                          <div className="border-t border-gray-100 my-1" />
                          <motion.button
                            custom={2} variants={menuItemVariants} initial="hidden" animate="show"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-3.5 w-3.5" /> Sign out
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3 pl-3 border-l border-[#0B3D2E]/10">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 font-medium text-sm text-[#1F2937]/70 hover:text-[#0B3D2E] transition-colors"
                  >
                    <LogIn className="w-4 h-4" /> Sign in
                  </Link>
                  <Link href="/download">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        size="sm"
                        className="rounded-full bg-[#0B3D2E] text-white px-5 py-2.5 shadow-lg shadow-[#0B3D2E]/20 hover:bg-[#0B3D2E]/90"
                      >
                        Download App
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Mobile burger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-[#0B3D2E]"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? "x" : "menu"}
                    initial={{ rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 30, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
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
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden bg-[#FAF7F0] border-t border-[#0B3D2E]/10 shadow-lg"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.div key={l.href} custom={i} variants={menuItemVariants} initial="hidden" animate="show">
                    <Link
                      href={l.href}
                      className={cn(
                        "block px-3 py-3 rounded-xl font-medium text-sm transition-colors",
                        isActive(l.href)
                          ? "bg-[#0B3D2E]/8 text-[#0B3D2E]"
                          : "text-[#1F2937]/70 hover:text-[#0B3D2E]"
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}

                {!user ? (
                  <motion.div
                    custom={NAV_LINKS.length} variants={menuItemVariants} initial="hidden" animate="show"
                    className="flex gap-2 pt-3 border-t border-[#0B3D2E]/10 mt-2"
                  >
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl">Sign in</Button>
                    </Link>
                    <Link href="/download" className="flex-1">
                      <Button className="w-full rounded-xl bg-[#0B3D2E]">Download App</Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    custom={NAV_LINKS.length} variants={menuItemVariants} initial="hidden" animate="show"
                    className="pt-2 border-t border-[#0B3D2E]/10 mt-2 space-y-1"
                  >
                    <Link
                      href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/user"}
                      className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm text-[#1F2937]/70 hover:text-[#0B3D2E] hover:bg-[#0B3D2E]/8 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
