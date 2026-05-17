"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormInput = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    const sb = createClient();
    await sb.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <Image src="/logoofturfmacha.png" alt="TurfMacha" width={36} height={36} className="rounded-xl" />
            <span className="font-semibold text-white text-sm">TurfMacha</span>
          </Link>
        </motion.div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-14 h-14 rounded-full bg-brand-400/10 border border-brand-400/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-brand-400 text-2xl">✓</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Check your inbox</h1>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
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
              className="text-xl font-bold text-white mb-1"
            >
              Reset password
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.28 }}
              className="text-sm text-white/40 mb-8"
            >
              Enter your email and we&apos;ll send you a reset link.
            </motion.p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-white/55 text-sm">Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                Send reset link
              </Button>
            </form>

            <p className="text-center text-sm text-white/35 mt-6">
              Remember it?{" "}
              <Link href="/login" className="text-brand-400 hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
