"use client";
import { useEffect } from "react";

export default function ConfirmModal({
  open, onClose, onConfirm, loading = false,
  title = "Are you sure?", message = "",
  confirmLabel = "Delete", cancelLabel = "Cancel",
}) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape" && !loading) onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !loading && onClose()} />
      <div className="relative bg-[#12121a] border border-white/10 rounded-2xl shadow-xl shadow-black/50 w-full max-w-sm p-6">
        <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
        {message && <p className="text-sm text-slate-400 mb-6">{message}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} disabled={loading}
            className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 disabled:opacity-40 transition">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="text-sm bg-red-500/90 hover:bg-red-500 rounded-lg px-4 py-2 font-medium disabled:opacity-40 transition">
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
