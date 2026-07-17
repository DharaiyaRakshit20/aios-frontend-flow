"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("qv_consent")) setShow(true);
    } catch {}
  }, []);

  function decide(value) {
    try { localStorage.setItem("qv_consent", value); } catch {}
    setShow(false);
    if (value === "all") window.location.reload(); // analytics ab load honge
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4">
      <div className="max-w-3xl mx-auto bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-white mb-1">We use cookies</p>
          <p className="text-xs text-slate-400">
            Qevora uses analytics cookies to understand how the site is used and improve it. Essential
            cookies are always on.{" "}
            <a href="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy policy</a>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => decide("essential")}
            className="text-sm border border-white/15 rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 transition">
            Essential only
          </button>
          <button onClick={() => decide("all")}
            className="text-sm bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2 font-medium hover:opacity-90 transition">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
