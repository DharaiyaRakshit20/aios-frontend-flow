"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout, getOrganizations, createOrganization, getReports } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [orgs, setOrgs] = useState([]);
  const [reports, setReports] = useState([]);
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
      const [o, r] = await Promise.all([getOrganizations(), getReports()]);
      setOrgs(o);
      setReports(r);
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
    if (s >= 70) return "text-green-600";
    if (s >= 40) return "text-amber-600";
    return "text-red-600";
  }

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">AIOS Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/activity")}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Activity
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>}

        {/* organizations */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Your Organizations</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {orgs.map((org) => (
              <div key={org.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">{org.name}</p>
                  <p className="text-sm text-slate-500">{org.industry || "—"}</p>
                </div>
                <button
                  onClick={() => router.push(`/scan?org=${org.id}`)}
                  className="bg-slate-900 text-white text-sm rounded-lg px-3 py-1.5 hover:bg-slate-700"
                >
                  New Scan
                </button>
              </div>
            ))}
            {orgs.length === 0 && <p className="text-slate-500 text-sm">No organizations yet. Create one below.</p>}
          </div>

          {/* create org */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2 items-center">
            <input
              className="flex-1 min-w-[140px] border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="Company name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="flex-1 min-w-[140px] border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="Industry (optional)"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
            />
            <button onClick={handleCreateOrg} className="bg-slate-900 text-white rounded-lg px-4 py-2 hover:bg-slate-700">
              Add
            </button>
          </div>
        </section>

        {/* reports */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Past Scans</h2>
          <div className="space-y-2">
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => router.push(`/report/${rep.id}`)}
                className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-slate-400"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {rep.result?.summary?.slice(0, 60) || `Report #${rep.id}`}...
                  </p>
                  <p className="text-sm text-slate-500">{new Date(rep.created_at).toLocaleString()}</p>
                </div>
                <div className={`text-2xl font-bold ${scoreColor(rep.readiness_score)}`}>
                  {rep.readiness_score ?? "—"}
                </div>
              </div>
            ))}
            {reports.length === 0 && <p className="text-slate-500 text-sm">No scans yet. Run your first scan above.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}