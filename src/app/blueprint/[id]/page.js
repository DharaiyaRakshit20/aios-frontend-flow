"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken, getBlueprint } from "@/lib/api";
import AppShell from "../../components/AppShell";

export default function BlueprintPage() {
  const router = useRouter();
  const { id } = useParams();
  const [bp, setBp] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getBlueprint(id).then(setBp).catch((e) => setError(e.message));
  }, [id, router]);

  if (error) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-red-400">{error}</div></AppShell>;
  if (!bp) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading blueprint...</div></AppShell>;

  if (bp.status === "failed") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 text-2xl">!</div>
          <h1 className="text-lg font-semibold mb-2">Blueprint failed</h1>
          <p className="text-slate-400 text-sm mb-6">Could not generate this blueprint. Please try again.</p>
          <button onClick={() => router.back()} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 transition">Go back</button>
        </div>
      </AppShell>
    );
  }

  const r = bp.result || {};

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <button onClick={() => router.push(`/report/${bp.report}`)} className="text-sm text-slate-400 hover:text-white transition">← Back to report</button>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <span className="text-xs uppercase tracking-wide text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1">Implementation Blueprint</span>
          <h1 className="text-2xl font-bold mt-4 mb-2">{r.title || bp.opportunity_area}</h1>
          <p className="text-slate-400 text-sm">{r.overview}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Timeline", value: r.estimated_timeline },
            { label: "Cost", value: r.estimated_cost },
            { label: "Team", value: (r.team_needed || []).join(", ") },
          ].map((m, i) => m.value && (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{m.label}</p>
              <p className="text-sm text-white">{m.value}</p>
            </div>
          ))}
        </div>

        {r.tools?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Tools & Technology</h2>
            <div className="space-y-2">
              {r.tools.map((t, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-indigo-300 font-medium min-w-[120px]">{t.name}</span>
                  <span className="text-slate-400">{t.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {r.steps?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Implementation Steps</h2>
            <ol className="space-y-4">
              {r.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs rounded-full flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="font-medium text-sm">{s.title}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {r.expected_outcome && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">Expected Outcome</h2>
            <p className="text-slate-300 text-sm">{r.expected_outcome}</p>
          </div>
        )}

        {r.risks?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Things to Watch</h2>
            <ul className="space-y-2">
              {r.risks.map((risk, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-400">
                  <span className="text-amber-400">•</span>{risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}