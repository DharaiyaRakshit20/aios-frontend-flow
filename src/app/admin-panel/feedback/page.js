"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getAdminFeedback } from "@/lib/api";
import AdminShell from "../../components/AdminShell";
import PageLoader from "../components/PageLoader";

export default function AdminFeedback() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAdminFeedback().then(setData).catch((e) => setError(e.message));
  }, [router]);

  if (error) return <AdminShell><div className="max-w-4xl mx-auto px-4 py-10 text-red-400">{error}</div></AdminShell>;
  if (!data) return <AdminShell><PageLoader /></AdminShell>;

  const cards = [
    { label: "Avg Rating", value: data.avg_rating != null ? `${data.avg_rating} ★` : "—" },
    { label: "Ratings", value: data.rating_count },
    { label: "👍 Helpful", value: data.thumbs_up },
    { label: "👎 Not helpful", value: data.thumbs_down },
  ];

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Feedback</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Recent</h2>
          {data.items.map((f) => (
            <div key={f.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex justify-between items-center gap-3">
              <div className="min-w-0">
                <p className="text-sm">
                  {f.kind === "rating" ? `${f.rating} ★` : (f.thumb === "up" ? "👍" : "👎")}
                  <span className="text-slate-500"> · {f.target_type}</span>
                </p>
                {f.comment && <p className="text-xs text-slate-400 mt-1">{f.comment}</p>}
                <p className="text-xs text-slate-600 mt-1">{f.user_email || "anon"} · {new Date(f.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {data.items.length === 0 && <p className="text-slate-500 text-sm">No feedback yet.</p>}
        </div>
      </div>
    </AdminShell>
  );
}

