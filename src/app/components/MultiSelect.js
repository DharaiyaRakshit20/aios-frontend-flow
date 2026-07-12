"use client";
import { useState, useRef, useEffect } from "react";

export default function MultiSelect({ label, values, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const [otherText, setOtherText] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // values ko hamesha array banao (safety — string aaye to bhi na toote)
  const selected = Array.isArray(values)
    ? values
    : (typeof values === "string" && values.trim())
      ? values.split(",").map((x) => x.trim()).filter(Boolean)
      : [];

  function toggle(opt) {
    if (selected.includes(opt)) {
      onChange(selected.filter((x) => x !== opt));
    } else {
      onChange([...selected, opt]);
    }
  }

  function addOther() {
    const t = otherText.trim();
    if (t && !selected.includes(t)) {
      onChange([...selected, t]);
      setOtherText("");
    }
  }

  function removeChip(val) {
    onChange(selected.filter((x) => x !== val));
  }

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm text-slate-400 mb-1.5">{label}</label>}

      {/* selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-full px-2.5 py-1">
              {v}
              <button type="button" onMouseDown={(e) => { e.preventDefault(); removeChip(v); }} className="hover:text-white">✕</button>
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-left focus:border-indigo-500 focus:outline-none transition hover:bg-white/[0.07]"
      >
        <span className={selected.length ? "text-white" : "text-slate-500"}>
          {selected.length ? `${selected.length} selected` : placeholder}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-[#12121a] border border-white/10 rounded-lg overflow-hidden shadow-xl shadow-black/50 max-h-72 overflow-y-auto">
          {options.map((o) => {
            const checked = selected.includes(o);
            return (
              <button
                key={o}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); toggle(o); }}
                className={`w-full flex items-center gap-2 text-left px-3.5 py-2.5 text-sm transition ${checked ? "bg-indigo-500/10 text-indigo-300" : "text-slate-300 hover:bg-white/5"}`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${checked ? "bg-indigo-500 border-indigo-500 text-white" : "border-white/20"}`}>
                  {checked ? "✓" : ""}
                </span>
                {o}
              </button>
            );
          })}

          {/* Other input */}
          <div className="border-t border-white/5 p-2 flex gap-2">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Other (type & add)"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOther(); } }}
            />
            <button type="button" onMouseDown={(e) => { e.preventDefault(); addOther(); }}
              className="text-xs bg-indigo-500/20 text-indigo-300 rounded-md px-3 hover:bg-indigo-500/30 transition">
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}