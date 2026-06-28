"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { runScan } from "@/lib/api";

function ScanForm() {
  const router = useRouter();
  const params = useSearchParams();
  const orgId = parseInt(params.get("org"));

  const [form, setForm] = useState({
    industry: "", team_size: "", current_tools: "",
    repetitive_tasks: "", pain_points: "", goals: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key, val) { setForm({ ...form, [key]: val }); }
  function toList(s) { return s.split(",").map((x) => x.trim()).filter(Boolean); }

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      const intake = {
        industry: form.industry,
        team_size: form.team_size,
        current_tools: toList(form.current_tools),
        repetitive_tasks: toList(form.repetitive_tasks),
        pain_points: toList(form.pain_points),
        goals: toList(form.goals),
      };
      const report = await runScan(orgId, intake);
      router.push(`/report/${report.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (label, key, placeholder) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">New Business Scan</h1>
        <p className="text-slate-500 mb-6 text-sm">Tell us about the business. Separate multiple items with commas.</p>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <div className="space-y-4">
          {field("Industry", "industry", "e.g. retail")}
          {field("Team size", "team_size", "e.g. 20")}
          {field("Current tools", "current_tools", "excel, whatsapp")}
          {field("Repetitive tasks", "repetitive_tasks", "order entry, customer replies")}
          {field("Pain points", "pain_points", "slow support, manual reports")}
          {field("Goals", "goals", "save time, grow sales")}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-lg py-3 font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Analyzing... (AI is thinking)" : "Run Scan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScanWizard() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading...</div>}>
      <ScanForm />
    </Suspense>
  );
}