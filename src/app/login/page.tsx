"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
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
  const [err, setErr] = useState("");

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

    // Fetch the public profile
    const { data: profile, error: profileError } = await sb
      .from("users")
      .select("*")
      .eq("id", auth.user.id)
      .single();

    if (profileError || !profile) {
      // Profile missing — auto-create from auth metadata (handles trigger race conditions)
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
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <span className="text-black font-bold text-xs">T</span>
            </div>
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
            className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
          >
            Create an account
          </Link>
        </motion.p>

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
            <Label className="text-white/55 text-sm">Password</Label>
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
