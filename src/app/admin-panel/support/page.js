"use client";
import { useState, useEffect } from "react";
import AdminShell from "../../components/AdminShell";
import { getSupportMessages, toggleSupport } from "@/lib/api";

export default function AdminSupportPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); setError("");
    try {
      setData(await getSupportMessages());
    } catch (e) {
      setError(e.message.includes("403") ? "Access denied — admins only." : "Couldn't load messages.");
    } finally { setLoading(false); }
  }

  async function toggle(id) {
    await toggleSupport(id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Support Messages</h1>
          {data && (
            <span className="text-sm text-slate-400">
              {data.open} open · {data.count} total
            </span>
          )}
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {data && data.messages.length === 0 && (
          <p className="text-slate-500 text-sm">No messages yet.</p>
        )}

        <div className="space-y-3">
          {data?.messages.map((m) => (
            <div key={m.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <p className="font-medium">
                    {m.name || m.user_email || m.email || "Anonymous"}
                    {m.subject && <span className="text-slate-400 font-normal"> — {m.subject}</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    {m.email || m.user_email || "no email"} · {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => toggle(m.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition ${
                    m.status === "open"
                      ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}>
                  {m.status === "open" ? "Mark resolved" : "Resolved ✓"}
                </button>
              </div>
              <p className="text-sm text-slate-300 mt-3 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}