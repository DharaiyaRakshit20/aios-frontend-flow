"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getAdminRevenue } from "@/lib/api";
import AdminShell from "../../components/AdminShell";

export default function AdminBilling() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAdminRevenue().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [router]);

  if (loading) return <AdminShell><div className="max-w-6xl mx-auto px-6 py-10 text-slate-500">Loading...</div></AdminShell>;
  if (error) return <AdminShell><div className="max-w-6xl mx-auto px-6 py-10 text-red-400">{error}</div></AdminShell>;

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <button onClick={() => router.push("/admin-panel")} className="text-sm text-slate-400 hover:text-white transition">← Back to overview</button>
        <h1 className="text-2xl font-bold">Billing & Revenue</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "MRR", value: `$${data.mrr.toLocaleString()}`, sub: "Monthly recurring" },
            { label: "ARR", value: `$${data.arr.toLocaleString()}`, sub: "Annual recurring" },
            { label: "Active Subs", value: data.total_subscriptions },
            { label: "Paid Subs", value: data.paid_subscriptions },
          ].map((c, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">{c.value}</p>
              <p className="text-sm text-slate-400 mt-1">{c.label}</p>
              {c.sub && <p className="text-xs text-slate-600 mt-1">{c.sub}</p>}
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Plan Breakdown</h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-2 px-4 py-3 text-xs text-slate-500 uppercase tracking-wide border-b border-white/5">
              <span>Plan</span><span>Price</span><span>Subscribers</span><span className="text-right">Revenue</span>
            </div>
            {Object.entries(data.breakdown).map(([key, b]) => (
              <div key={key} className="grid grid-cols-4 gap-2 px-4 py-3 text-sm items-center border-b border-white/5 last:border-0">
                <span className="font-medium">{b.name}</span>
                <span className="text-slate-400">${b.price}/mo</span>
                <span className="text-slate-400">{b.count}</span>
                <span className="text-right text-emerald-400">${(b.price * b.count).toLocaleString()}/mo</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}