"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getOrganizations, getReports, getDashboardStats, deleteReport, getMyDrafts } from "@/lib/api";
import AppShell from "../components/AppShell";
import VerifyBanner from "../components/VerifyBanner";
import PageLoader from "../components/PageLoader";

export default function Dashboard() {
  const router = useRouter();
  const [orgs, setOrgs] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draftOrgs, setDraftOrgs] = useState({});
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadData() {
    try {
      const [o, r, s, d] = await Promise.all([
        getOrganizations(), getReports(), getDashboardStats(), getMyDrafts().catch(() => ({ org_ids: [] })),
      ]);
      setOrgs(o);
      setReports(r);
      setStats(s);
      const map = {};
      (d.org_ids || []).forEach((id) => { if (id) map[String(id)] = true; });
      setDraftOrgs(map);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteReport() {
    if (!deleteTarget) return;
    try {
      await deleteReport(deleteTarget.id);
      setReports((rs) => rs.filter((r) => r.id !== deleteTarget.id));
    } catch (e) { setError(e.message); }
    finally { setDeleteTarget(null); }
  }

  // search filter
  const filteredReports = reports.filter((rep) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const summary = (rep.result?.summary || "").toLowerCase();
    const org = orgs.find((o) => o.id === rep.organization)?.name?.toLowerCase() || "";
    return summary.includes(q) || org.includes(q) || `report #${rep.id}`.includes(q);
  });

  function scoreColor(s) {
    if (s >= 70) return "text-emerald-400";
    if (s >= 40) return "text-amber-400";
    return s != null ? "text-red-400" : "text-slate-600";
  }

  if (loading) return <AppShell><PageLoader /></AppShell>;

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-6xl">
        <VerifyBanner />
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

        {/* metrics */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Organizations", value: stats.organizations },
              { label: "Total Scans", value: stats.total_scans },
              { label: "Avg AI Score", value: stats.average_score },
              { label: "Annual Saving", value: `₹${Number(stats.estimated_annual_saving).toLocaleString("en-IN")}` },
              { label: "Reports", value: stats.reports_generated },
            ].map((m, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition">
                <p className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{m.value}</p>
                <p className="text-xs text-slate-500 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* organizations — sirf 2, baaki Organizations page pe */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Organizations</h2>
            <button onClick={() => router.push("/organizations")} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
              {orgs.length > 2 ? `View all (${orgs.length}) →` : "Manage →"}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {orgs.slice(0, 2).map((org) => (
              <div key={org.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition">
                <div className="flex justify-between items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{org.name}</p>
                    <p className="text-sm text-slate-500 truncate">{org.industry || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => router.push(`/org/${org.id}`)}
                      className="border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-1.5 hover:bg-white/5 transition"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => router.push(`/scan?org=${org.id}`)}
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 text-sm rounded-lg px-3 py-1.5 hover:opacity-90 transition"
                    >
                      New Scan
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {orgs.length === 0 && (
              <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
                <p className="text-slate-400 text-sm mb-3">No organizations yet.</p>
                <button onClick={() => router.push("/organizations")} className="text-indigo-400 hover:text-indigo-300 text-sm">
                  Add your first organization →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* reports */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">Past Scans</h2>
            {reports.length > 0 && (
              <input
                className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                placeholder="Search scans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
          </div>
          <div className="space-y-2">
            {filteredReports.map((rep) => {
              const statusInfo = {
                done: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                pending: { label: "Processing", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                failed: { label: "Failed", color: "bg-red-500/10 text-red-400 border-red-500/20" },
              }[rep.status] || { label: rep.status, color: "bg-white/5 text-slate-400 border-white/10" };

              return (
                <div
                  key={rep.id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex justify-between items-center hover:border-indigo-500/30 transition"
                >
                  <div
                    onClick={() => router.push(`/report/${rep.id}`)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <p className="font-medium truncate">
                      {rep.result?.summary?.slice(0, 60) || `Report #${rep.id}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-sm text-slate-500">{new Date(rep.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={rep.status === "done" ? `text-2xl font-bold ${scoreColor(rep.readiness_score)}` : ""}>
                      {rep.status === "done" ? (
                        <span className="font-semibold">{rep.readiness_score}</span>
                      ) : rep.status === "failed" ? (
                        <span className="text-xs text-red-400">Failed</span>
                      ) : (
                        <span className="text-xs text-amber-400 flex items-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                          Generating…
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(rep); }}
                      className="text-slate-600 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
            {reports.length === 0 && (
              <p className="text-slate-500 text-sm">No scans yet. Run your first scan from an organization above.</p>
            )}
            {reports.length > 0 && filteredReports.length === 0 && (
              <p className="text-slate-500 text-sm">No scans match your search.</p>
            )}
          </div>
        </section>

        {/* drafts */}
        {Object.keys(draftOrgs).length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Drafts in Progress</h2>
            <div className="space-y-2">
              {orgs.filter((org) => draftOrgs[String(org.id)]).map((org) => (
                <div
                  key={org.id}
                  onClick={() => router.push(`/scan?org=${org.id}`)}
                  className="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-amber-500/[0.08] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    <div>
                      <p className="font-medium text-sm">{org.name}</p>
                      <p className="text-xs text-slate-500">Unfinished scan — click to resume</p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400">Resume →</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Delete this scan?</h3>
            <p className="text-slate-400 text-sm mb-6">This report will be permanently removed. This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
              <button onClick={handleDeleteReport} className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
