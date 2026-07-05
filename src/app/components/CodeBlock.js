"use client";
import { useState } from "react";

export default function CodeBlock({ snippets }) {
  // snippets = { curl: "...", javascript: "...", python: "..." }
  const langs = Object.keys(snippets);
  const [active, setActive] = useState(langs[0]);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(snippets[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const labels = { curl: "cURL", javascript: "JavaScript", python: "Python" };

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex gap-1">
          {langs.map((l) => (
            <button key={l} onClick={() => setActive(l)}
              className={`px-3 py-1 rounded-md text-xs transition ${active === l ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
              {labels[l] || l}
            </button>
          ))}
        </div>
        <button onClick={copy} className="text-xs text-slate-500 hover:text-white transition">{copied ? "Copied!" : "Copy"}</button>
      </div>
      <pre className="p-4 text-xs text-slate-300 overflow-x-auto leading-relaxed">{snippets[active]}</pre>
    </div>
  );
}