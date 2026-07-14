"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const REPORT = {
  score: 34,
  maturity: "Emerging",
  summary: "Sharma Retail Store relies on manual order-taking and WhatsApp messages. There's strong potential to automate customer handling and inventory, saving significant time each month.",
  savings: 48000,
  roi: 210,
  opportunities: [
    { area: "Automated Customer Ordering", impact: "high", effort: "low", desc: "Let customers place orders and check availability through an AI assistant, 24/7 — no staff needed for repetitive queries." },
    { area: "Inventory Alerts", impact: "high", effort: "medium", desc: "Predict low-stock items and get automatic reorder reminders before you run out." },
    { area: "Daily Sales Summary", impact: "medium", effort: "low", desc: "Auto-generate a daily sales and top-item report instead of manual counting." },
  ],
};

const BLUEPRINT = {
  area: "Automated Customer Ordering",
  steps: [
    "Set up an AI assistant trained on your product list and prices",
    "Share a chat link with customers (WhatsApp bio, card, Instagram)",
    "Customers ask, order, and leave their details automatically",
    "You get every order as an entry with name, item, and phone",
  ],
  tools: ["Qevora AI Agent", "Hosted chat link", "Inquiry inbox"],
  cost: "₹2,499/mo",
  timeline: "Same day",
};

const CHAT = [
  { role: "user", text: "Do you have cotton shirts in size L?" },
  { role: "bot", text: "Yes! We have cotton shirts in size L, available in white, blue and black — ₹499 each. Would you like to place an order?" },
  { role: "user", text: "Haan, 3 white chahiye" },
  { role: "bot", text: "Great! 3 white cotton shirts (size L). Could you share your name and phone number so we can confirm your order?" },
  { role: "user", text: "Raj, 9876543210" },
  { role: "bot", text: "Thank you, Raj! ✅ Your order for 3 white cotton shirts is noted. Our team will contact you on 9876543210 shortly to confirm delivery." },
];

