"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getOrganizations, createOrganization } from "@/lib/api";
import AppShell from "../components/AppShell";
import PageLoader from "../components/PageLoader";

export default function OrganizationsPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [orgAdded, setOrgAdded] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    load();
  }, [router]);

  async function load() {
    try {
      const o = await getOrganizations();
      setOrgs(o);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleCreateOrg() {
    if (!newName.trim()) { setError("Please enter a company name."); return; }
    setError("");
    try {
      await createOrganization(newName.trim(), newIndustry.trim());
      setNewName(""); setNewIndustry("");
      setOrgAdded(true);
      setTimeout(() => setOrgAdded(false), 2500);
      load();
    } catch (e) { setError(e.message); }
  }

  const filtered = orgs.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (o.name || "").toLowerCase().includes(q) || (o.industry || "").toLowerCase().includes(q);
  });

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-slate-400 text-sm mt-1">All the businesses you scan and manage with Qevora.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}
        {orgAdded && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg p-3">Organization added ✓</div>}

        {/* add new */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
          <p className="text-sm font-medium mb-3">Add a new organization</p>
          <div className="flex flex-wrap gap-2">
            <input
              className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              placeholder="Company name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateOrg(); }}
            />
            <input
              className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              placeholder="Industry (optional)"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateOrg(); }}
            />
            <button onClick={handleCreateOrg} disabled={!newName.trim()}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-40 transition">
              Add
            </button>
          </div>
        </div>

        {/* search */}
        {orgs.length > 0 && (
          <div className="flex justify-between items-center gap-3">
            <p className="text-sm text-slate-500">{filtered.length} of {orgs.length}</p>
            <input
              className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* table */}
        {loading ? <PageLoader /> : (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 text-xs text-slate-500 uppercase tracking-wide border-b border-white/5">
              <span className="col-span-5">Name</span>
              <span className="col-span-4">Industry</span>
              <span className="col-span-3"></span>
            </div>
            {filtered.map((org) => (
              <div key={org.id} className="grid sm:grid-cols-12 gap-2 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition items-center">
                <p className="sm:col-span-5 font-medium truncate">{org.name}</p>
                <p className="sm:col-span-4 text-sm text-slate-500 truncate">{org.industry || "—"}</p>
                <div className="sm:col-span-3 flex gap-2 sm:justify-end">
                  <button onClick={() => router.push(`/org/${org.id}`)}
                    className="border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-1.5 hover:bg-white/5 transition">
                    Settings
                  </button>
                  <button onClick={() => router.push(`/scan?org=${org.id}`)}
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 text-sm rounded-lg px-3 py-1.5 hover:opacity-90 transition">
                    New Scan
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-10 text-center text-slate-500 text-sm">
                {orgs.length === 0 ? "No organizations yet. Add your first one above." : "No organizations match your search."}
              </p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
