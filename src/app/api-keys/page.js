"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getApiKeys, createApiKey, revokeApiKey } from "@/lib/api";
import AppShell from "../components/AppShell";

export default function ApiKeysPage() {
  const router = useRouter();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState(null); // freshly created raw key (ek baar dikhta)
  const [copied, setCopied] = useState(false);

  function load() {
    getApiKeys().then((d) => setKeys(d.results || d)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    load();
  }, [router]);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true); setError("");
    try {
      const res = await createApiKey(newName.trim());
      setNewKey(res.key);       // raw key (sirf abhi milegi)
      setNewName("");
      load();
    } catch (e) { setError(e.message); }
    finally { setCreating(false); }
  }

  async function handleRevoke(id) {
    try { await revokeApiKey(id); setKeys((k) => k.filter((x) => x.id !== id)); }
    catch (e) { setError(e.message); }
  }

  function copyKey() {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  if (loading) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading...</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-slate-400 text-sm mt-1">Use these to access Qevora from your own apps and scripts.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

        {/* newly created key — ek baar dikhta */}
        {newKey && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
            <p className="text-sm font-medium text-emerald-400 mb-2">Your new API key</p>
            <p className="text-xs text-slate-400 mb-3">Copy it now — you won&apos;t be able to see it again.</p>
            <div className="flex gap-2">
              <code className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-emerald-300 break-all">{newKey}</code>
              <button onClick={copyKey} className="bg-white/10 border border-white/10 rounded-lg px-4 text-sm hover:bg-white/20 transition whitespace-nowrap">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* create */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <p className="text-sm font-medium mb-3">Create a new key</p>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              placeholder="Key name (e.g. My integration)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            />
            <button onClick={handleCreate} disabled={creating}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition whitespace-nowrap">
              {creating ? "Creating..." : "Generate key"}
            </button>
          </div>
        </div>

        {/* list */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {keys.length === 0 ? (
            <p className="px-4 py-8 text-center text-slate-500 text-sm">No API keys yet.</p>
          ) : keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
              <div className="min-w-0">
                <p className="text-sm font-medium">{k.name}</p>
                <p className="text-xs text-slate-500">
                  <code>{k.prefix}••••••</code> · {k.last_used ? `Last used ${new Date(k.last_used).toLocaleDateString()}` : "Never used"}
                </p>
              </div>
              <button onClick={() => handleRevoke(k.id)} className="text-slate-600 hover:text-red-400 text-sm">Revoke</button>
            </div>
          ))}
        </div>

        {/* usage example */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <p className="text-sm font-medium mb-3">How to use</p>
          <p className="text-xs text-slate-400 mb-3">Include your key in the Authorization header:</p>
          <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">
{`curl ${apiUrl}/api/scanner/reports \\
  -H "Authorization: Api-Key qev_your_key_here"`}
          </pre>
        </div>
      </div>
    </AppShell>
  );
}