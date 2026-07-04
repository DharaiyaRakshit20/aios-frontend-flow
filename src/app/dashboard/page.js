"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout, getOrganizations, createOrganization, getReports, getDashboardStats } from "@/lib/api";
import AppShell from "../components/AppShell";

export default function Dashboard() {
  const router = useRouter();
  const [orgs, setOrgs] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [newName, setNewName] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    loadData();
  }, [router]);

  async function loadData() {
    try {
      const [o, r, s] = await Promise.all([getOrganizations(), getReports(), getDashboardStats()]);
      setOrgs(o);
      setReports(r);
      setStats(s);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrg() {
    if (!newName) return;
    try {
      await createOrganization(newName, newIndustry);
      setNewName(""); setNewIndustry("");
      loadData();
    } catch (e) { setError(e.message); }
  }

  function scoreColor(s) {
    if (s >= 70) return "text-emerald-400";
    if (s >= 40) return "text-amber-400";
    return s != null ? "text-red-400" : "text-slate-600";
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-500">Loading...</div>;

  return (
      <AppShell>
        <div className="min-h-screen w-full bg-[#0a0a0f] text-white">
          {/* header */}
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
              {/* yahan content waisa hi rehne do — error, metrics, orgs, reports sab */}
            </div>
          

          <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

            {/* metrics */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: "Organizations", value: stats.organizations },
                  { label: "Total Scans", value: stats.total_scans },
                  { label: "Avg AI Score", value: stats.average_score },
                  { label: "Annual Saving", value: `$${Number(stats.estimated_annual_saving).toLocaleString()}` },
                  { label: "Reports", value: stats.reports_generated },
                ].map((m, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition">
                    <p className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{m.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* organizations */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Your Organizations</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {orgs.map((org) => (
                  <div key={org.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:border-white/20 transition">
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-slate-500">{org.industry || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2">
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
                ))}
                {orgs.length === 0 && (
                  <p className="text-slate-500 text-sm col-span-2">No organizations yet. Create one below.</p>
                )}
              </div>

              {/* create org */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-wrap gap-2 items-center">
                <input
                  className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                  placeholder="Company name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <input
                  className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                  placeholder="Industry (optional)"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                />
                <button onClick={handleCreateOrg} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 transition">
                  Add
                </button>
              </div>
            </section>

            {/* reports */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Past Scans</h2>
              <div className="space-y-2">
                {reports.map((rep) => {
                  const statusInfo = {
                    done: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                    pending: { label: "Processing", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                    failed: { label: "Failed", color: "bg-red-500/10 text-red-400 border-red-500/20" },
                  }[rep.status] || { label: rep.status, color: "bg-white/5 text-slate-400 border-white/10" };

                  return (
                    <div
                      key={rep.id}
                      onClick={() => router.push(`/report/${rep.id}`)}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:border-indigo-500/30 transition"
                    >
                      <div className="min-w-0">
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
                      <div className={`text-2xl font-bold shrink-0 ${scoreColor(rep.readiness_score)}`}>
                        {rep.readiness_score ?? "—"}
                      </div>
                    </div>
                  );
                })}
                {reports.length === 0 && (
                  <p className="text-slate-500 text-sm">No scans yet. Run your first scan above.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </AppShell>
  );
}