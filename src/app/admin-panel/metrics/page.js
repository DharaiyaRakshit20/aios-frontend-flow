"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getAdminMetrics } from "@/lib/api";
import AdminShell from "../../components/AdminShell";
import PageLoader from "../components/PageLoader";

export default function AdminMetrics() {
  const router = useRouter();
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAdminMetrics().then(setD).catch((e) => setError(e.message));
  }, [router]);

  if (error) return <AdminShell><div className="max-w-5xl mx-auto px-4 py-10 text-red-400">{error}</div></AdminShell>;
  if (!d) return <AdminShell><PageLoader /></AdminShell>;

  const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const cards = [
    { label: "Total Users", value: d.total_users },
    { label: "Today's Signups", value: d.today_signups },
    { label: "MRR", value: inr(d.mrr), accent: "text-emerald-400" },
    { label: "Total Revenue", value: inr(d.revenue), accent: "text-emerald-400" },
    { label: "Paid Users", value: d.paid_users },
    { label: "Conversion Rate", value: `${d.conversion_rate}%` },
    { label: "Total Agents", value: d.total_agents },
    { label: "Live Agents", value: d.live_agents },
    { label: "AI Generations", value: d.ai_generations },
  ];

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Metrics</h1>
          <p className="text-slate-400 text-sm mt-1">Live numbers across your whole platform.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className={`text-2xl font-bold ${c.accent || "bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"}`}>
                {c.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

