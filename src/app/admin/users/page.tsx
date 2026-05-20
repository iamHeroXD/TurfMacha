"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, ShieldOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/useToast";
import { format } from "date-fns";
import { User, UserRole } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const sb = createClient();
    const { data, error } = await sb
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" });
      return;
    }
    setUsers((data as User[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSuspend = async (u: User) => {
    const sb = createClient();
    const { error } = await sb
      .from("users")
      .update({ is_suspended: !u.is_suspended })
      .eq("id", u.id);
    if (error) {
      toast({ title: "Failed to update user", description: error.message, variant: "destructive" });
      return;
    }
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_suspended: !u.is_suspended } : x)));
    toast({ title: u.is_suspended ? "User unsuspended" : "User suspended" });
  };

  const changeRole = async (id: string, role: UserRole) => {
    const sb = createClient();
    const { error } = await sb.from("users").update({ role }).eq("id", id);
    if (error) {
      toast({ title: "Failed to change role", description: error.message, variant: "destructive" });
      return;
    }
    setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, role } : x)));
    toast({ title: "Role updated" });
  };

  const deleteUser = async (u: User) => {
    if (!confirm(`Delete ${u.full_name}? This removes their account and all data permanently.`)) return;

    const res = await fetch("/api/admin/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: u.id }),
    });

    const result = await res.json();
    if (!res.ok) {
      toast({
        title: "Delete failed",
        description: result.error || "Could not delete user",
        variant: "destructive",
      });
      return;
    }

    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    toast({ title: "User deleted permanently" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#111111] flex items-center gap-2">
          <Users className="h-6 w-6 text-[#0D4D36]" /> Users
        </h1>
        <p className="text-sm text-[#5F5F5F] mt-0.5">{users.length} total accounts</p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-[#E7E2DA] bg-white">
          <p className="text-[#5F5F5F] text-sm">No users found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#E7E2DA] bg-white shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-[#0D4D36]/8 flex items-center justify-center shrink-0 font-bold text-[#0D4D36] text-sm">
                {u.full_name?.[0] ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-[#111111] text-sm truncate">{u.full_name}</p>
                  {u.is_suspended && (
                    <Badge variant="destructive" className="text-[10px]">Suspended</Badge>
                  )}
                </div>
                <p className="text-xs text-[#9E9284] truncate">
                  {u.email} · {format(new Date(u.created_at), "d MMM yyyy")}
                </p>
              </div>
              <Select value={u.role} onValueChange={(v) => changeRole(u.id, v as UserRole)}>
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => toggleSuspend(u)}
                title={u.is_suspended ? "Unsuspend" : "Suspend"}
              >
                {u.is_suspended
                  ? <ShieldCheck className="h-3.5 w-3.5 text-[#0D4D36]" />
                  : <ShieldOff className="h-3.5 w-3.5 text-amber-500" />}
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => deleteUser(u)}
                title="Delete permanently"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}