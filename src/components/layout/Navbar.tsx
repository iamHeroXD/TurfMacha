"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials, cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/turfs",               label: "Browse"   },
  { href: "/turfs?sport=football",label: "Football"  },
  { href: "/turfs?sport=cricket", label: "Cricket"   },
  { href: "/turfs?sport=badminton",label:"Badminton" },
];

const menuItemVariants = {
  hidden: { opacity: 0, x: -8 },
  show:   (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, duration: 0.18 },
  }),
};

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
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
      {/* ── Main nav bar ── */}
      <motion.nav
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 h-14 border-b transition-colors duration-300",
          scrolled
            ? "bg-[#0a0a0a]/97 border-white/[0.07] supports-[backdrop-filter]:backdrop-blur-md"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
            >
              <span className="text-black font-bold text-xs leading-none">T</span>
            </motion.div>
            <span className="font-semibold text-white text-sm tracking-tight">TurfMacha</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="Main">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-3 py-1.5 rounded-md text-sm transition-colors duration-150",
                    active
                      ? "text-white"
                      : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth / right side */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-[10px] bg-emerald-500/15 text-emerald-400">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm text-white/70 max-w-[90px] truncate">
                    {user.full_name.split(" ")[0]}
                  </span>
                  <motion.span
                    animate={{ rotate: menuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:block"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  </motion.span>
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-11 w-52 bg-[#161616] border border-white/[0.09] rounded-xl shadow-2xl shadow-black/60 overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/[0.06]">
                        <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                        <p className="text-xs text-white/40 truncate mt-0.5">{user.email}</p>
                        <span className="mt-2 inline-block text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize font-medium">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        {[
                          { href: user.role === "owner" ? "/dashboard/owner" : "/dashboard/user", icon: LayoutDashboard, label: "Dashboard" },
                          { href: "/dashboard/user/profile", icon: User, label: "Profile" },
                        ].map(({ href, icon: Icon, label }, i) => (
                          <motion.div
                            key={href}
                            custom={i}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="show"
                          >
                            <Link
                              href={href}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
                            </Link>
                          </motion.div>
                        ))}
                        <div className="border-t border-white/[0.06] my-1" />
                        <motion.button
                          custom={2}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="show"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign out
                        </motion.button>
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
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button size="sm">Get started</Button>
                  </motion.div>
                </Link>
              </>
            )}

            {/* Mobile burger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
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
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
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
              className="md:hidden overflow-hidden bg-[#0d0d0d] border-t border-white/[0.07]"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.div
                    key={l.href}
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="show"
                  >
                    <Link
                      href={l.href}
                      className={cn(
                        "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive(l.href)
                          ? "text-white bg-white/[0.07]"
                          : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}

                {!user ? (
                  <motion.div
                    custom={NAV_LINKS.length}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="show"
                    className="flex gap-2 pt-3 border-t border-white/[0.06] mt-2"
                  >
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full">Sign in</Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    custom={NAV_LINKS.length}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="show"
                    className="pt-2 border-t border-white/[0.06] mt-2 space-y-1"
                  >
                    <Link
                      href={user.role === "owner" ? "/dashboard/owner" : "/dashboard/user"}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:bg-red-500/[0.06] transition-colors"
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
