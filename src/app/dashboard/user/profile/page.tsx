"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, Mail, Save, Lock, Eye, EyeOff,
  Wallet, ChevronRight, Trash2, AlertTriangle,
  CheckCircle2, LogOut, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

const inputCls =
  "w-full bg-[#F4F1EB] border border-[#E7E2DA] rounded-xl px-4 py-3 text-sm text-[#111111] outline-none focus:ring-2 focus:ring-[#A6D96A]/60 focus:border-[#A6D96A] transition-all placeholder:text-[#9E9284]";
const inputWithIconCls = inputCls + " pl-10";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E7E2DA] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E7E2DA]">
        <h2 className="font-display font-bold text-[#111111] text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();

  // Profile
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Wallet balance
  const [coinBalance, setCoinBalance] = useState<number | null>(null);

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    // Fetch wallet balance
    const sb = createClient();
    sb.from("turf_coins").select("balance").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setCoinBalance(data.balance); });
  }, [user, router]);

  if (!user) return null;

  /* ── handlers ── */

  const handleSaveProfile = async () => {
    if (!fullName.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    setSavingProfile(true);
    try {
      const sb = createClient();
      const { data, error } = await sb
        .from("users").update({ full_name: fullName.trim(), phone: phone.trim() || null })
        .eq("id", user.id).select().single();
      if (error) throw error;
      setUser(data);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch {
      toast({ title: "Error saving profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPw || newPw.length < 8) {
      toast({ title: "Password too short", description: "Minimum 8 characters.", variant: "destructive" });
      return;
    }
    if (newPw !== confirmPw) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSavingPassword(true);
    try {
      const sb = createClient();
      // Re-authenticate with current password first
      const { error: signInError } = await sb.auth.signInWithPassword({
        email: user.email,
        password: currentPw,
      });
      if (signInError) {
        toast({ title: "Current password is incorrect", variant: "destructive" });
        return;
      }
      const { error } = await sb.auth.updateUser({ password: newPw });
      if (error) throw error;
      toast({ title: "Password updated", description: "Your new password is active." });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setShowPasswordForm(false);
    } catch {
      toast({ title: "Failed to update password", variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    logout();
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) {
      toast({ title: "Email doesn't match", variant: "destructive" });
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Deletion failed");
      }
      logout();
      router.push("/?deleted=1");
    } catch (err) {
      toast({
        title: "Could not delete account",
        description: err instanceof Error ? err.message : "Please contact support.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-14 pb-24 md:pb-8">

      {/* Page header */}
      <div className="bg-white border-b border-[#E7E2DA]">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="font-display font-bold text-xl text-[#111111]">Account Settings</h1>
          <p className="text-sm text-[#5F5F5F] mt-0.5">Manage your profile, security, and account</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* ── Avatar + identity ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 flex items-center gap-4">
            <Avatar className="h-16 w-16 shrink-0 ring-4 ring-[#0D4D36]/8">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-xl bg-[#0D4D36]/8 text-[#0D4D36] font-bold">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[#111111] text-base truncate">{user.full_name}</p>
              <p className="text-sm text-[#5F5F5F] truncate">{user.email}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#0D4D36]/8 text-[#0D4D36] font-semibold capitalize">
                <ShieldCheck className="h-3 w-3" /> {user.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Profile info ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionCard title="Profile Information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9284]" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputWithIconCls}
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9284]" />
                  <input
                    value={user.email}
                    disabled
                    className={inputWithIconCls + " opacity-60 cursor-not-allowed"}
                  />
                </div>
                <p className="text-xs text-[#9E9284] mt-1">Email cannot be changed after signup.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5">
                  Phone <span className="text-[#9E9284] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9284]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputWithIconCls}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                loading={savingProfile}
                className="w-full gap-2 rounded-xl bg-[#0D4D36]"
              >
                <Save className="h-4 w-4" /> Save Profile
              </Button>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Security ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionCard title="Security">
            <div className="space-y-3">

              {/* Change password toggle */}
              <button
                onClick={() => setShowPasswordForm((v) => !v)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[#F4F1EB] border border-[#E7E2DA] hover:border-[#C4BAB0] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0D4D36]/8 rounded-lg flex items-center justify-center">
                    <Lock className="h-4 w-4 text-[#0D4D36]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#111111]">Change Password</p>
                    <p className="text-xs text-[#9E9284]">Update your account password</p>
                  </div>
                </div>
                <motion.div animate={{ rotate: showPasswordForm ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="h-4 w-4 text-[#C4BAB0]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showPasswordForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-1 pb-1">

                      {/* Current password */}
                      <div>
                        <label className="block text-sm font-semibold text-[#111111] mb-1.5">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            className={inputCls + " pr-10"}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9284] hover:text-[#5F5F5F] transition-colors"
                          >
                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New password */}
                      <div>
                        <label className="block text-sm font-semibold text-[#111111] mb-1.5">New Password</label>
                        <div className="relative">
                          <input
                            type={showNew ? "text" : "password"}
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            className={inputCls + " pr-10"}
                            placeholder="Min. 8 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9284] hover:text-[#5F5F5F] transition-colors"
                          >
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {newPw.length > 0 && newPw.length < 8 && (
                          <p className="text-xs text-amber-600 mt-1">At least 8 characters required</p>
                        )}
                      </div>

                      {/* Confirm password */}
                      <div>
                        <label className="block text-sm font-semibold text-[#111111] mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          className={inputCls}
                          placeholder="Re-enter new password"
                        />
                        {confirmPw.length > 0 && confirmPw !== newPw && (
                          <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                        {confirmPw.length > 0 && confirmPw === newPw && (
                          <p className="text-xs text-[#0D4D36] mt-1 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Passwords match
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={handleChangePassword}
                          loading={savingPassword}
                          className="flex-1 rounded-xl bg-[#0D4D36]"
                          disabled={!currentPw || newPw.length < 8 || newPw !== confirmPw}
                        >
                          Update Password
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => { setShowPasswordForm(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
                          className="rounded-xl border-[#E7E2DA]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F4F1EB] border border-[#E7E2DA] hover:border-[#C4BAB0] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <LogOut className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111111]">Sign Out</p>
                  <p className="text-xs text-[#9E9284]">Sign out of this device</p>
                </div>
              </button>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Wallet ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionCard title="TurfCoins Wallet">
            <Link href="/dashboard/user/wallet" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#0D4D36] rounded-xl flex items-center justify-center shrink-0">
                <Wallet className="h-5 w-5 text-[#A6D96A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111111]">Your Balance</p>
                <p className="text-lg font-display font-extrabold text-[#0D4D36] tabular-nums">
                  {coinBalance === null ? "—" : coinBalance.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-[#9E9284]">TurfCoins</span>
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#C4BAB0] group-hover:text-[#0D4D36] transition-colors shrink-0" />
            </Link>
          </SectionCard>
        </motion.div>

        {/* ── Danger zone ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 bg-red-50/50">
              <h2 className="font-display font-bold text-red-700 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Danger Zone
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111111] mb-1">Delete Account</p>
                  <p className="text-xs text-[#5F5F5F] leading-relaxed">
                    Permanently delete your account and all associated data — bookings, wallet, favourites.
                    This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                  className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Delete confirmation modal ── */}
      <AnimatePresence>
        {deleteOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => !deleting && setDeleteOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-7 border border-[#E7E2DA]">
                {/* Warning icon */}
                <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
                  <Trash2 className="h-7 w-7 text-red-500" />
                </div>

                <h2 className="font-display font-bold text-xl text-[#111111] text-center mb-2">
                  Delete your account?
                </h2>
                <p className="text-sm text-[#5F5F5F] text-center mb-6 leading-relaxed">
                  This will permanently delete your account, all bookings, wallet balance, and saved turfs.
                  <strong className="text-[#111111]"> This cannot be undone.</strong>
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-1.5">
                      Type your email to confirm
                    </label>
                    <input
                      type="email"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder={user.email}
                      className={inputCls}
                      autoComplete="off"
                    />
                    {deleteConfirm.length > 0 && deleteConfirm !== user.email && (
                      <p className="text-xs text-red-500 mt-1">Email does not match</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-[#E7E2DA]"
                      onClick={() => { setDeleteOpen(false); setDeleteConfirm(""); }}
                      disabled={deleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                      loading={deleting}
                      disabled={deleteConfirm !== user.email}
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Delete Forever
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
