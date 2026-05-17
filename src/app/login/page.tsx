"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, LoginInput } from "@/lib/validations/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");
    try {
      const supabase = createClient();
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) { setServerError(error.message); return; }
      if (authData.user) {
        const { data: profile } = await supabase
          .from("users").select("*").eq("id", authData.user.id).single();
        if (profile) {
          setUser(profile);
          const redirect = searchParams.get("redirect") ||
            (profile.role === "owner" ? "/dashboard/owner" : "/dashboard/user");
          router.push(redirect);
        }
      }
    } catch {
      setServerError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#070714] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_60%)]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/8 rounded-full blur-[80px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-cyan-500/8 rounded-full blur-[60px] animate-float" style={{ animationDelay: "1s" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 text-center px-12">
          <div className="text-6xl mb-6">🏟️</div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
          <p className="text-white/50 leading-relaxed">
            Book your favourite sports turf in seconds.<br />Thousands of venues waiting for you.
          </p>
          <div className="flex flex-col gap-3 mt-10 text-left">
            {["⚡ Instant booking confirmation", "🔒 Secure payments", "📍 Turfs near you", "🌟 Verified venues"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/60 text-sm">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 bg-[#0a0a1a] relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-sm"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 group w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap className="h-5 w-5 text-black" />
            </div>
            <span className="font-bold text-xl text-white">
              Turf<span className="gradient-text">Book</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-white/45 text-sm mb-8">
            New here?{" "}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/70 text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/70 text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/35 hover:text-white/70 transition-colors rounded"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {serverError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full shadow-lg shadow-emerald-500/20" size="lg" loading={isSubmitting}>
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a1a]" />}>
      <LoginContent />
    </Suspense>
  );
}
