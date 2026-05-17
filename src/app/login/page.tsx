"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, LoginInput } from "@/lib/validations/auth";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuthStore();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setErr("");
    const sb = createClient();
    const { data: auth, error } = await sb.auth.signInWithPassword({ email: data.email, password: data.password });
    if (error) { setErr(error.message); return; }
    if (auth.user) {
      const { data: profile } = await sb.from("users").select("*").eq("id", auth.user.id).single();
      if (profile) {
        setUser(profile);
        router.push(params.get("redirect") || (profile.role === "owner" ? "/dashboard/owner" : "/dashboard/user"));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-black font-bold text-xs">T</span>
          </div>
          <span className="font-semibold text-white">TurfBook</span>
        </Link>

        <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
        <p className="text-sm text-white/40 mb-8">
          New here?{" "}
          <Link href="/signup" className="text-emerald-400 hover:underline">Create an account</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">Email</Label>
            <Input type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/60 text-sm">Password</Label>
            <div className="relative">
              <Input type={show ? "text" : "password"} placeholder="••••••••" error={errors.password?.message} {...register("password")} />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/30 hover:text-white/60 transition-colors">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {err && <p className="text-xs text-red-400 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2.5">{err}</p>}

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>Sign in</Button>
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
