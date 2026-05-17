"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { TurfCoins, CoinTransaction } from "@/types";

const TYPE_CONFIG: Record<string, { label: string; icon: typeof ArrowUpRight; color: string }> = {
  earn:         { label: "Earned",       icon: ArrowUpRight,  color: "text-brand-400"  },
  redeem:       { label: "Redeemed",     icon: ArrowDownLeft, color: "text-red-400"    },
  admin_adjust: { label: "Adjustment",   icon: ShieldCheck,   color: "text-blue-400"   },
  expire:       { label: "Expired",      icon: ArrowDownLeft, color: "text-white/30"   },
};

export default function WalletPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [wallet, setWallet] = useState<TurfCoins | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }

    (async () => {
      const sb = createClient();
      const [walletRes, txRes] = await Promise.all([
        sb.from("turf_coins").select("*").eq("user_id", user.id).single(),
        sb.from("coin_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      ]);
      setWallet(walletRes.data as TurfCoins | null);
      setTransactions((txRes.data as CoinTransaction[]) ?? []);
      setLoading(false);
    })();
  }, [user, router]);

  if (!user) return null;

  const balance = wallet?.balance ?? 0;
  const earned = wallet?.total_earned ?? 0;
  const redeemed = wallet?.total_redeemed ?? 0;

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/[0.07]"
      >
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center shrink-0">
            <Coins className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white text-lg">TurfCoins Wallet</h1>
            <p className="text-xs text-white/40 mt-0.5">Earn coins on every booking</p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-brand-400/20 bg-brand-400/5 p-6 text-center"
        >
          {loading ? <Skeleton className="h-12 w-32 mx-auto mb-2" /> : (
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
              className="text-5xl font-bold text-brand-400 tabular-nums"
            >
              {balance.toLocaleString()}
            </motion.p>
          )}
          <p className="text-sm text-white/50 mt-1">TurfCoins balance</p>

          <div className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-brand-400/10">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{earned.toLocaleString()}</p>
              <p className="text-xs text-white/40 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Total earned</p>
            </div>
            <div className="w-px h-8 bg-white/[0.07]" />
            <div className="text-center">
              <p className="text-lg font-bold text-white">{redeemed.toLocaleString()}</p>
              <p className="text-xs text-white/40">Redeemed</p>
            </div>
          </div>
        </motion.div>

        {/* How to earn */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]"
        >
          <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-3">How it works</p>
          <div className="space-y-2 text-sm text-white/60">
            <p>🏟️ Book a turf with TurfCoins enabled → earn coins automatically</p>
            <p>🪙 Accumulate coins and redeem for discounts on future bookings</p>
            <p>⭐ Featured turfs offer bonus coins — check each turf&apos;s rewards</p>
          </div>
        </motion.div>

        {/* Transaction history */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-3">Transaction History</p>

          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-white/[0.07]">
              <Coins className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/40">No transactions yet</p>
              <p className="text-xs text-white/25 mt-1">Book a turf with rewards enabled to start earning</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, i) => {
                const cfg = TYPE_CONFIG[tx.type] ?? TYPE_CONFIG.earn;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111]"
                  >
                    <div className={`w-8 h-8 rounded-lg ${tx.amount > 0 ? "bg-brand-400/10" : "bg-red-500/10"} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{tx.description || cfg.label}</p>
                      <p className="text-xs text-white/35">{format(new Date(tx.created_at), "d MMM yyyy, h:mm a")}</p>
                    </div>
                    <p className={`text-sm font-bold tabular-nums ${tx.amount > 0 ? "text-brand-400" : "text-red-400"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
