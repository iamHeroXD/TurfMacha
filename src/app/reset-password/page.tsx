"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormInput = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setHasSession(true);
      } else {
        router.replace("/forgot-password?expired=1");
      }
      setChecking(false);
    });
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    setErr("");
    const sb = createClient();
    const { error } = await sb.auth.updateUser({ password: data.password });
    if (error) { setErr(error.message); return; }
    router.push("/login?reset=success");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <Loader2 className="h-6 w-6 text-[#0B3D2E]/40 animate-spin" />
      </div>
    );
  }

  if (!hasSession) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FAF7F0]">
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-[#0B3D2E] rounded-xl flex items-center justify-center transform -rotate-6 shadow-md">
              <MapPin className="w-4 h-4 text-[#A3E635]" />
            </div>
            <span className="font-display font-bold text-[#0B3D2E] text-lg">TurfMacha</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.28 }}
          className="text-2xl font-display font-bold text-[#1F2937] mb-1"
        >
          Set new password
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.28 }}
          className="text-sm text-[#6B7280] mb-8"
        >
          Choose a strong password for your account.
        </motion.p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[#1F2937] text-sm font-medium">New Password</Label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[#1F2937] text-sm font-medium">Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Re-enter password"
              error={errors.confirm?.message}
              {...register("confirm")}
            />
          </div>

          {err && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{err}</p>
          )}

          <Button type="submit" className="w-full bg-[#0B3D2E] hover:bg-[#0B3D2E]/90" size="lg" loading={isSubmitting}>
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
