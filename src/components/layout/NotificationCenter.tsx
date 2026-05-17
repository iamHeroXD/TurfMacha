"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Calendar,
  Coins,
  CreditCard,
  Megaphone,
  X,
  Check,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useNotifications, AppNotification } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<
  AppNotification["type"],
  React.ComponentType<{ className?: string }>
> = {
  booking: Calendar,
  payment: CreditCard,
  coins: Coins,
  cancellation: X,
  refund: CreditCard,
  reminder: Bell,
  admin: Megaphone,
};

const TYPE_COLOR: Record<AppNotification["type"], string> = {
  booking: "text-brand-400 bg-brand-400/10",
  payment: "text-blue-400 bg-blue-500/10",
  coins: "text-amber-400 bg-amber-500/10",
  cancellation: "text-red-400 bg-red-500/10",
  refund: "text-orange-400 bg-orange-500/10",
  reminder: "text-purple-400 bg-purple-500/10",
  admin: "text-white/60 bg-white/[0.06]",
};

export function NotificationCenter() {
  const { user } = useAuthStore();
  const { notifications, unreadCount, loading, markRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      {/* Bell trigger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-full bg-brand-400 text-black text-[9px] font-bold px-0.5"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-80 bg-[#161616] border border-white/[0.09] rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">Notifications</p>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-400/15 text-brand-400 text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] text-white/40 hover:text-brand-400 transition-colors"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="py-8 text-center text-white/30 text-sm">
                  Loading…
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="h-8 w-8 text-white/15 mx-auto mb-2" />
                  <p className="text-sm text-white/35">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = TYPE_ICON[n.type] ?? Bell;
                  const colorClass = TYPE_COLOR[n.type] ?? "text-white/60 bg-white/[0.06]";
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/[0.04] last:border-0",
                        !n.read && "bg-brand-400/[0.03]"
                      )}
                      onClick={() => {
                        if (!n.read) markRead(n.id);
                      }}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                          colorClass
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={cn(
                              "text-xs font-medium",
                              n.read ? "text-white/60" : "text-white"
                            )}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-white/25 mt-1">
                          {format(new Date(n.created_at), "d MMM · h:mm a")}
                        </p>
                      </div>
                      {n.read && (
                        <Check className="h-3 w-3 text-white/20 shrink-0 mt-1" />
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
