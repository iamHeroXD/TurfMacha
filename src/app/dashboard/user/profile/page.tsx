"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone,    setPhone]    = useState(user?.phone    || "");
  const [saving,   setSaving]   = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .update({ full_name: fullName, phone })
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      setUser(data);
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    } catch {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-14 pb-24 md:pb-8">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="font-display font-bold text-2xl text-[#0B3D2E] flex items-center gap-2">
            <User className="h-6 w-6" /> My Profile
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-6 shadow-sm">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 pb-5 border-b border-gray-100">
              <Avatar className="h-20 w-20 ring-4 ring-[#0B3D2E]/10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="text-2xl bg-[#0B3D2E]/8 text-[#0B3D2E] font-bold">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-display font-bold text-[#1F2937]">{user.full_name}</p>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0B3D2E]/8 text-[#0B3D2E] font-semibold capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#1F2937] outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    value={user.email}
                    disabled
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#9CA3AF] cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#1F2937] outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent"
                    placeholder="+91 9999999999"
                  />
                </div>
              </div>

              <Button onClick={handleSave} loading={saving} className="w-full gap-2 rounded-xl">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
