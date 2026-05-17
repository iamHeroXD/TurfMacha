"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { User } from "@/types";

const field = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.18 + i * 0.08, duration: 0.28 },
});

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuthStore();
  const [show, setShow] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Show error from URL param (set by OAuth callback on failure, or after password reset)
  const urlError = params.get("error");
  const urlSuccess = params.get("reset");
  const [err, setErr] = useState(urlError ? decodeURIComponent(urlError) : "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setErr("");
    const sb = createClient();

    const { data: auth, error } = await sb.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setErr(error.message);
      return;
    }

    if (!auth.user) {
      setErr("Login failed. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await sb
      .from("users")
      .select("*")
      .eq("id", auth.user.id)
      .single();

    if (profileError || !profile) {
      const meta = auth.user.user_metadata ?? {};
      const { data: created, error: createError } = await sb
        .from("users")
        .upsert(
          {
            id: auth.user.id,
            email: auth.user.email!,
            full_name: (meta.full_name as string) || auth.user.email!.split("@")[0],
            phone: (meta.phone as string) || null,
            role: (meta.role as string) || "user",
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (createError || !created) {
        await sb.auth.signOut();
        setErr("Profile could not be loaded. Please sign up again or contact support.");
        return;
      }

      setUser(created as User);
      const redirect =
        params.get("redirect") ||
        (created.role === "owner" ? "/dashboard/owner" : "/dashboard/user");
      router.push(redirect);
      return;
    }

    setUser(profile as User);
    const redirect =
      params.get("redirect") ||
      (profile.role === "owner" ? "/dashboard/owner" : "/dashboard/user");
    router.push(redirect);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const sb = createClient();
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <Image src="/logoofturfmacha.png" alt="TurfMacha" width={36} height={36} className="rounded-xl" />
            <span className="font-semibold text-white text-sm">TurfMacha</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.28 }}
          className="text-xl font-bold text-white mb-1"
        >
          Sign in
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.28 }}
          className="text-sm text-white/40 mb-8"
        >
          New here?{" "}
          <Link
            href="/signup"
            className="text-brand-400 hover:text-brand-300 transition-colors underline underline-offset-2"
          >
            Create an account
          </Link>
        </motion.p>

        {/* Password reset success message */}
        {urlSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-brand-400 bg-brand-400/[0.07] border border-brand-400/20 rounded-lg px-3 py-2.5 mb-4"
          >
            Password updated! Sign in with your new password.
          </motion.div>
        )}

        {/* Google OAuth */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.28 }}
          className="mb-5"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2.5"
            onClick={handleGoogleLogin}
            loading={googleLoading}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16, duration: 0.28 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-white/25">or</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div {...field(0)} className="space-y-1.5">
            <Label className="text-white/55 text-sm">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </motion.div>

          <motion.div {...field(1)} className="space-y-1.5">
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-white/55 text-sm">Password</Label>
              <Link href="/forgot-password" className="text-xs text-white/35 hover:text-brand-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/30 hover:text-white/65 transition-colors"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.button>
            </div>
          </motion.div>

          {err && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-red-400 bg-red-500/[0.07] border border-red-500/20 rounded-lg px-3 py-2.5"
            >
              {err}
            </motion.p>
          )}

          <motion.div {...field(2)}>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isSubmitting}
            >
              Sign in
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginContent />
    </Suspense>
  );
}
