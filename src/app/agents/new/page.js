"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken, getOrganizations, createAgent } from "@/lib/api";
import AppShell from "../../components/AppShell";
import Dropdown from "../../components/Dropdown";

function NewAgentForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({
    organization: params.get("org") || "",
    name: params.get("name") || "",
    role: params.get("role") || "",
    description: params.get("description") || "",
    instructions: params.get("instructions") || "",
    knowledge: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getOrganizations().then((d) => {
      setOrgs(d);
      if (!form.organization && d.length) setForm((f) => ({ ...f, organization: String(d[0].id) }));
    }).catch(() => {});
  }, [router]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSave() {
    setError("");
    if (!form.name || !form.role || !form.instructions || !form.organization) {
      setError("Please fill name, role, instructions, and select an organization.");
      return;
    }
    setSaving(true);
    try {
      const agent = await createAgent({ ...form, organization: parseInt(form.organization) });
      router.push(`/agents/${agent.id}`);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <button onClick={() => router.push("/agents")} className="text-sm text-slate-400 hover:text-white transition">← Back to agents</button>
      <h1 className="text-2xl font-bold">New AI Agent</h1>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
        <Dropdown
          label="Organization"
          value={orgs.find((o) => String(o.id) === String(form.organization))?.name || ""}
          onChange={(v) => { const o = orgs.find((x) => x.name === v); if (o) set("organization", String(o.id)); }}
          options={orgs.map((o) => o.name)}
        />
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Agent name</label>
          <input className={input} placeholder="e.g. Support Assistant" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Role</label>
          <input className={input} placeholder="e.g. Customer Support Agent" value={form.role} onChange={(e) => set("role", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Description <span className="text-slate-600">(optional)</span></label>
          <input className={input} placeholder="What does this agent do?" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Instructions</label>
          <textarea className={`${input} min-h-[100px] resize-none`} placeholder="How should the agent behave? e.g. 'Answer customer questions politely, keep replies short, always offer further help.'" value={form.instructions} onChange={(e) => set("instructions", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Business knowledge <span className="text-slate-600">(optional)</span></label>
          <textarea className={`${input} min-h-[100px] resize-none`} placeholder="Any info the agent should know: products, prices, policies, hours..." value={form.knowledge} onChange={(e) => set("knowledge", e.target.value)} />
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition">
          {saving ? "Creating..." : "Create Agent"}
        </button>
      </div>
    </div>
  );
}

export default function NewAgentPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-10 text-slate-500">Loading...</div>}>
        <NewAgentForm />
      </Suspense>
    </AppShell>
  );
}