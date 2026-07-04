"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getAuditLogs } from "@/lib/api";
import AppShell from "../components/AppShell";

export default function ActivityPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAuditLogs().then((data) => setLogs(data.results || data))
      .catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [router]);

  function actionInfo(a) {
    const map = {
      "user.register": { label: "Account created", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
      "user.login": { label: "Logged in", color: "bg-white/5 text-slate-400 border-white/10" },
      "org.create": { label: "Organization created", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
      "scan.run": { label: "Business scan run", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    };
    return map[a] || { label: a, color: "bg-white/5 text-slate-400 border-white/10" };
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-500">Loading activity...</div>;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/5">
          {logs.map((log) => {
            const info = actionInfo(log.action);
            return (
              <div key={log.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${info.color}`}>{info.label}</span>
                  <span className="text-sm text-slate-500 truncate">{log.detail}</span>
                </div>
                <span className="text-xs text-slate-600 shrink-0">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            );
          })}
          {logs.length === 0 && <p className="p-6 text-slate-500 text-sm text-center">No activity yet.</p>}
        </div>
      </div>
    </AppShell>
  );
}