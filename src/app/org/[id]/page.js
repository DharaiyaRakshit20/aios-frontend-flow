"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken, getOrganizations, updateOrganization, deleteOrganization } from "@/lib/api";
import AppShell from "../../components/AppShell";

export default function OrgSettings() {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getOrganizations().then((orgs) => {
      const org = orgs.find((o) => String(o.id) === String(id));
      if (!org) { setError("Organization not found"); return; }
      setName(org.name); setIndustry(org.industry || "");
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id, router]);

  async function handleSave() {
    setSaving(true); setError("");
    try { await updateOrganization(id, name, industry); router.push("/dashboard"); }
    catch (e) { setError(e.message); } finally { setSaving(false); }
  }
  async function handleDelete() {
    try { await deleteOrganization(id); router.push("/dashboard"); }
    catch (e) { setError(e.message); }
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <AppShell>
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Organization Settings</h1>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Company name</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Industry</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition"
              value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="bg-white/[0.03] border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h2>
          <p className="text-slate-500 text-sm mb-4">Deleting an organization removes it and all its scans permanently.</p>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm hover:bg-red-500/10 transition">
              Delete organization
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300">Are you sure?</span>
              <button onClick={handleDelete} className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-red-700 transition">Yes, delete</button>
              <button onClick={() => setConfirmDelete(false)} className="text-slate-500 text-sm">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}