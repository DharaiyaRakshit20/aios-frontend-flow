"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoiSimulator() {
  const router = useRouter();
  const [staff, setStaff] = useState(5);
  const [hours, setHours] = useState(3);
  const [salary, setSalary] = useState(25000);
  const [queries, setQueries] = useState(50);

  // --- calculation ---
  const HOURS_PER_MONTH = 26 * 8;              // 26 din x 8 ghante
  const hourlyCost = salary / HOURS_PER_MONTH; // ek staff ka per-hour kharcha
  const AUTOMATABLE = 0.6;                     // manual kaam ka ~60% AI kar sakta hai

  const hoursSaved = Math.round(staff * hours * 26 * AUTOMATABLE);
  const staffSaving = Math.round(hoursSaved * hourlyCost);

  // customer queries: har query ~4 min staff time, 70% AI handle kar leta hai
  const queryHours = Math.round((queries * 26 * 4 * 0.7) / 60);
  const querySaving = Math.round(queryHours * hourlyCost);

  const monthlySaving = staffSaving + querySaving;
  const annualSaving = monthlySaving * 12;
  const qevoraCost = 2499;
  const roi = monthlySaving > 0 ? Math.round(((monthlySaving - qevoraCost) / qevoraCost) * 100) : 0;
  const paybackDays = monthlySaving > 0 ? Math.max(1, Math.round((qevoraCost / monthlySaving) * 30)) : 30;

  const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  const sliders = [
    { label: "Team members doing manual work", value: staff, set: setStaff, min: 1, max: 50, step: 1, fmt: (v) => `${v} ${v === 1 ? "person" : "people"}` },
    { label: "Hours each spends on repetitive tasks daily", value: hours, set: setHours, min: 1, max: 8, step: 0.5, fmt: (v) => `${v} hrs/day` },
    { label: "Average monthly salary", value: salary, set: setSalary, min: 10000, max: 100000, step: 5000, fmt: (v) => inr(v) },
    { label: "Customer queries you handle daily", value: queries, set: setQueries, min: 0, max: 500, step: 10, fmt: (v) => `${v} queries` },
  ];

  return (
    <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-3xl p-6 sm:p-10">
      <div className="text-center mb-8">
        <span className="inline-block text-xs uppercase tracking-wide text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
          ROI Simulator
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">How much could AI save you?</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Move the sliders to match your business. The numbers update as you go.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* inputs */}
        <div className="space-y-6">
          {sliders.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm text-slate-400">{s.label}</label>
                <span className="text-sm font-medium text-indigo-300">{s.fmt(s.value)}</span>
              </div>
              <input
                type="range"
                min={s.min} max={s.max} step={s.step}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-indigo-500"
              />
            </div>
          ))}
          <p className="text-xs text-slate-600 pt-2">
            Estimates based on typical automation of repetitive work. Your real numbers come from a full scan.
          </p>
        </div>

        {/* results */}
        <div className="space-y-4">
          <div className="bg-emerald-500/[0.07] border border-emerald-500/20 rounded-2xl p-6 text-center">
            <p className="text-xs text-slate-400 mb-1">Estimated monthly savings</p>
            <p className="text-4xl sm:text-5xl font-bold text-emerald-400 transition-all">{inr(monthlySaving)}</p>
            <p className="text-sm text-slate-500 mt-2">{inr(annualSaving)} per year</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">{hoursSaved + queryHours}</p>
              <p className="text-xs text-slate-500 mt-1">hours saved / month</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-400">{roi > 0 ? `${roi}%` : "—"}</p>
              <p className="text-xs text-slate-500 mt-1">return on investment</p>
            </div>
          </div>

          {monthlySaving > qevoraCost && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-slate-300 text-center">
              Qevora Pro costs {inr(qevoraCost)}/mo — it pays for itself in about{" "}
              <span className="text-white font-medium">{paybackDays} {paybackDays === 1 ? "day" : "days"}</span>.
            </div>
          )}

          <button onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl py-3.5 font-medium hover:opacity-90 hover:scale-[1.02] transition shadow-lg shadow-indigo-500/25">
            Get my real numbers — scan free →
          </button>
          <p className="text-center text-xs text-slate-600">No credit card. Takes 5 minutes.</p>
        </div>
      </div>
    </div>
  );
}
