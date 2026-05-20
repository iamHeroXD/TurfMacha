"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailWarning, X, RefreshCw, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

export function EmailVerificationBanner() {
  const { user, emailVerified } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    if (!user?.email || sending) return;
    setSending(true);
    try {
      const sb = createClient();
      await sb.auth.resend({ type: "signup", email: user.email });
      setSent(true);
    } catch {
      // fail silently — user sees no diff
    } finally {
      setSending(false);
    }
  };

  if (!user || emailVerified || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="bg-amber-50 border-b border-amber-200"
        role="alert"
      >
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <MailWarning className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 flex-1 font-medium">
            Please verify your email address to unlock bookings.
            {!sent && (
              <>
                {" "}Didn&apos;t get it?{" "}
                <button
                  onClick={handleResend}
                  disabled={sending}
                  className="underline font-semibold hover:text-amber-900 disabled:opacity-60 transition-colors inline-flex items-center gap-1"
                >
                  {sending ? (
                    <><RefreshCw className="h-3 w-3 animate-spin" /> Sending…</>
                  ) : (
                    "Resend email"
                  )}
                </button>
              </>
            )}
            {sent && (
              <span className="inline-flex items-center gap-1 text-green-700 ml-1">
                <CheckCircle2 className="h-3 w-3" /> Sent! Check your inbox.
              </span>
            )}
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-500 hover:text-amber-700 transition-colors rounded-md shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
