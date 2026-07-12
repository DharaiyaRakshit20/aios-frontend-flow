"use client";
import { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, value, onChange, options, placeholder = "Select...", allowOther = false }) {
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

  function pick(o) {
    onChange(o);
    setOpen(false);
  }

  function addOther() {
    const t = otherText.trim();
    if (t) { onChange(t); setOtherText(""); setOpen(false); }
  }

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm text-slate-400 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-left focus:border-indigo-500 focus:outline-none transition hover:bg-white/[0.07]"
      >
        <span className={value ? "text-white" : "text-slate-500"}>{value || placeholder}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-[#12121a] border border-white/10 rounded-lg overflow-hidden shadow-xl shadow-black/50 max-h-72 overflow-y-auto">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm transition ${value === o ? "bg-indigo-500/20 text-indigo-300" : "text-slate-300 hover:bg-white/5"}`}
            >
              {o}
            </button>
          ))}

          {allowOther && (
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
          )}
        </div>
      )}
    </div>
  );
}