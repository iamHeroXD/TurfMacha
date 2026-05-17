"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
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
  const [role, setRole] = useState<"user" | "owner">(defaultRole);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role },
  });

  const onSubmit = async (data: SignupInput) => {
    setErr("");
    const sb = createClient();

    // Step 1: Create auth user — pass all profile fields in metadata
    // so the handle_new_user() trigger can insert a complete profile row.
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

    if (error) {
      setErr(error.message);
      return;
    }

    if (!auth.user) {
      setErr("Account creation failed. Please try again.");
      return;
    }

    // Step 2: The DB trigger handle_new_user() has already created the profile
    // row via SECURITY DEFINER. We upsert here only to patch the phone field
    // if the trigger ran before the metadata was available (edge case), and to
    // ensure the role reflects the user's actual selection.
    const { error: upsertError } = await sb.from("users").upsert(
      {
        id: auth.user.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone ?? null,
        role,
      },
      { onConflict: "id" }
    );

    // An upsert conflict just means the trigger already created the row — safe to ignore.
    if (upsertError && !upsertError.message.includes("violates row-level security")) {
      // Only surface unexpected errors, not RLS (trigger handles that path)
      console.warn("Profile upsert warning:", upsertError.message);
    }

    // Step 3: Redirect based on role
    router.push(role === "owner" ? "/dashboard/owner" : "/dashboard/user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <span className="text-black font-bold text-xs">T</span>
          </div>
          <span className="font-semibold text-white">TurfMacha</span>
        </Link>

        <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
        <p className="text-sm text-white/40 mb-6">
          Already have one?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>

        {/* Role toggle */}
        <div className="flex bg-white/[0.04] rounded-lg border border-white/[0.07] p-1 mb-6">
          {(
            [
              { value: "user",  label: "Player",     Icon: User      },
              { value: "owner", label: "Turf Owner",  Icon: Building2 },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                role === value
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/70"
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
            <Input
              placeholder="Rahul Sharma"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">
              Phone{" "}
              <span className="text-white/25">(optional)</span>
            </Label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              {...register("phone")}
            />
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

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
          >
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
