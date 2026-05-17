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
    const { data } = await sb.from("users").select("*").order("created_at", { ascending: false });
    setUsers((data as User[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSuspend = async (u: User) => {
    const sb = createClient();
    await sb.from("users").update({ is_suspended: !u.is_suspended }).eq("id", u.id);
    setUsers(users.map(x => x.id === u.id ? { ...x, is_suspended: !u.is_suspended } : x));
    toast({ title: u.is_suspended ? "User unsuspended" : "User suspended" });
  };

  const changeRole = async (id: string, role: UserRole) => {
    const sb = createClient();
    await sb.from("users").update({ role }).eq("id", id);
    setUsers(users.map(x => x.id === id ? { ...x, role } : x));
    toast({ title: "Role updated" });
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const sb = createClient();
    await sb.from("users").delete().eq("id", id);
    setUsers(users.filter(x => x.id !== id));
    toast({ title: "User deleted" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-brand-400" /> Users
        </h1>
        <p className="text-sm text-white/40 mt-0.5">{users.length} total accounts</p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111]"
            >
              <div className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 font-medium text-white/50 text-sm">
                {u.full_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white text-sm truncate">{u.full_name}</p>
                  {u.is_suspended && <Badge variant="destructive" className="text-[10px]">Suspended</Badge>}
                </div>
                <p className="text-xs text-white/35 truncate">{u.email} · {format(new Date(u.created_at), "d MMM yyyy")}</p>
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
              <Button size="icon-sm" variant="ghost" onClick={() => toggleSuspend(u)} title={u.is_suspended ? "Unsuspend" : "Suspend"}>
                {u.is_suspended ? <ShieldCheck className="h-3.5 w-3.5 text-brand-400" /> : <ShieldOff className="h-3.5 w-3.5 text-amber-400" />}
              </Button>
              <Button size="icon-sm" variant="ghost" className="text-red-400" onClick={() => deleteUser(u.id)} title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
