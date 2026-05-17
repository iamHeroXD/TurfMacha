"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

function SignupContent() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = (params.get("role") as "user" | "owner") || "user";
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [role, setRole] = useState<"user" | "owner">(defaultRole);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role },
  });

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    const sb = createClient();
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const onSubmit = async (data: SignupInput) => {
    setErr("");
    const sb = createClient();

    const { data: auth, error } = await sb.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone ?? null,
          role,
        },
      },
    });

    if (error) { setErr(error.message); return; }
    if (!auth.user) { setErr("Account creation failed. Please try again."); return; }

    if (!auth.session) {
      setEmailSent(true);
      return;
    }

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
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-brand-400/10 border border-brand-400/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-brand-400 text-xl">✓</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-sm text-white/50 mb-6">
            We sent a confirmation link to your email address. Click it to activate your account, then{" "}
            <Link href="/login" className="text-brand-400 hover:underline">sign in</Link>.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">Back to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Image src="/logoofturfmacha.png" alt="TurfMacha" width={36} height={36} className="rounded-xl" />
          <span className="font-semibold text-white">TurfMacha</span>
        </Link>

        <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
        <p className="text-sm text-white/40 mb-5">
          Already have one?{" "}
          <Link href="/login" className="text-brand-400 hover:underline">Sign in</Link>
        </p>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2.5 mb-4"
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
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-white/25">or</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Role toggle */}
        <div className="flex bg-white/[0.04] rounded-lg border border-white/[0.07] p-1 mb-5">
          {(
            [
              { value: "user",  label: "Player",    Icon: User      },
              { value: "owner", label: "Turf Owner", Icon: Building2 },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                role === value ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" value={role} {...register("role")} />

          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">Full Name</Label>
            <Input placeholder="Rahul Sharma" error={errors.full_name?.message} {...register("full_name")} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">Email</Label>
            <Input type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">
              Phone <span className="text-white/25">(optional)</span>
            </Label>
            <Input type="tel" placeholder="+91 98765 43210" {...register("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">Password</Label>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/30 hover:text-white/60 transition-colors"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Re-enter password"
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
            />
          </div>

          {err && (
            <p className="text-xs text-red-400 bg-red-500/[0.07] border border-red-500/20 rounded-lg px-3 py-2.5">
              {err}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <SignupContent />
    </Suspense>
  );
}
