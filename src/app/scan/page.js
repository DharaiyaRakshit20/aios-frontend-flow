"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { runScan, getProfile, getOrganization, getLastScanIntake, saveDraft, getDraft, deleteDraft } from "@/lib/api";
import AppShell from "../components/AppShell";
import Dropdown from "../components/Dropdown";
import MultiSelect from "../components/MultiSelect";

const STEPS = ["Basics", "Operations", "Data & Tech", "Goals", "Customers"];

function Field({ label, k, placeholder, hint, form, set }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
      <input
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
        placeholder={placeholder}
        value={form[k]}
        onChange={(e) => set(k, e.target.value)}
      />
      {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
    </div>
  );
}

function ScanForm() {
  const router = useRouter();
  const params = useSearchParams();
  const orgId = parseInt(params.get("org"));

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [form, setForm] = useState({
    industry: "", company_size: "", team_size: "", annual_revenue: "", business_age: "", location: "",
    current_tools: [], departments: [], repetitive_tasks: [], time_consuming_areas: "",
    data_storage: "", digital_maturity: "", existing_automation: [], has_website_app: "",
    pain_points: [], biggest_bottleneck: "", goals: [], ai_budget: "", timeline: "",
    customer_channels: [], monthly_customers: "", monthly_orders: "",
  });

  const draftKey = `qevora_scan_draft_${orgId || "new"}`;
  const draftLoaded = useRef(false);

  // --- prefill: profile + org + last scan ---
  useEffect(() => {
    getProfile()
      .then((u) => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm((f) => ({ ...f, company_size: u.company_size || f.company_size }));
      })
      .catch(() => {});

    if (orgId) {
      getOrganization(orgId)
        .then((org) => {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setForm((f) => ({ ...f, industry: org.industry || f.industry }));
        })
        .catch(() => {});

      getLastScanIntake(orgId)
        .then((res) => {
          if (res.intake) {
            const multiFields = ["current_tools", "departments", "repetitive_tasks",
              "existing_automation", "pain_points", "goals", "customer_channels"];
            const clean = { ...res.intake };
            multiFields.forEach((k) => {
              const v = clean[k];
              if (typeof v === "string") {
                clean[k] = v.split(",").map((x) => x.trim()).filter(Boolean);
              } else if (!Array.isArray(v)) {
                clean[k] = [];
              }
            });
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm((f) => ({ ...f, ...clean }));
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  // --- load draft (backend se) ---
  useEffect(() => {
    getDraft(orgId)
      .then((res) => {
        if (res.draft && res.draft.form) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setForm((f) => {
            const merged = { ...f };
            Object.keys(res.draft.form).forEach((k) => {
              const v = res.draft.form[k];
              const filled = Array.isArray(v) ? v.length > 0 : v && v.toString().trim() !== "";
              if (filled) merged[k] = v;
            });
            return merged;
          });
          // eslint-disable-next-line react-hooks/set-state-in-effect
          if (typeof res.draft.step === "number") setStep(res.draft.step);
        }
      })
      .catch(() => {})
      .finally(() => { draftLoaded.current = true; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  // --- auto-save draft (backend, debounced) ---
  useEffect(() => {
    if (!draftLoaded.current) return;
    const timer = setTimeout(() => {
      saveDraft(orgId, form, step)
        .then(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setDraftSaved(true);
          setTimeout(() => setDraftSaved(false), 2000);
        })
        .catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, step]);
  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  // --- mandatory fields ---
  const requiredByStep = [
    ["industry", "company_size", "team_size"],
    ["current_tools", "repetitive_tasks"],
    ["data_storage", "digital_maturity"],
    ["pain_points", "goals"],
    [],
  ];
  function isFilled(val) {
    if (Array.isArray(val)) return val.length > 0;
    return val && val.toString().trim() !== "";
  }
  function stepValid(s) {
    return requiredByStep[s].every((k) => isFilled(form[k]));
  }
  function handleNext() {
    setError("");
    if (!stepValid(step)) { setError("Please fill all required fields marked with *"); return; }
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setError("");
    for (let s = 0; s < requiredByStep.length; s++) {
      if (!stepValid(s)) { setStep(s); setError("Please fill all required fields marked with *"); return; }
    }
    setLoading(true);
    try {
      const intake = {
        industry: form.industry, company_size: form.company_size, team_size: form.team_size,
        annual_revenue: form.annual_revenue, business_age: form.business_age, location: form.location,
        current_tools: form.current_tools, departments: form.departments,
        repetitive_tasks: form.repetitive_tasks, time_consuming_areas: form.time_consuming_areas,
        data_storage: form.data_storage, digital_maturity: form.digital_maturity,
        existing_automation: form.existing_automation, has_website_app: form.has_website_app,
        pain_points: form.pain_points, biggest_bottleneck: form.biggest_bottleneck,
        goals: form.goals, ai_budget: form.ai_budget, timeline: form.timeline,
        customer_channels: form.customer_channels,
        monthly_customers: form.monthly_customers, monthly_orders: form.monthly_orders,
      };
      const report = await runScan(orgId, intake);
      deleteDraft(orgId).catch(() => {});
      router.push(`/report/${report.id}`);
    } catch (e) {
      if (e.message.toLowerCase().includes("limit")) {
        router.push("/pricing");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSaveDraft() {
    saveDraft(orgId, form, step).catch(() => {});
    router.push("/dashboard");
  }
  function cancelKeepDraft() {
    setShowCancel(false);
    router.push("/dashboard");
  }
  function cancelDiscard() {
    deleteDraft(orgId).catch(() => {});
    setShowCancel(false);
    router.push("/dashboard");
  }

  const p = { form, set };

  const steps = [
    <div key="s0" className="space-y-4">
      <Field label="Industry *" k="industry" placeholder="e.g. retail, manufacturing, healthcare" {...p} />
      <Dropdown label="Company size *" value={form.company_size} onChange={(v) => set("company_size", v)} options={["1-10", "11-50", "51-200", "201-500", "500+"]} />
      <Field label="Team size (people doing daily operations) *" k="team_size" placeholder="e.g. 20" {...p} />
      <Dropdown label="Annual revenue" value={form.annual_revenue} onChange={(v) => set("annual_revenue", v)} options={["Under ₹10 Lakh", "₹10-50 Lakh", "₹50 Lakh-1 Cr", "₹1-5 Cr", "₹5 Cr+"]} allowOther />
      <Field label="Business age" k="business_age" placeholder="e.g. 5 years" {...p} />
      <Field label="Location" k="location" placeholder="e.g. Mumbai, India" {...p} />
    </div>,
    <div key="s1" className="space-y-4">
      <MultiSelect label="Current tools & software *" values={form.current_tools} onChange={(v) => set("current_tools", v)}
        options={["Excel / Google Sheets", "WhatsApp", "Tally", "CRM", "ERP", "Email", "Accounting software", "POS system", "Pen & paper"]} />
      <MultiSelect label="Departments" values={form.departments} onChange={(v) => set("departments", v)}
        options={["Sales", "Customer Support", "Operations", "Accounts / Finance", "Marketing", "HR", "Inventory / Warehouse", "Production"]} />
      <MultiSelect label="Repetitive / manual tasks *" values={form.repetitive_tasks} onChange={(v) => set("repetitive_tasks", v)}
        options={["Order entry", "Customer replies", "Report generation", "Data entry", "Invoicing", "Follow-ups", "Scheduling", "Inventory updates"]} />
      <Field label="Which areas take the most time?" k="time_consuming_areas" placeholder="e.g. customer support and manual reporting" {...p} />
    </div>,
    <div key="s2" className="space-y-4">
      <Dropdown label="Where is your data stored? *" value={form.data_storage} onChange={(v) => set("data_storage", v)} options={["Mostly paper", "Excel/Sheets", "Basic software", "CRM/ERP system", "Cloud + integrated systems"]} />
      <Dropdown label="Digital maturity *" value={form.digital_maturity} onChange={(v) => set("digital_maturity", v)} options={["Very low (mostly manual)", "Low (basic tools)", "Moderate (some systems)", "High (integrated & digital)"]} />
      <MultiSelect label="Any existing automation?" values={form.existing_automation} onChange={(v) => set("existing_automation", v)}
        options={["None", "Auto invoicing", "Email automation", "WhatsApp auto-replies", "Automated reports", "Payment reminders", "Inventory alerts"]} />
      <Dropdown label="Do you have a website / app?" value={form.has_website_app} onChange={(v) => set("has_website_app", v)} options={["No", "Website only", "App only", "Both website and app"]} />
    </div>,
    <div key="s3" className="space-y-4">
      <MultiSelect label="Main pain points *" values={form.pain_points} onChange={(v) => set("pain_points", v)}
        options={["Slow customer support", "Too much manual work", "High operational costs", "Data scattered everywhere", "Errors in data entry", "Losing customers", "Can't scale"]} />
      <Field label="Biggest bottleneck" k="biggest_bottleneck" placeholder="e.g. too much time on manual order processing" {...p} />
      <MultiSelect label="Goals *" values={form.goals} onChange={(v) => set("goals", v)}
        options={["Save time", "Grow sales", "Reduce costs", "Improve customer experience", "Better data & insights", "Automate operations", "Scale the business"]} />
      <Dropdown label="Budget for AI" value={form.ai_budget} onChange={(v) => set("ai_budget", v)} options={["Not sure yet", "Under ₹40k/mo", "₹40k-1.5L/mo", "₹1.5L-8L/mo", "₹8L+/mo"]} allowOther />
      <Dropdown label="Timeline to adopt AI" value={form.timeline} onChange={(v) => set("timeline", v)} options={["ASAP", "1-3 months", "3-6 months", "6-12 months", "Just exploring"]} />
    </div>,
    <div key="s4" className="space-y-4">
      <MultiSelect label="Customer interaction channels" values={form.customer_channels} onChange={(v) => set("customer_channels", v)}
        options={["Phone calls", "WhatsApp", "Email", "Walk-in", "Website", "Social media", "Mobile app"]} />
      <Field label="Monthly customers (approx)" k="monthly_customers" placeholder="e.g. 500" {...p} />
      <Field label="Monthly orders / transactions (approx)" k="monthly_orders" placeholder="e.g. 1200" {...p} />
    </div>,
  ];

  const isLast = step === STEPS.length - 1;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-xs ${i <= step ? "text-indigo-400" : "text-slate-600"}`}>{s}</span>
            ))}
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                 style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">New Business Scan</h1>
            <div className="flex items-center gap-3">
              {draftSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Draft saved
                </span>
              )}
              <button onClick={() => setShowCancel(true)} className="text-sm text-slate-400 hover:text-white transition">
                Cancel
              </button>
            </div>
          </div>
          <p className="text-slate-400 mb-6 text-sm">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

          <p className="text-xs text-slate-600 mb-4">Fields marked with * are required.</p>

          {steps[step]}

          <div className="flex justify-between items-center mt-8">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
              className="border border-white/10 text-slate-300 rounded-lg px-5 py-2.5 hover:bg-white/5 disabled:opacity-30 transition">
              Back
            </button>
            <div className="flex items-center gap-3">
              <button onClick={handleSaveDraft}
                className="text-sm text-slate-300 border border-white/10 rounded-lg px-4 py-2.5 hover:bg-white/5 transition">
                Save & Draft
              </button>
              {!isLast ? (
                <button onClick={handleNext} disabled={!stepValid(step)}
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-6 py-2.5 font-medium hover:opacity-90 disabled:opacity-40 transition">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-6 py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20">
                  {loading ? "Analyzing..." : "Run Scan"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* cancel confirmation popup */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCancel(false)}>
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Leave this scan?</h3>
            <p className="text-slate-400 text-sm mb-6">You can save your progress as a draft and continue later, or discard it.</p>
            <div className="space-y-2.5">
              <button onClick={cancelKeepDraft}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition">
                Save as draft & leave
              </button>
              <button onClick={cancelDiscard}
                className="w-full border border-red-500/30 text-red-400 rounded-lg py-2.5 text-sm hover:bg-red-500/10 transition">
                Discard & leave
              </button>
              <button onClick={() => setShowCancel(false)}
                className="w-full text-slate-400 text-sm py-2 hover:text-white transition">
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function ScanWizard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-500">Loading...</div>}>
      <ScanForm />
    </Suspense>
  );
}