"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getAuditLogs } from "@/lib/api";

export default function ActivityPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAuditLogs()
      .then((data) => setLogs(data.results || data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  // action ko padhne-layak label + color
  function actionInfo(a) {
    const map = {
      "user.register": { label: "Account created", color: "bg-blue-100 text-blue-700" },
      "org.create": { label: "Organization created", color: "bg-purple-100 text-purple-700" },
      "scan.run": { label: "Business scan run", color: "bg-green-100 text-green-700" },
    };
    return map[a] || { label: a, color: "bg-slate-100 text-slate-600" };
  }

  if (loading) return <div className="p-8 text-slate-500">Loading activity...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500">← Back to dashboard</button>
        <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>}

        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
          {logs.map((log) => {
            const info = actionInfo(log.action);
            return (
              <div key={log.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${info.color}`}>
                    {info.label}
                  </span>
                  <span className="text-sm text-slate-500 truncate">{log.detail}</span>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            );
          })}
          {logs.length === 0 && (
            <p className="p-6 text-slate-500 text-sm text-center">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}