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

const TYPE_CONFIG: Record<string, { label: string; icon: typeof ArrowUpRight; color: string; bg: string }> = {
  earn:         { label: "Earned",     icon: ArrowUpRight,  color: "text-[#0B3D2E]", bg: "bg-[#0B3D2E]/8"  },
  redeem:       { label: "Redeemed",   icon: ArrowDownLeft, color: "text-red-500",   bg: "bg-red-50"       },
  admin_adjust: { label: "Adjustment", icon: ShieldCheck,   color: "text-blue-500",  bg: "bg-blue-50"      },
  expire:       { label: "Expired",    icon: ArrowDownLeft, color: "text-[#9CA3AF]", bg: "bg-gray-50"      },
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
    <div className="min-h-screen bg-[#FAF7F0] pt-24 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0B3D2E] flex items-center justify-center shrink-0">
            <Coins className="h-6 w-6 text-[#A3E635]" />
          </div>
          <div>
            <h1 className="font-display font-bold text-[#1F2937] text-lg">TurfCoins Wallet</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">Earn coins on every booking</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-[#0B3D2E] p-6 text-center shadow-lg shadow-[#0B3D2E]/20"
        >
          {loading ? <Skeleton className="h-12 w-32 mx-auto mb-2 opacity-20" /> : (
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
              className="text-5xl font-bold text-[#A3E635] tabular-nums"
            >
              {balance.toLocaleString()}
            </motion.p>
          )}
          <p className="text-sm text-white/65 mt-1">TurfCoins balance</p>

          <div className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-white/10">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{earned.toLocaleString()}</p>
              <p className="text-xs text-white/50 flex items-center gap-1 justify-center">
                <TrendingUp className="h-3 w-3" /> Total earned
              </p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-lg font-bold text-white">{redeemed.toLocaleString()}</p>
              <p className="text-xs text-white/50">Redeemed</p>
            </div>
          </div>
        </motion.div>

        {/* How to earn */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">How it works</p>
          <div className="space-y-2 text-sm text-[#6B7280]">
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
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Transaction History</p>

          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-gray-100 bg-white shadow-sm">
              <Coins className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-[#6B7280]">No transactions yet</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Book a turf with rewards enabled to start earning</p>
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
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1F2937] font-medium">{tx.description || cfg.label}</p>
                      <p className="text-xs text-[#9CA3AF]">{format(new Date(tx.created_at), "d MMM yyyy, h:mm a")}</p>
                    </div>
                    <p className={`text-sm font-bold tabular-nums ${tx.amount > 0 ? "text-[#0B3D2E]" : "text-red-500"}`}>
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
