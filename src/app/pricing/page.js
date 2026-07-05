"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getPlans, getMySubscription, subscribe } from "@/lib/api";
import AppShell from "../components/AppShell";

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    Promise.all([getPlans(), getMySubscription()])
      .then(([p, s]) => { setPlans(p); setCurrent(s); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubscribe(key) {
    setBusy(key); setError("");
    try {
      const s = await subscribe(key);
      setCurrent(s);
    } catch (e) { setError(e.message); }
    finally { setBusy(""); }
  }

  if (loading) return <AppShell><div className="max-w-5xl mx-auto px-4 py-10 text-slate-500">Loading...</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Choose your plan</h1>
          <p className="text-slate-400 mt-2">Scale Qevora as your business grows.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 max-w-md mx-auto">{error}</div>}

        <div className="grid sm:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isCurrent = current?.plan === p.key;
            const isPro = p.key === "pro";
            return (
              <div key={p.key} className={`rounded-2xl p-6 border flex flex-col ${
                isPro ? "border-indigo-500/40 bg-gradient-to-b from-indigo-500/10 to-transparent" : "border-white/10 bg-white/[0.03]"
              }`}>
                {isPro && <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 self-start mb-3">Most popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-3xl font-bold mt-2">
                  ${p.price}<span className="text-sm text-slate-500 font-normal">/mo</span>
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-400 flex-1">
                  <li>✓ {p.scan_limit} scans / month</li>
                  <li>✓ {p.agent_limit} AI agents</li>
                  <li>✓ Blueprints & reports</li>
                  {p.key !== "free" && <li>✓ Priority support</li>}
                </ul>
                <button
                  onClick={() => handleSubscribe(p.key)}
                  disabled={isCurrent || busy === p.key}
                  className={`mt-6 rounded-lg py-2.5 text-sm font-medium transition ${
                    isCurrent
                      ? "bg-white/5 text-slate-500 cursor-default"
                      : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90"
                  }`}
                >
                  {isCurrent ? "Current plan" : busy === p.key ? "Updating..." : p.price === 0 ? "Downgrade to Free" : `Choose ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-600">
          Payments are not charged yet — this is a preview. Real billing coming soon.
        </p>
      </div>
    </AppShell>
  );
}