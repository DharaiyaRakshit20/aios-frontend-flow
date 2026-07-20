"use client";
import PublicShell from "../components/PublicShell";

export default function CookiePolicy() {
  const rows = [
    { name: "qv_consent", type: "Essential", purpose: "Remembers your cookie choice", retention: "1 year" },
    { name: "aios_token", type: "Essential", purpose: "Keeps you logged in", retention: "Session" },
    { name: "_ga / _ga_*", type: "Analytics", purpose: "Google Analytics — anonymous usage stats", retention: "Up to 2 years" },
    { name: "_clck / _clsk", type: "Analytics", purpose: "Microsoft Clarity — anonymous session insights", retention: "Up to 1 year" },
    { name: "rzp_*", type: "Functional", purpose: "Razorpay — secure payment processing", retention: "Session" },
  ];
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold">Cookie Policy</h1>
        <p className="text-slate-400 text-sm">Last updated: July 2026</p>
        <p className="text-slate-300">Qevora uses cookies to keep you signed in, understand how the product is used, and process payments. You control non-essential cookies through the consent banner and can change your choice anytime.</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs text-slate-500 uppercase tracking-wide border-b border-white/5">
            <span className="col-span-3">Cookie</span>
            <span className="col-span-2">Type</span>
            <span className="col-span-5">Purpose</span>
            <span className="col-span-2">Retention</span>
          </div>
          {rows.map((r) => (
            <div key={r.name} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/5 last:border-0 text-sm">
              <code className="col-span-3 text-indigo-300 text-xs break-all">{r.name}</code>
              <span className="col-span-2 text-slate-400 text-xs">{r.type}</span>
              <span className="col-span-5 text-slate-300 text-xs">{r.purpose}</span>
              <span className="col-span-2 text-slate-500 text-xs">{r.retention}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-2">
          <h2 className="font-semibold">Managing cookies</h2>
          <p className="text-slate-400 text-sm">Essential cookies are always on — the product can&apos;t work without them. Analytics and functional cookies only load after you accept them. You can withdraw consent anytime by clearing your choice in the banner, or through your browser settings.</p>
        </div>
      </div>
    </PublicShell>
  );
}
