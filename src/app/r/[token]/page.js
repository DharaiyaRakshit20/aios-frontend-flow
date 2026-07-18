"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPublicReport } from "@/lib/api";
import PublicShell from "../../components/PublicShell";
import PageLoader from "../../components/PageLoader";

export default function PublicReport() {
  const { token } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicReport(token)
      .then(setData)
      .catch(() => setError("This report isn't available. The link may be private or removed."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <PublicShell><PageLoader /></PublicShell>;

  if (error) {
    return (
      <PublicShell>
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
          <h1 className="text-xl font-bold mb-2">Report not available</h1>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button onClick={() => router.push("/")} className="text-indigo-400 hover:text-indigo-300 text-sm">Go to Qevora →</button>
        </div>
      </PublicShell>
    );
  }

  const r = data.result || {};
  const score = data.readiness_score ?? 0;
  const scoreColor = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400";
  const savings = r.savings_estimate || {};

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* header */}
        <div className="text-center">
          <span className="inline-block text-xs uppercase tracking-wide text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-3">Shared AI Readiness Report</span>
          <h1 className="text-2xl font-bold">{data.organization_name}</h1>
          <p className="text-slate-500 text-sm mt-1">{data.industry || "Business"} · {new Date(data.created_at).toLocaleDateString()}</p>
        </div>

        {/* score */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
          <p className={`text-6xl font-bold ${scoreColor}`}>{score}<span className="text-2xl text-slate-600">/100</span></p>
          <p className="text-slate-400 mt-2">{r.maturity_level || "AI Readiness Score"}</p>
          {r.summary && <p className="text-slate-400 text-sm mt-4 max-w-xl mx-auto">{r.summary}</p>}
        </div>

        {/* savings */}
        {(savings.monthly_inr || savings.roi_percent) && (
          <div className="grid grid-cols-2 gap-4">
            {savings.monthly_inr != null && (
              <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl p-5 text-center">
                <p className="text-xs text-slate-400">Est. Monthly Savings</p>
                <p className="text-2xl font-bold text-emerald-400">₹{Number(savings.monthly_inr).toLocaleString("en-IN")}</p>
              </div>
            )}
            {savings.roi_percent != null && (
              <div className="bg-indigo-500/[0.06] border border-indigo-500/15 rounded-2xl p-5 text-center">
                <p className="text-xs text-slate-400">Estimated ROI</p>
                <p className="text-2xl font-bold text-indigo-400">{savings.roi_percent}%</p>
              </div>
            )}
          </div>
        )}

        {/* opportunities */}
        {r.opportunities?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Top Opportunities</h2>
            <div className="space-y-3">
              {r.opportunities.map((o, i) => (
                <div key={i} className="border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{o.area || o.title}</span>
                    {o.impact && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Impact: {o.impact}</span>}
                    {o.effort && <span className="text-xs text-slate-500">Effort: {o.effort}</span>}
                  </div>
                  {o.description && <p className="text-slate-400 text-sm mt-1.5">{o.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transformation Roadmap + Timeline */}
        {r.roadmap?.phases?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold">Transformation Roadmap</h2>
              <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5">™</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">A step-by-step path to becoming AI-ready.</p>

            {/* horizontal timeline */}
            <div className="bg-gradient-to-r from-indigo-500/[0.06] to-violet-500/[0.06] border border-white/10 rounded-2xl p-5 mb-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 min-w-[520px]">
                <div className="text-center shrink-0 w-24">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 text-sm">📍</div>
                  <p className="text-xs font-medium text-slate-300">Today</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Score {score}</p>
                </div>
                {r.roadmap.phases.map((ph, i) => {
                  const last = i === r.roadmap.phases.length - 1;
                  return (
                    <div key={i} className="flex items-center flex-1 min-w-0">
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-indigo-500/40 to-violet-500/40 min-w-[20px]" />
                      <div className="text-center shrink-0 w-24">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold ${last ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-indigo-500 to-violet-500"} shadow-lg shadow-indigo-500/25`}>
                          {last ? "🎯" : ph.phase || i + 1}
                        </div>
                        <p className="text-xs font-medium text-slate-300 truncate px-1">{last ? "AI-Ready" : ph.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{ph.duration || `Phase ${i + 1}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* phases detail */}
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/40 to-transparent" />
              <div className="space-y-6">
                {r.roadmap.phases.map((ph, i) => (
                  <div key={i} className="relative pl-11">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/25">
                      {ph.phase || i + 1}
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold">{ph.title}</h3>
                        {ph.duration && <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 shrink-0">{ph.duration}</span>}
                      </div>
                      {ph.focus && <p className="text-sm text-slate-400 mb-3">{ph.focus}</p>}
                      {ph.actions?.length > 0 && (
                        <ul className="space-y-1.5 mb-3">
                          {ph.actions.map((a, j) => (
                            <li key={j} className="flex gap-2 text-sm text-slate-300"><span className="text-indigo-400 shrink-0">→</span><span>{a}</span></li>
                          ))}
                        </ul>
                      )}
                      {ph.expected_impact && (
                        <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-lg px-3 py-2 text-xs text-emerald-300">
                          <span className="font-medium">Impact:</span> {ph.expected_impact}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-indigo-600/15 to-violet-600/15 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Want a report like this for your business?</h2>
          <p className="text-slate-300 text-sm mb-6">Scan your business free — get your AI readiness score in 5 minutes.</p>
          <button onClick={() => router.push("/login")}
            className="bg-white text-slate-900 rounded-xl px-7 py-3 font-semibold hover:bg-slate-100 hover:scale-105 transition">
            Scan my business free →
          </button>
        </div>
      </div>
    </PublicShell>
  );
}
