"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/BrandMark";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormInput = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    setErr("");
    try {
      const sb = createClient();
      const { error } = await sb.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setErr(error.message);
        return;
      }
      setSent(true);
    } catch {
      setErr("Failed to send reset link. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F4F1EB]">
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <BrandMark size={36} />
            <span className="font-display font-bold text-[#0D4D36] text-lg">TurfMacha</span>
          </Link>
        </motion.div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#0D4D36]/8 border-2 border-[#0D4D36]/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-[#0D4D36]" />
            </div>
            <h1 className="text-xl font-display font-bold text-[#111111] mb-2">Check your inbox</h1>
            <p className="text-sm text-[#5F5F5F] mb-6 leading-relaxed">
              We sent a password reset link to your email. Click it to set a new password.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">Back to sign in</Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.28 }}
              className="text-2xl font-display font-bold text-[#111111] mb-1"
            >
              Reset password
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.28 }}
              className="text-sm text-[#5F5F5F] mb-8"
            >
              Enter your email and we&apos;ll send you a reset link.
            </motion.p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[#111111] text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              {err && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{err}</p>
              )}

              <Button type="submit" className="w-full bg-[#0D4D36] hover:bg-[#0D4D36]/90" size="lg" loading={isSubmitting}>
                Send reset link
              </Button>
            </form>

            <p className="text-center text-sm text-[#5F5F5F] mt-6">
              Remember it?{" "}
              <Link href="/login" className="text-[#0D4D36] font-semibold hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}