export default function Demo() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 company, 1 scanning, 2 report, 3 blueprint, 4 agent
  const [chatShown, setChatShown] = useState(0);

  function runScan() {
    setStep(1);
    setTimeout(() => setStep(2), 2200);
  }

  function showAgent() {
    setStep(4);
    setChatShown(0);
    CHAT.forEach((_, i) => setTimeout(() => setChatShown(i + 1), (i + 1) * 900));
  }

  const scoreColor = REPORT.score >= 70 ? "text-emerald-400" : REPORT.score >= 40 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* nav */}
      <nav className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
        <button onClick={() => router.push("/")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
          <span className="text-lg font-semibold">Qevora</span>
        </button>
        <button onClick={() => router.push("/login")} className="text-sm bg-white/10 border border-white/10 rounded-lg px-4 py-2 font-medium hover:bg-white/20 transition">
          Sign up free
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <span className="inline-block text-xs uppercase tracking-wide text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">Live demo · no signup</span>
          <h1 className="text-3xl sm:text-4xl font-bold">See Qevora in action</h1>
          <p className="text-slate-400 mt-2">Watch how a real business goes from scan to a live AI agent.</p>
        </div>

        {/* stepper */}
        <div className="flex justify-center gap-2 mb-8 text-xs">
          {["Company", "Scan", "Report", "Blueprint", "Agent"].map((s, i) => (
            <div key={i} className={`px-3 py-1.5 rounded-full border ${
              (step >= 2 && i <= 2) || (step >= 3 && i === 3) || (step >= 4 && i === 4) || (step <= 1 && i <= step)
                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300" : "border-white/10 text-slate-500"
            }`}>{s}</div>
          ))}
        </div>

        {/* STEP 0 — company */}
        {step === 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4 text-2xl">🏪</div>
            <h2 className="text-xl font-semibold">Sharma Retail Store</h2>
            <p className="text-slate-400 text-sm mt-1">Retail · Ahmedabad · 4 staff</p>
            <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto">A local clothing shop taking orders manually over calls and WhatsApp. Let&apos;s see what AI can do for them.</p>
            <button onClick={runScan} className="mt-6 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl px-7 py-3 font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/25">
              Run AI Scan →
            </button>
          </div>
        )}

        {/* STEP 1 — scanning */}
        {step === 1 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-5" />
            <p className="font-medium">Analyzing the business...</p>
            <p className="text-slate-500 text-sm mt-1">Checking 20+ factors · finding opportunities</p>
          </div>
        )}

        {/* STEP 2 — report */}
        {step >= 2 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className={`text-5xl font-bold ${scoreColor}`}>{REPORT.score}</p>
                <p className="text-xs text-slate-500">/ 100</p>
              </div>
              <div>
                <p className="font-semibold">AI Readiness: {REPORT.maturity}</p>
                <p className="text-slate-400 text-sm mt-1">{REPORT.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-xl p-4">
                <p className="text-xs text-slate-400">Est. Monthly Savings</p>
                <p className="text-xl font-bold text-emerald-400">₹{REPORT.savings.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-indigo-500/[0.06] border border-indigo-500/15 rounded-xl p-4">
                <p className="text-xs text-slate-400">Estimated ROI</p>
                <p className="text-xl font-bold text-indigo-400">{REPORT.roi}%</p>
              </div>
            </div>

            <p className="text-sm font-semibold mt-6 mb-3">Top Opportunities</p>
            <div className="space-y-2">
              {REPORT.opportunities.map((o, i) => (
                <div key={i} className="border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{o.area}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Impact: {o.impact}</span>
                    <span className="text-xs text-slate-500">Effort: {o.effort}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1.5">{o.desc}</p>
                </div>
              ))}
            </div>

            {step === 2 && (
              <button onClick={() => setStep(3)} className="mt-5 w-full bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-medium hover:bg-white/20 transition">
                See the Blueprint for opportunity #1 →
              </button>
            )}
          </div>
        )}

        {/* STEP 3 — blueprint */}
        {step >= 3 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-4">
            <p className="text-xs text-indigo-300 uppercase tracking-wide mb-1">Blueprint</p>
            <h3 className="font-semibold">{BLUEPRINT.area}</h3>
            <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
              <div className="border border-white/10 rounded-lg p-3"><p className="text-xs text-slate-500">Cost</p><p className="font-medium">{BLUEPRINT.cost}</p></div>
              <div className="border border-white/10 rounded-lg p-3"><p className="text-xs text-slate-500">Timeline</p><p className="font-medium">{BLUEPRINT.timeline}</p></div>
              <div className="border border-white/10 rounded-lg p-3"><p className="text-xs text-slate-500">Tools</p><p className="font-medium text-xs">{BLUEPRINT.tools.join(", ")}</p></div>
            </div>
            <p className="text-sm font-semibold mt-5 mb-2">Steps</p>
            <ol className="space-y-2">
              {BLUEPRINT.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-xs">{i + 1}</span>
                  <span className="text-slate-300">{s}</span>
                </li>
              ))}
            </ol>
            {step === 3 && (
              <button onClick={showAgent} className="mt-5 w-full bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-medium hover:bg-white/20 transition">
                See the live AI Agent in action →
              </button>
            )}
          </div>
        )}

        {/* STEP 4 — agent */}
        {step >= 4 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-4">
            <p className="text-xs text-indigo-300 uppercase tracking-wide mb-1">Live AI Agent</p>
            <h3 className="font-semibold mb-1">Sharma Store Assistant</h3>
            <p className="text-slate-500 text-xs mb-4">A customer chatting with the shop&apos;s AI — and an order being captured.</p>
            <div className="space-y-3">
              {CHAT.slice(0, chatShown).map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user" ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-white/5 border border-white/10 text-slate-200"
                  }`}>{m.text}</div>
                </div>
              ))}
            </div>
            {chatShown >= CHAT.length && (
              <div className="mt-4 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-xl p-3 text-sm text-emerald-300">
                ✅ New order captured → sent to the shop owner&apos;s inbox instantly.
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        {step >= 4 && chatShown >= CHAT.length && (
          <div className="text-center bg-gradient-to-br from-indigo-600/15 to-violet-600/15 border border-white/10 rounded-2xl p-8 mt-6">
            <h2 className="text-2xl font-bold mb-2">That was a demo. Now do it for YOUR business.</h2>
            <p className="text-slate-300 text-sm mb-6">Free scan · no credit card · takes 5 minutes.</p>
            <button onClick={() => router.push("/login")} className="bg-white text-slate-900 rounded-xl px-8 py-3.5 font-semibold hover:bg-slate-100 hover:scale-105 transition">
              Scan my business free →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

