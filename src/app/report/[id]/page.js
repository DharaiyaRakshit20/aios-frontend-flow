"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken, getReport, generateBlueprint, getReportBlueprints, translateReport, getProfile, toggleReportShare } from "@/lib/api";
import AppShell from "../../components/AppShell";
import StarRating from "../../components/StarRating";
import PageLoader from "../../components/PageLoader";

export default function ReportPage() {
  const router = useRouter();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(null);
  const [blueprints, setBlueprints] = useState([]);
  const [displayResult, setDisplayResult] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareToken, setShareToken] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getReport(id).then((data) => {
      setReport(data);
      setShared(data.is_shared);
      setShareToken(data.share_token);
    }).catch((e) => setError(e.message));
    getReportBlueprints(id).then((data) => setBlueprints(data.results || data)).catch(() => {});
  }, [id, router]);

  // auto-translate — sirf tab jab report ki language user ki language se alag ho
  useEffect(() => {
    if (!report || !report.result) return;
    getProfile()
      .then((u) => {
        const userLang = u.language || "en";
        const reportLang = report.language || "en";
        // already same language -> translate mat karo
        if (userLang === reportLang) { setDisplayResult(report.result); return; }
        setTranslating(true);
        translateReport(id, userLang)
          .then((res) => setDisplayResult(res.result))
          .catch(() => setDisplayResult(report.result))
          .finally(() => setTranslating(false));
      })
      .catch(() => setDisplayResult(report.result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  function downloadPdf() {
    const token = localStorage.getItem("aios_token");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/scanner/reports/${id}/pdf`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `qevora-report-${id}.pdf`;
        link.click();
      });
  }

  async function handleBlueprint(op, i) {
    setGenerating(i);
    try {
      const bp = await generateBlueprint(id, op);
      router.push(`/blueprint/${bp.id}`);
    } catch (e) {
      alert(e.message);
    } finally {
      setGenerating(null);
    }
  }

  async function handleShare() {
    try {
      const res = await toggleReportShare(id);
      setShared(res.is_shared);
      setShareToken(res.share_token);
    } catch (e) { setError(e.message); }
  }

  function copyLink() {
    const url = `${window.location.origin}/r/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  if (error) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-red-400">{error}</div></AppShell>;
  if (!report) return <AppShell><PageLoader /></AppShell>;

  if (report.status === "failed") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 text-2xl">!</div>
          <h1 className="text-lg font-semibold mb-2">Scan failed</h1>
          <p className="text-slate-400 text-sm mb-6">This scan could not be completed. You can run the scan again.</p>
          <button onClick={() => router.push("/dashboard")} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 transition">
            Back to dashboard
          </button>
        </div>
      </AppShell>
    );
  }

  if (report.status === "pending") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium">Analyzing your business...</p>
          <p className="text-slate-500 text-sm mt-1">This may take a few seconds</p>
        </div>
      </AppShell>
    );
  }

  const r = displayResult || report.result || {};
  const score = report.readiness_score ?? 0;
  const ring = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171";
  const impactColor = (x) =>
    x === "high" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : x === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-white/5 text-slate-400 border-white/10";

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-end items-center gap-3">
            {translating && (
              <span className="text-xs text-indigo-400 flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></span>
                Translating...
              </span>
            )}
            <button onClick={handleShare}
              className={`text-sm rounded-lg px-4 py-2 border transition ${shared ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-white/10 text-slate-200 border-white/10 hover:bg-white/20"}`}>
              {shared ? "✓ Sharing on" : "Share"}
            </button>
            <button onClick={downloadPdf} className="text-sm bg-white/10 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/20 transition">
              Download PDF
            </button>
          </div>

          {/* share link */}
          {shared && shareToken && (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1">Anyone with this link can view this report (no login needed)</p>
                <code className="text-xs text-indigo-300 break-all">{`${typeof window !== "undefined" ? window.location.origin : ""}/r/${shareToken}`}</code>
              </div>
              <button onClick={copyLink}
                className="text-xs bg-white/10 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/20 transition whitespace-nowrap shrink-0">
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          )}
        </div>

        {/* score card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full flex items-center justify-center shrink-0"
               style={{ background: `conic-gradient(${ring} ${score * 3.6}deg, rgba(255,255,255,0.06) 0deg)` }}>
            <div className="w-24 h-24 bg-[#0a0a0f] rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold">AI Readiness Score</h1>
              {r.maturity_level && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                  {r.maturity_level}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">{r.summary}</p>
          </div>
        </div>

        {/* savings + roi */}
        <div className="grid sm:grid-cols-2 gap-4">
          {r.savings_estimate?.monthly_inr != null && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Estimated Monthly Savings</h2>
              <p className="text-3xl font-bold text-emerald-400 mb-2">
                ₹{Number(r.savings_estimate.monthly_inr).toLocaleString("en-IN")}
                <span className="text-sm text-slate-500 font-normal"> / mo</span>
              </p>
              <p className="text-slate-400 text-sm">{r.savings_estimate.rationale}</p>
            </div>
          )}
          {r.estimated_roi?.percentage != null && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Estimated ROI</h2>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                {r.estimated_roi.percentage}%
                <span className="text-sm text-slate-500 font-normal"> annual</span>
              </p>
              <p className="text-slate-400 text-sm">{r.estimated_roi.rationale}</p>
            </div>
          )}
        </div>

        {/* opportunities — with Generate Blueprint button */}
        {r.opportunity_matrix?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Opportunities</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {r.opportunity_matrix.map((op, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition flex flex-col">
                  <h3 className="font-medium mb-2">{op.area}</h3>
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${impactColor(op.impact)}`}>Impact: {op.impact}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-white/5 text-slate-400 border-white/10">Effort: {op.effort}</span>
                  </div>
                  <p className="text-sm text-slate-400 flex-1">{op.description}</p>
                  {(() => {
                    const existing = blueprints.find((b) => b.opportunity_area === op.area);
                    if (existing) {
                      return (
                        <button
                          onClick={() => router.push(`/blueprint/${existing.id}`)}
                          className="mt-4 text-sm bg-white/10 border border-white/10 rounded-lg px-3 py-2 font-medium hover:bg-white/20 transition"
                        >
                          View Blueprint →
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => handleBlueprint(op, i)}
                        disabled={generating === i}
                        className="mt-4 text-sm bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-3 py-2 font-medium hover:opacity-90 disabled:opacity-50 transition"
                      >
                        {generating === i ? "Generating blueprint..." : "Generate Blueprint →"}
                      </button>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* recommendations */}
        {r.recommendations?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
            <ol className="space-y-3">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs rounded-full flex items-center justify-center">{i + 1}</span>
                  <p className="text-sm text-slate-300">{rec}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
        {/* Transformation Roadmap */}
        {r.roadmap?.phases?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold">Transformation Roadmap</h2>
              <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5">™</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">Your step-by-step path to becoming AI-ready — in the right order for your business.</p>
            {/* Transformation Timeline — horizontal journey */}
            <div className="bg-gradient-to-r from-indigo-500/[0.06] to-violet-500/[0.06] border border-white/10 rounded-2xl p-5 mb-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 min-w-[520px]">
                {/* start */}
                <div className="text-center shrink-0 w-24">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 text-sm">📍</div>
                  <p className="text-xs font-medium text-slate-300">Today</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Score {score}</p>
                </div>

                {r.roadmap.phases.map((ph, i) => {
                  const targets = [55, 72, 88];  // har phase ke baad approx maturity
                  const target = score < targets[i] ? targets[i] : Math.min(95, score + (i + 1) * 8);
                  const last = i === r.roadmap.phases.length - 1;
                  return (
                    <div key={i} className="flex items-center flex-1 min-w-0">
                      {/* connector */}
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-indigo-500/40 to-violet-500/40 min-w-[20px]" />
                      {/* node */}
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
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/40 to-transparent" />

              <div className="space-y-6">
                {r.roadmap.phases.map((ph, i) => (
                  <div key={i} className="relative pl-11">
                    {/* dot */}
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/25">
                      {ph.phase || i + 1}
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold">{ph.title}</h3>
                        {ph.duration && (
                          <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 shrink-0">
                            {ph.duration}
                          </span>
                        )}
                      </div>

                      {ph.focus && <p className="text-sm text-slate-400 mb-3">{ph.focus}</p>}

                      {ph.actions?.length > 0 && (
                        <ul className="space-y-1.5 mb-3">
                          {ph.actions.map((a, j) => (
                            <li key={j} className="flex gap-2 text-sm text-slate-300">
                              <span className="text-indigo-400 shrink-0">→</span>
                              <span>{a}</span>
                            </li>
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

        <StarRating targetType="report" targetId={id} />
      </div>
    </AppShell>
  );
}