"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getToken, getOrganizations, updateOrganization, deleteOrganization, getMyRole,
  getOrgMembers, addOrgMember, removeOrgMember,
} from "@/lib/api";
import AppShell from "../../components/AppShell";
import PageLoader from "../../components/PageLoader";

export default function OrgSettings() {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [members, setMembers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [memberMsg, setMemberMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function loadMembers() {
    getOrgMembers(id).then(setMembers).catch(() => {});
  }

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getOrganizations().then((orgs) => {
      const org = orgs.find((o) => String(o.id) === String(id));
      if (!org) { setError("Organization not found"); return; }
      setName(org.name); setIndustry(org.industry || "");
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
    getMyRole(id).then((d) => setRole(d.role)).catch(() => {});
    loadMembers();
  }, [id, router]);

  const isAdmin = role === "admin";

  async function handleSave() {
    setSaving(true); setError("");
    try { await updateOrganization(id, name, industry); router.push("/dashboard"); }
    catch (e) { setError(e.message); } finally { setSaving(false); }
  }
  async function handleDelete() {
    try { await deleteOrganization(id); router.push("/dashboard"); }
    catch (e) { setError(e.message); setConfirmDelete(false); }
  }

  async function handleAddMember() {
    setMemberMsg("");
    if (!newEmail.trim()) return;
    try {
      await addOrgMember(id, newEmail.trim().toLowerCase(), "member");
      setNewEmail("");
      setMemberMsg("Member added successfully.");
      loadMembers();
    } catch (e) { setMemberMsg(e.message); }
  }

  async function handleRemove(membershipId) {
    try { await removeOrgMember(id, membershipId); loadMembers(); }
    catch (e) { setMemberMsg(e.message); }
  }

  if (loading) return <AppShell><PageLoader /></AppShell>;

  return (
    <AppShell>
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Organization Settings</h1>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

        {!isAdmin && role && (
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-slate-400">
            You are a <span className="text-white">member</span> of this organization. Only admins can manage it.
          </div>
        )}

        {/* org details */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Company name</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
              value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Industry</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
              value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={!isAdmin} />
          </div>
          {isAdmin && (
            <button onClick={handleSave} disabled={saving}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition">
              {saving ? "Saving..." : "Save changes"}
            </button>
          )}
        </div>

        {/* team members */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Team Members</h2>
          <p className="text-slate-500 text-sm mb-4">People who can access this organization.</p>

          {memberMsg && <div className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg p-3 mb-4">{memberMsg}</div>}

          <div className="space-y-2 mb-4">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold shrink-0">
                    {(m.full_name || m.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm truncate">{m.full_name || m.email}</p>
                    <p className="text-xs text-slate-500 truncate">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === "admin" ? "bg-indigo-500/10 text-indigo-400" : "bg-white/5 text-slate-400"}`}>
                    {m.role}
                  </span>
                  {isAdmin && m.role !== "admin" && (
                    <button onClick={() => handleRemove(m.id)} className="text-slate-600 hover:text-red-400 text-sm">✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                placeholder="member@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddMember(); }}
              />
              <button onClick={handleAddMember} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition whitespace-nowrap">
                Add member
              </button>
            </div>
          )}
          {isAdmin && <p className="text-xs text-slate-600 mt-2">The person must have a Qevora account already.</p>}
        </div>

        {/* danger zone */}
        {isAdmin && (
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
        )}
      </div>
    </AppShell>
  );
}