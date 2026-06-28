"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken, getReport } from "@/lib/api";

export default function ReportPage() {
  const router = useRouter();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getReport(id).then(setReport).catch((e) => setError(e.message));
  }, [id, router]);

  function downloadPdf() {
    const token = localStorage.getItem("aios_token");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/scanner/reports/${id}/pdf`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `aios-report-${id}.pdf`;
        link.click();
      });
  }

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!report) return <div className="p-8 text-slate-500">Loading report...</div>;

  const r = report.result || {};
  const score = report.readiness_score ?? 0;

  const ring = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const impactColor = (x) =>
    x === "high" ? "bg-green-100 text-green-700"
    : x === "medium" ? "bg-amber-100 text-amber-700"
    : "bg-slate-100 text-slate-600";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500">← Back to dashboard</button>
          <button
            onClick={downloadPdf}
            className="text-sm bg-slate-900 text-white rounded-lg px-4 py-2 hover:bg-slate-700"
          >
            Download PDF
          </button>
        </div>

        {/* score card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `conic-gradient(${ring} ${score * 3.6}deg, #e2e8f0 0deg)` }}
          >
            <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{score}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-1">AI Readiness Score</h1>
            <p className="text-slate-600 text-sm">{r.summary}</p>
          </div>
        </div>

        {/* savings */}
        {r.savings_estimate?.monthly_usd != null && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Estimated Monthly Savings</h2>
            <p className="text-3xl font-bold text-green-600 mb-2">
              ${Number(r.savings_estimate.monthly_usd).toLocaleString()}
              <span className="text-base text-slate-400 font-normal"> / month</span>
            </p>
            <p className="text-slate-600 text-sm">{r.savings_estimate.rationale}</p>
          </div>
        )}

        {/* opportunity matrix */}
        {r.opportunity_matrix?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Opportunities</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {r.opportunity_matrix.map((op, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{op.area}</h3>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${impactColor(op.impact)}`}>
                      Impact: {op.impact}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Effort: {op.effort}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{op.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* recommendations */}
        {r.recommendations?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Recommendations</h2>
            <ol className="space-y-3">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-slate-900 text-white text-xs rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700">{rec}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}