"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/BrandMark";
import { createClient } from "@/lib/supabase/client";
import { signInWithGoogle } from "@/lib/auth/google";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

function SignupContent() {
  const router     = useRouter();
  const params     = useSearchParams();
  const defaultRole = (params.get("role") as "user" | "owner") || "user";
  const [show,         setShow]         = useState(false);
  const [err,          setErr]          = useState("");
  const [emailSent,    setEmailSent]    = useState(false);
  const [googleLoading,setGoogleLoading]= useState(false);
  const [role,         setRole]         = useState<"user" | "owner">(defaultRole);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role },
  });

  const handleGoogleSignup = async () => {
    setErr("");
    setGoogleLoading(true);
    try {
      const { redirected } = await signInWithGoogle();
      if (!redirected) router.replace("/dashboard/user");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Google sign-in failed.");
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data: SignupInput) => {
    setErr("");
    const sb = createClient();
    const { data: auth, error } = await sb.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name, phone: data.phone ?? null, role } },
    });
    if (error) { setErr(error.message); return; }
    if (!auth.user) { setErr("Account creation failed. Please try again."); return; }
    if (!auth.session) { setEmailSent(true); return; }

    const { error: upsertError } = await sb.from("users").upsert(
      { id: auth.user.id, email: data.email, full_name: data.full_name, phone: data.phone ?? null, role },
      { onConflict: "id" }
    );
    if (upsertError && !upsertError.message.includes("violates row-level security")) {
      console.warn("Profile upsert warning:", upsertError.message);
    }
    router.push(role === "owner" ? "/dashboard/owner" : "/dashboard/user");
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F4F1EB]">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-[#0D4D36]/10 border-2 border-[#0D4D36]/20 flex items-center justify-center mx-auto mb-5">
            <span className="text-[#0D4D36] text-2xl">✓</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0D4D36] mb-2">Check your email</h1>
          <p className="text-sm text-[#5F5F5F] mb-6 leading-relaxed">
            We sent a confirmation link to your email. Click it to activate your account, then{" "}
            <Link href="/login" className="text-[#0D4D36] font-semibold hover:underline">sign in</Link>.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full rounded-xl">Back to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F4F1EB] pt-[max(3rem,env(safe-area-inset-top,0px))]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <BrandMark size={40} />
          <span className="font-display font-bold text-xl text-[#0D4D36]">TurfMacha</span>
        </Link>

        <h1 className="font-display font-bold text-3xl text-[#0D4D36] mb-1">Create account</h1>
        <p className="text-sm text-[#5F5F5F] mb-7">
          Already have one?{" "}
          <Link href="/login" className="text-[#0D4D36] font-semibold hover:underline">Sign in</Link>
        </p>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2.5 mb-5 rounded-xl border-[#E7E2DA] hover:border-[#0D4D36]/30"
          onClick={handleGoogleSignup}
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

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#E7E2DA]" />
          <span className="text-xs text-[#9E9284] font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[#E7E2DA]" />
        </div>

        {/* Role toggle */}
        <div className="flex bg-[#F4F1EB] rounded-xl p-1 mb-5">
          {([
            { value: "user",  label: "Player",      Icon: User      },
            { value: "owner", label: "Turf Owner",  Icon: Building2 },
          ] as const).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                role === value
                  ? "bg-[#0D4D36] text-white shadow-sm"
                  : "text-[#5F5F5F] hover:text-[#111111]"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" value={role} {...register("role")} />

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">Full Name</label>
            <input
              placeholder="Rahul Sharma"
              className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#9E9284] outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow"
              {...register("full_name")}
            />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#9E9284] outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">
              Phone <span className="text-[#9E9284] font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#9E9284] outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow"
              {...register("phone")}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3.5 pr-11 text-sm text-[#111111] placeholder:text-[#9E9284] outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E9284] hover:text-[#5F5F5F] transition-colors"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#9E9284] outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          {err && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
              {err}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-xl bg-[#0D4D36] gap-2 shadow-lg shadow-[#0D4D36]/20"
            size="lg"
            loading={isSubmitting}
          >
            Create Account <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F1EB]" />}>
      <SignupContent />
    </Suspense>
  );
}