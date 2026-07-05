"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getPlatformStats } from "@/lib/api";
import AdminShell from "../components/AdminShell";

export default function AdminOverview() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getPlatformStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <AdminShell><div className="max-w-6xl mx-auto px-6 py-10 text-slate-500">Loading...</div></AdminShell>;

  // agar admin nahi hai to access denied
  if (error) {
    return (
      <AdminShell>
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 text-2xl">🔒</div>
          <h1 className="text-lg font-semibold mb-2">Access denied</h1>
          <p className="text-slate-400 text-sm mb-6">You don&apos;t have permission to access the admin panel.</p>
          <button onClick={() => router.push("/dashboard")} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 transition">Back to dashboard</button>
        </div>
      </AdminShell>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.total_users, sub: `+${stats.new_users_30d} in 30 days` },
    { label: "Organizations", value: stats.total_organizations },
    { label: "Total Scans", value: stats.total_scans, sub: `${stats.completed_scans} completed` },
    { label: "Blueprints", value: stats.total_blueprints },
    { label: "AI Agents", value: stats.total_agents },
    { label: "Avg AI Score", value: stats.average_ai_score },
  ];

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Everything happening across Qevora.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">{c.value}</p>
              <p className="text-sm text-slate-400 mt-1">{c.label}</p>
              {c.sub && <p className="text-xs text-slate-600 mt-1">{c.sub}</p>}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push("/admin-panel/users")} className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
            Manage Users →
          </button>
        </div>
      </div>
    </AdminShell>
  );
}