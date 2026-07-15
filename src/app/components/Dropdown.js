"use client";
import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  label,
  value,
  onChange,
  options = [],
  allowOther = false,
  placeholder = "Select...",
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [otherText, setOtherText] = useState("");
  const boxRef = useRef(null);
  const listRef = useRef(null);

  const isOther = allowOther && value && !options.includes(value);

  // value bahar se aaye aur woh "Other" ka ho -> input me dikhao
  useEffect(() => {
    if (isOther) setOtherText(value);
  }, [value, isOther]);

  // click outside -> band (M2)
  useEffect(() => {
    function onDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Escape -> band (M2)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) { setOpen(false); setHighlight(-1); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function pick(opt) {
    onChange(opt);          // M1: yahi asli fix - parent ko value milti hai
    setOpen(false);
    setHighlight(-1);
  }

  function pickOther() {
    onChange(otherText.trim());
    setOpen(false);
    setHighlight(-1);
  }

  // keyboard: Arrow/Enter/Space/Escape (M18)
  function onTriggerKey(e) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      if (!open) { setOpen(true); setHighlight(0); return; }
    }
    if (!open) return;
    if (e.key === "ArrowDown") setHighlight((h) => Math.min(h + 1, options.length - 1));
    else if (e.key === "ArrowUp") setHighlight((h) => Math.max(h - 1, 0));
    else if (e.key === "Enter" && highlight >= 0 && highlight < options.length) pick(options[highlight]);
  }

  const display = value || placeholder;

  return (
    <div ref={boxRef} className="relative">
      {label && (
        <label className="block text-sm text-slate-400 mb-1.5">
          {label}{required && <span className="text-indigo-400"> *</span>}
        </label>
      )}

      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => { setOpen((o) => !o); setHighlight(-1); }}
        onKeyDown={onTriggerKey}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-left flex items-center justify-between gap-2 focus:border-indigo-500 focus:outline-none transition"
      >
        <span className={value ? "text-white truncate" : "text-slate-500 truncate"}>{display}</span>
        <svg className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-[60] left-0 right-0 mt-2 bg-[#12121a] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden max-h-64 overflow-y-auto"
        >
          {options.map((opt, i) => {
            const selected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => { e.preventDefault(); pick(opt); }}
                className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-2 transition ${
                  highlight === i ? "bg-white/10 text-white" : selected ? "bg-indigo-500/10 text-white" : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <span className="truncate">{opt}</span>
                {selected && (
                  <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}

          {allowOther && (
            <div className="border-t border-white/5 p-2" onMouseDown={(e) => e.stopPropagation()}>
              <p className="text-xs text-slate-500 px-1.5 mb-1.5">Other</p>
              <div className="flex gap-1.5">
                <input
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Type your own..."
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); pickOther(); } }}
                />
                <button type="button" onMouseDown={(e) => { e.preventDefault(); pickOther(); }}
                  disabled={!otherText.trim()}
                  className="bg-white/10 border border-white/10 rounded-lg px-3 text-xs hover:bg-white/20 disabled:opacity-40 transition">
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
