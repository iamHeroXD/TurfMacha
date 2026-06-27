"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, LogIn } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { signInWithGoogle } from "@/lib/auth/google";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { User } from "@/types";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuthStore();
  const [show, setShow] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const urlError   = params.get("error");
  const urlSuccess = params.get("reset");
  const [err, setErr] = useState(urlError ? decodeURIComponent(urlError) : "");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setErr("");
    const sb = createClient();
    const { data: auth, error } = await sb.auth.signInWithPassword({ email: data.email, password: data.password });
    if (error) { setErr(error.message); return; }
    if (!auth.user) { setErr("Login failed. Please try again."); return; }

    const { data: profile, error: profileError } = await sb.from("users").select("*").eq("id", auth.user.id).single();
    if (profileError || !profile) {
      const meta = auth.user.user_metadata ?? {};
      const { data: created, error: createError } = await sb.from("users").upsert(
        { id: auth.user.id, email: auth.user.email!, full_name: (meta.full_name as string) || auth.user.email!.split("@")[0], phone: (meta.phone as string) || null, role: (meta.role as string) || "user" },
        { onConflict: "id" }
      ).select().single();
      if (createError || !created) { await sb.auth.signOut(); setErr("Profile could not be loaded."); return; }
      setUser(created as User);
      router.push(params.get("redirect") || (created.role === "owner" ? "/dashboard/owner" : "/dashboard/user"));
      return;
    }
    setUser(profile as User);
    router.push(params.get("redirect") || (profile.role === "owner" ? "/dashboard/owner" : "/dashboard/user"));
  };

  const handleGoogleLogin = async () => {
    setErr("");
    setGoogleLoading(true);
    try {
      const { redirected } = await signInWithGoogle();
      // Web redirects away; native returns here with a live session.
      if (!redirected) {
        router.replace(params.get("redirect") || "/dashboard/user");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Google sign-in failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#F4F1EB] pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-12">

        {/* Left panel (desktop) */}
        <div className="hidden lg:block relative h-[600px] rounded-[2.5rem] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1200"
            alt="Football turf"
            fill className="object-cover"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0D4D36]/92 via-[#0D4D36]/70 to-[#0D4D36]/30" />
          <div className="relative z-10 h-full flex flex-col justify-between p-10 text-white">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <BrandMark size={40} />
              <span className="font-display font-bold text-2xl">TurfMacha</span>
            </Link>
            <div>
              <h2 className="font-display font-bold text-4xl mb-4 leading-tight">
                Welcome back,<br />macha 👋
              </h2>
              <p className="text-white/70 text-base mb-8 max-w-sm">
                Your next game is one tap away. Book the best turfs in Trivandrum instantly.
              </p>
              <div className="flex gap-2 items-center text-sm text-white/60">
                <div className="flex -space-x-2">
                  {[11,12,13,14].map((i) => (
                    <Image key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-[#0D4D36]" />
                  ))}
                </div>
                <span>Joined by 10,000+ players in TVM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <BrandMark size={40} />
              <span className="font-display font-bold text-2xl text-[#0D4D36]">TurfMacha</span>
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.28 }}
            className="text-3xl font-display font-bold text-[#0D4D36] mb-2"
          >
            Sign in
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.28 }}
            className="text-sm text-[#111111]/55 mb-8"
          >
            New here?{" "}
            <Link href="/signup" className="text-[#0D4D36] font-semibold hover:underline underline-offset-2">
              Create an account
            </Link>
          </motion.p>

          {urlSuccess && (
            <div className="text-xs text-[#0D4D36] bg-[#0D4D36]/8 border border-[#0D4D36]/20 rounded-xl px-3 py-2.5 mb-4">
              Password updated! Sign in with your new password.
            </div>
          )}

          {/* Google OAuth */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.28 }} className="mb-5">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2.5 rounded-xl border-[#E7E2DA] hover:border-[#0D4D36]/30 hover:bg-[#F4F1EB]"
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

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#E7E2DA]" />
            <span className="text-xs text-[#9E9284] font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#E7E2DA]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-semibold text-[#111111]">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow"
                aria-describedby={errors.email ? "login-email-err" : undefined}
                {...register("email")}
              />
              {errors.email && <p id="login-email-err" role="alert" className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-sm font-semibold text-[#111111]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#0D4D36] font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow"
                  aria-describedby={errors.password ? "login-pw-err" : undefined}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9284] hover:text-[#0D4D36] transition-colors"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p id="login-pw-err" role="alert" className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {err && (
              <div role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                {err}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-[#0D4D36] gap-2 shadow-lg shadow-[#0D4D36]/20"
              size="lg"
              loading={isSubmitting}
            >
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E7E2DA] text-center">
            <Link href="/signup?role=owner" className="inline-flex items-center gap-1.5 text-sm text-[#111111]/55 hover:text-[#0D4D36] transition-colors">
              <LogIn className="w-4 h-4" /> Are you a turf owner? <span className="font-semibold text-[#0D4D36]">Register here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F1EB]" />}>
      <LoginContent />
    </Suspense>
  );
}