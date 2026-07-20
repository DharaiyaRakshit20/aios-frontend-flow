"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken, getAgents, deleteAgent } from "@/lib/api";
import AppShell from "../components/AppShell";
import PageLoader from "../components/PageLoader";

function AgentsList() {
  const router = useRouter();
  const params = useSearchParams();
  const orgId = params.get("org");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAgents(orgId).then((d) => setAgents(d.results || d)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [orgId, router]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteAgent(deleteTarget.id);
      setAgents((a) => a.filter((x) => x.id !== deleteTarget.id));
    } catch (err) { setError(err.message); }
    finally { setDeleteTarget(null); }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Agents</h1>
          <p className="text-slate-400 text-sm mt-1">Build and test AI agents for your business.</p>
        </div>
        <button
          onClick={() => router.push(`/agents/new${orgId ? `?org=${orgId}` : ""}`)}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          + New Agent
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        {agents.map((a) => (
          <div
            key={a.id}
            role="button"
            tabIndex={0}
            aria-label={`Open chat with ${a.name}`}
            onClick={() => router.push(`/agents/${a.id}`)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/agents/${a.id}`); } }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-indigo-500/30 transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.role}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(a); }}
                aria-label={`Delete ${a.name}`}
                className="text-slate-600 hover:text-red-400 text-sm"
              >
                ✕
              </button>
            </div>
            {a.description && <p className="text-sm text-slate-400 mt-3 line-clamp-2">{a.description}</p>}
            <p className="text-xs text-indigo-400 mt-3">Open chat →</p>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500">
            <p className="mb-3">No agents yet.</p>
            <button onClick={() => router.push(`/agents/new${orgId ? `?org=${orgId}` : ""}`)} className="text-indigo-400 hover:text-indigo-300 text-sm">Create your first agent →</button>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Delete agent?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget.name}</span>? This will remove the agent and its chat history permanently.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
              <button onClick={confirmDelete} className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <AgentsList />
      </Suspense>
    </AppShell>
  );
}