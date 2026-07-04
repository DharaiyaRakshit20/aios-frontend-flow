"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getProfile, updateProfile } from "@/lib/api";
import AppShell from "../components/AppShell";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getProfile().then((u) => { setEmail(u.email); setFullName(u.full_name || ""); })
      .catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [router]);

  async function handleSave() {
    setSaving(true); setError(""); setSaved(false);
    try { await updateProfile(fullName); setSaved(true); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <AppShell>
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}
        {saved && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg p-3">Profile updated successfully.</div>}

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl font-bold">
              {(fullName || email || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{fullName || "No name set"}</p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              value={fullName} onChange={(e) => { setFullName(e.target.value); setSaved(false); }} />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <input className="w-full bg-white/[0.02] border border-white/5 rounded-lg px-3.5 py-2.5 text-slate-500" value={email} disabled />
            <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}