"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);

  useEffect(() => {
    try {
      if (!localStorage.getItem("qv_consent")) setShow(true);
    } catch {}
    // withdraw: koi bhi jagah se "qv_open_consent" event aaye to banner kholo (G-05)
    function reopen() { setShow(true); setCustomize(true); }
    window.addEventListener("qv-open-consent", reopen);
    return () => window.removeEventListener("qv-open-consent", reopen);
  }, []);

  // qv_consent me kya store: "all" | "essential" | "analytics" | "functional" | "analytics,functional"
  function save(value) {
    try { localStorage.setItem("qv_consent", value); } catch {}
    setShow(false);
    window.location.reload();  // choice ke hisaab se scripts load/na-load
  }

  function acceptAll() { save("all"); }
  function essentialOnly() { save("essential"); }
  function saveCustom() {
    const parts = [];
    if (analytics) parts.push("analytics");
    if (functional) parts.push("functional");
    save(parts.length ? parts.join(",") : "essential");
  }

  if (!show) return null;

  const Toggle = ({ on, set, disabled }) => (
    <button type="button" onClick={() => !disabled && set(!on)} disabled={disabled}
      className={`w-10 h-6 rounded-full relative transition shrink-0 ${on ? "bg-indigo-500" : "bg-white/15"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4">
      <div className="max-w-3xl mx-auto bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-5">
        {!customize ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">We use cookies</p>
              <p className="text-xs text-slate-400">
                Qevora uses cookies to keep you signed in, understand usage, and process payments. You choose what to allow.{" "}
                <a href="/cookie-policy" className="text-indigo-400 hover:text-indigo-300">Cookie policy</a>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button onClick={() => setCustomize(true)}
                className="text-sm border border-white/15 rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 transition">
                Customize
              </button>
              <button onClick={essentialOnly}
                className="text-sm border border-white/15 rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 transition">
                Essential only
              </button>
              <button onClick={acceptAll}
                className="text-sm bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2 font-medium hover:opacity-90 transition">
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Cookie preferences</p>
              <a href="/cookie-policy" className="text-xs text-indigo-400 hover:text-indigo-300">Learn more</a>
            </div>

            {/* Essential — always on */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white">Essential</p>
                <p className="text-xs text-slate-500">Login and security. Always on.</p>
              </div>
              <Toggle on={true} set={() => {}} disabled />
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white">Analytics</p>
                <p className="text-xs text-slate-500">Anonymous usage stats to improve Qevora.</p>
              </div>
              <Toggle on={analytics} set={setAnalytics} />
            </div>

            {/* Functional */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white">Functional</p>
                <p className="text-xs text-slate-500">Payments and enhanced features.</p>
              </div>
              <Toggle on={functional} set={setFunctional} />
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-1">
              <button onClick={() => setCustomize(false)}
                className="text-sm text-slate-400 hover:text-white transition px-4 py-2">
                Back
              </button>
              <button onClick={saveCustom}
                className="text-sm bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2 font-medium hover:opacity-90 transition">
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}