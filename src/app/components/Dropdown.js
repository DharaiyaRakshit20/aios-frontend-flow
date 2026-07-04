"use client";
import { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        <div className="absolute z-30 mt-1 w-full bg-[#12121a] border border-white/10 rounded-lg overflow-hidden shadow-xl shadow-black/50">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm transition ${
                value === o ? "bg-indigo-500/20 text-indigo-300" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}