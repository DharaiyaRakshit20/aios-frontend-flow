"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getPlatformUsers, setUserActive } from "@/lib/api";
import AdminShell from "../../components/AdminShell";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load(s) {
    getPlatformUsers(s).then((d) => setUsers(d.results || d)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    load("");
  }, [router]);

  async function toggleActive(u) {
    try {
      const updated = await setUserActive(u.id, !u.is_active);
      setUsers((list) => list.map((x) => x.id === u.id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <button onClick={() => router.push("/admin-panel")} className="text-sm text-slate-400 hover:text-white transition">← Back to overview</button>
        <h1 className="text-2xl font-bold">Users</h1>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

        <input
          className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
        />

        {loading ? <p className="text-slate-500">Loading...</p> : (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs text-slate-500 uppercase tracking-wide border-b border-white/5">
              <span className="col-span-4">Email</span>
              <span className="col-span-3">Name</span>
              <span className="col-span-2">Role</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-1"></span>
            </div>
            {users.map((u) => (
              <div key={u.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center border-b border-white/5 last:border-0">
                <span className="col-span-4 truncate">{u.email}{u.is_platform_admin && <span className="ml-2 text-xs text-amber-400">admin</span>}</span>
                <span className="col-span-3 text-slate-400 truncate">{u.full_name || "—"}</span>
                <span className="col-span-2 text-slate-400 truncate">{u.role || "—"}</span>
                <span className="col-span-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {u.is_active ? "Active" : "Suspended"}
                  </span>
                </span>
                <span className="col-span-1 text-right">
                  {!u.is_platform_admin && (
                    <button onClick={() => toggleActive(u)} className="text-xs text-slate-500 hover:text-white transition">
                      {u.is_active ? "Suspend" : "Activate"}
                    </button>
                  )}
                </span>
              </div>
            ))}
            {users.length === 0 && <p className="px-4 py-8 text-center text-slate-500 text-sm">No users found.</p>}
          </div>
        )}
      </div>
    </AdminShell>
  );
}