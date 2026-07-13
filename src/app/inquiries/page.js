"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getInquiries, updateInquiryStatus, deleteInquiry } from "@/lib/api";
import AppShell from "../components/AppShell";

const TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "completed", label: "Completed" },
];

const STATUS_STYLE = {
  new: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  contacted: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function InquiriesPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    load();
  }, [router]);

  async function load() {
    setLoading(true);
    try {
      const data = await getInquiries();
      setItems(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function changeStatus(inq, status) {
    setItems((list) => list.map((i) => (i.id === inq.id ? { ...i, status } : i)));
    try { await updateInquiryStatus(inq.id, status); }
    catch (e) { setError(e.message); load(); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteInquiry(deleteTarget.id);
      setItems((list) => list.filter((i) => i.id !== deleteTarget.id));
    } catch (e) { setError(e.message); }
    finally { setDeleteTarget(null); }
  }

  const counts = {
    all: items.length,
    new: items.filter((i) => i.status === "new").length,
    contacted: items.filter((i) => i.status === "contacted").length,
    completed: items.filter((i) => i.status === "completed").length,
  };

  const filtered = items.filter((i) => {
    if (tab !== "all" && i.status !== tab) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return [i.customer_name, i.customer_phone, i.item, i.agent_name, i.details]
      .some((v) => (v || "").toLowerCase().includes(q));
  });

  if (loading) return <AppShell><div className="max-w-4xl mx-auto px-4 py-10 text-slate-500">Loading...</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Inquiries & Orders</h1>
          <p className="text-slate-400 text-sm mt-1">Everything your customers send through your chatbots — in one place.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

        {/* tabs + search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`text-sm rounded-lg px-3.5 py-1.5 border transition ${
                  tab === t.key ? "bg-white/10 border-white/20 text-white" : "border-white/10 text-slate-400 hover:bg-white/5"
                }`}>
                {t.label} <span className="text-slate-500">({counts[t.key]})</span>
              </button>
            ))}
          </div>
          {items.length > 0 && (
            <input
              className="w-full sm:w-56 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>

        {/* list */}
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div key={inq.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium">{inq.customer_name || "Customer"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      inq.is_order ? "bg-violet-500/10 text-violet-300 border-violet-500/20" : "bg-white/5 text-slate-400 border-white/10"
                    }`}>
                      {inq.is_order ? "Order" : "Inquiry"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLE[inq.status]}`}>
                      {inq.status}
                    </span>
                  </div>
                  {inq.item && (
                    <p className="text-sm text-slate-200">
                      {inq.item}{inq.quantity ? <span className="text-slate-400"> × {inq.quantity}</span> : null}
                    </p>
                  )}
                  {inq.details && <p className="text-sm text-slate-400 mt-1">{inq.details}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                    {inq.customer_phone && <span>📞 {inq.customer_phone}</span>}
                    {inq.customer_email && <span>✉ {inq.customer_email}</span>}
                    <span>via {inq.agent_name}</span>
                    <span>{new Date(inq.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setDeleteTarget(inq)} className="text-slate-600 hover:text-red-400 transition shrink-0">✕</button>
              </div>

              <div className="flex gap-2 mt-4">
                {["new", "contacted", "completed"].map((s) => (
                  <button key={s} onClick={() => changeStatus(inq, s)}
                    disabled={inq.status === s}
                    className={`text-xs rounded-lg px-3 py-1.5 border transition ${
                      inq.status === s ? "bg-white/10 border-white/20 text-white cursor-default" : "border-white/10 text-slate-400 hover:bg-white/5"
                    }`}>
                    {s === "new" ? "Mark New" : s === "contacted" ? "Mark Contacted" : "Mark Completed"}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              {items.length === 0
                ? "No inquiries yet. When customers chat with your live agents, their orders and inquiries will appear here."
                : "No inquiries match this filter."}
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Delete this entry?</h3>
            <p className="text-slate-400 text-sm mb-6">This inquiry will be permanently removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

