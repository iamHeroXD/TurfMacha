"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Building2, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as "user" | "owner") || "user";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [role, setRole] = useState<"user" | "owner">(defaultRole);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role },
  });

  const onSubmit = async (data: SignupInput) => {
    setServerError("");
    try {
      const supabase = createClient();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.full_name, role } },
      });
      if (error) { setServerError(error.message); return; }
      if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          role,
        });
        if (profileError && !profileError.message.includes("duplicate")) {
          setServerError(profileError.message);
          return;
        }
        router.push(role === "owner" ? "/dashboard/owner" : "/dashboard/user");
      }
    } catch {
      setServerError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
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
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold text-white mb-3">Join TurfBook</h2>
          <p className="text-white/50 leading-relaxed mb-8">
            {role === "owner"
              ? "List your venue and get bookings from thousands of players."
              : "Find and book premium sports turfs near you in seconds."}
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {(role === "owner" ? [
              { emoji: "📊", label: "Real-time analytics" },
              { emoji: "💳", label: "Instant payments" },
              { emoji: "📅", label: "Booking management" },
              { emoji: "⭐", label: "Reviews system" },
            ] : [
              { emoji: "🏟️", label: "500+ turfs" },
              { emoji: "⚡", label: "Instant booking" },
              { emoji: "🔒", label: "Secure payments" },
              { emoji: "📍", label: "Location-based" },
            ]).map(({ emoji, label }) => (
              <div key={label} className="flex items-center gap-2 glass-card px-3 py-2.5 text-sm text-white/60">
                <span>{emoji}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-[#0a0a1a] relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-sm"
        >
          <Link href="/" className="flex items-center gap-2.5 mb-10 group w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap className="h-5 w-5 text-black" />
            </div>
            <span className="font-bold text-xl text-white">
              Turf<span className="gradient-text">Book</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-white/45 text-sm mb-6">
            Already have one?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-white/5 rounded-2xl border border-white/10">
            {([
              { value: "user", label: "Player", icon: User, desc: "Book turfs" },
              { value: "owner", label: "Turf Owner", icon: Building2, desc: "List venues" },
            ] as const).map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm font-medium transition-all border",
                  role === value
                    ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-400"
                    : "border-transparent text-white/45 hover:text-white/70"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
                <span className="text-[10px] opacity-60">{desc}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" value={role} {...register("role")} />

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Full Name</Label>
              <Input placeholder="John Doe" error={errors.full_name?.message} {...register("full_name")} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Email</Label>
              <Input type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">
                Phone <span className="text-white/30">(optional)</span>
              </Label>
              <Input type="tel" placeholder="+91 9999999999" {...register("phone")} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
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

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Re-enter password"
                error={errors.confirm_password?.message}
                {...register("confirm_password")}
              />
            </div>

            {serverError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full shadow-lg shadow-emerald-500/20" size="lg" loading={isSubmitting}>
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a1a]" />}>
      <SignupContent />
    </Suspense>
  );
}
