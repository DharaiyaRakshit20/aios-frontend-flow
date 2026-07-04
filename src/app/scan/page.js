"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { runScan, getProfile, getOrganization } from "@/lib/api";
import AppShell from "../components/AppShell";
import Dropdown from "../components/Dropdown";


const STEPS = ["Basics", "Operations", "Data & Tech", "Goals", "Customers"];

// --- reusable inputs (component ke BAHAR — yahi fix hai) ---
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

function Select({ label, k, options, form, set }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
      <Dropdown
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition"
        value={form[k]}
        onChange={(e) => set(k, e.target.value)}
      >
        <option value="" className="bg-[#0a0a0f]">Select...</option>
        {options.map((o) => <option key={o} value={o} className="bg-[#0a0a0f]">{o}</option>)}
      </Dropdown>
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
  const [form, setForm] = useState({
    industry: "", company_size: "", team_size: "", annual_revenue: "", business_age: "", location: "",
    current_tools: "", departments: "", repetitive_tasks: "", time_consuming_areas: "",
    data_storage: "", digital_maturity: "", existing_automation: "", has_website_app: "",
    pain_points: "", biggest_bottleneck: "", goals: "", ai_budget: "", timeline: "",
    customer_channels: "", monthly_customers: "", monthly_orders: "",
  });

  // register/profile ki details se scan pre-fill karo
  // register/profile aur org se scan pre-fill karo
  useEffect(() => {
    // user profile se company size
    getProfile()
      .then((u) => {
        setForm((f) => ({ ...f, company_size: u.company_size || f.company_size }));
      })
      .catch(() => {});

    // org se industry
    if (orgId) {
      getOrganization(orgId)
        .then((org) => {
          setForm((f) => ({ ...f, industry: org.industry || f.industry }));
        })
        .catch(() => {});
    }
  }, [orgId]);
  
  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }
  function toList(s) { return s.split(",").map((x) => x.trim()).filter(Boolean); }

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      const intake = {
        industry: form.industry, company_size: form.company_size, team_size: form.team_size,
        annual_revenue: form.annual_revenue, business_age: form.business_age, location: form.location,
        current_tools: toList(form.current_tools), departments: toList(form.departments),
        repetitive_tasks: toList(form.repetitive_tasks), time_consuming_areas: form.time_consuming_areas,
        data_storage: form.data_storage, digital_maturity: form.digital_maturity,
        existing_automation: form.existing_automation, has_website_app: form.has_website_app,
        pain_points: toList(form.pain_points), biggest_bottleneck: form.biggest_bottleneck,
        goals: toList(form.goals), ai_budget: form.ai_budget, timeline: form.timeline,
        customer_channels: toList(form.customer_channels),
        monthly_customers: form.monthly_customers, monthly_orders: form.monthly_orders,
      };
      const report = await runScan(orgId, intake);
      router.push(`/report/${report.id}`);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  // props jo har field/select ko chahiye
  const p = { form, set };

  const steps = [
    <div key="s0" className="space-y-4">
      <Field label="Industry" k="industry" placeholder="e.g. retail, manufacturing, healthcare" {...p} />
      <Dropdown label="Company size" k="company_size" options={["1-10", "11-50", "51-200", "201-500", "500+"]} {...p} />
      <Field label="Team size (people doing daily operations)" k="team_size" placeholder="e.g. 20" {...p} />
      <Dropdown label="Annual revenue" k="annual_revenue" options={["Under $100k", "$100k-$500k", "$500k-$1M", "$1M-$5M", "$5M+"]} {...p} />
      <Field label="Business age" k="business_age" placeholder="e.g. 5 years" {...p} />
      <Field label="Location" k="location" placeholder="e.g. Mumbai, India" {...p} />
    </div>,
    <div key="s1" className="space-y-4">
      <Field label="Current tools & software" k="current_tools" placeholder="excel, whatsapp, tally, crm" hint="Separate with commas" {...p} />
      <Field label="Departments" k="departments" placeholder="sales, support, operations, accounts" hint="Separate with commas" {...p} />
      <Field label="Repetitive / manual tasks" k="repetitive_tasks" placeholder="order entry, customer replies, reports" hint="Separate with commas" {...p} />
      <Field label="Which areas take the most time?" k="time_consuming_areas" placeholder="e.g. customer support and manual reporting" {...p} />
    </div>,
    <div key="s2" className="space-y-4">
      <Dropdown label="Where is your data stored?" k="data_storage" options={["Mostly paper", "Excel/Sheets", "Basic software", "CRM/ERP system", "Cloud + integrated systems"]} {...p} />
      <Dropdown label="Digital maturity" k="digital_maturity" options={["Very low (mostly manual)", "Low (basic tools)", "Moderate (some systems)", "High (integrated & digital)"]} {...p} />
      <Field label="Any existing automation?" k="existing_automation" placeholder="e.g. auto invoices, none, email automation" {...p} />
      <Dropdown label="Do you have a website / app?" k="has_website_app" options={["No", "Website only", "App only", "Both website and app"]} {...p} />
    </div>,
    <div key="s3" className="space-y-4">
      <Field label="Main pain points" k="pain_points" placeholder="slow support, manual reports, high costs" hint="Separate with commas" {...p} />
      <Field label="Biggest bottleneck" k="biggest_bottleneck" placeholder="e.g. too much time on manual order processing" {...p} />
      <Field label="Goals" k="goals" placeholder="save time, grow sales, reduce cost" hint="Separate with commas" {...p} />
      <Dropdown label="Budget for AI" k="ai_budget" options={["Not sure yet", "Under $500/mo", "$500-$2000/mo", "$2000-$10000/mo", "$10000+/mo"]} {...p} />
      <Dropdown label="Timeline to adopt AI" k="timeline" options={["ASAP", "1-3 months", "3-6 months", "6-12 months", "Just exploring"]} {...p} />
    </div>,
    <div key="s4" className="space-y-4">
      <Field label="Customer interaction channels" k="customer_channels" placeholder="calls, whatsapp, email, walk-in" hint="Separate with commas" {...p} />
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
          <h1 className="text-2xl font-bold mb-1">New Business Scan</h1>
          <p className="text-slate-400 mb-6 text-sm">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

          {steps[step]}

          <div className="flex justify-between mt-8">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
              className="border border-white/10 text-slate-300 rounded-lg px-5 py-2.5 hover:bg-white/5 disabled:opacity-30 transition">
              Back
            </button>
            {!isLast ? (
              <button onClick={() => setStep((s) => s + 1)}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-6 py-2.5 font-medium hover:opacity-90 transition">
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