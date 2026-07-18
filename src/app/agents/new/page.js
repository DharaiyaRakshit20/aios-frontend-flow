"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken, getOrganizations, createAgent } from "@/lib/api";
import AppShell from "../../components/AppShell";
import Dropdown from "../../components/Dropdown";
import PageLoader from "../../components/PageLoader";

const TEMPLATES = [
  {
    id: "retail", icon: "🏪", title: "Retail Order Assistant",
    desc: "Takes orders, checks stock & prices",
    name: "Order Assistant",
    role: "Retail Sales & Order Assistant",
    description: "Helps customers browse products, check availability, and place orders.",
    instructions: "You are a friendly retail assistant. Help customers find products, tell them prices and availability, and take their orders. When a customer wants to order, collect the item, quantity, their name, and phone number. Keep replies short and helpful. If you don't know a price or stock detail, say you'll check and ask them to leave their contact.",
  },
  {
    id: "support", icon: "💬", title: "Customer Support",
    desc: "Answers FAQs, handles complaints",
    name: "Support Assistant",
    role: "Customer Support Agent",
    description: "Answers common questions and helps resolve customer issues.",
    instructions: "You are a helpful customer support agent. Answer questions politely and clearly using the business information provided. For complaints, be empathetic, apologize, and collect the customer's details so the team can follow up. Never make promises you can't keep. Keep responses concise and friendly.",
  },
  {
    id: "appointment", icon: "📅", title: "Appointment Booker",
    desc: "Books slots, sends reminders",
    name: "Booking Assistant",
    role: "Appointment Booking Assistant",
    description: "Helps customers book appointments and check available slots.",
    instructions: "You are an appointment booking assistant. Help customers book appointments by collecting their name, phone number, preferred date and time, and the service they need. Confirm the details back to them. If a requested slot isn't available, suggest alternatives. Be polite and efficient.",
  },
  {
    id: "medical", icon: "💊", title: "Medical Store Helper",
    desc: "Medicine availability, timings",
    name: "Pharmacy Assistant",
    role: "Medical Store Assistant",
    description: "Helps customers check medicine availability and store info.",
    instructions: "You are a medical store assistant. Help customers check if medicines are available, share store timings, and take orders for pickup or delivery. Always tell customers to consult a doctor or pharmacist for medical advice — never give medical advice or dosage recommendations yourself. Collect name and phone for any order.",
  },
  {
    id: "restaurant", icon: "🍽️", title: "Restaurant Assistant",
    desc: "Menu, orders, table booking",
    name: "Restaurant Assistant",
    role: "Restaurant Order & Booking Assistant",
    description: "Shares menu, takes orders, and books tables.",
    instructions: "You are a restaurant assistant. Help customers see the menu, place food orders, and book tables. For orders, collect items, quantity, name, phone, and whether it's dine-in, takeaway, or delivery. For table bookings, collect date, time, and party size. Be warm and welcoming.",
  },
  {
    id: "fintech", icon: "💰", title: "Fintech Helper",
    desc: "Services, eligibility, documents",
    name: "Finance Assistant",
    role: "Financial Services Assistant",
    description: "Explains services, eligibility, and required documents.",
    instructions: "You are a financial services assistant. Explain the services offered, general eligibility, and what documents are typically needed. Collect the customer's name and phone so an advisor can follow up. Never give specific financial, investment, or legal advice — always direct customers to speak with a qualified advisor for their situation.",
  },
];

function NewAgentForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [orgs, setOrgs] = useState([]);
  const [picked, setPicked] = useState(false);  // template chuna ya scratch
  const [form, setForm] = useState({
    organization: params.get("org") || "",
    name: params.get("name") || "",
    role: params.get("role") || "",
    description: params.get("description") || "",
    instructions: params.get("instructions") || "",
    knowledge: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }

    // blueprint se prefill (URL me nahi -> instructions leak nahi hoti)
    if (params.get("from") === "blueprint") {
      try {
        const raw = sessionStorage.getItem("qv_agent_prefill");
        if (raw) {
          const p = JSON.parse(raw);
          setForm((f) => ({ ...f, ...p }));
          setPicked(true);   // blueprint se aaya = form dikhao
          sessionStorage.removeItem("qv_agent_prefill");
        }
      } catch {}
    }
    // URL me name aaya (purana link) -> form dikhao
    if (params.get("name")) setPicked(true);

    getOrganizations().then((d) => {
      setOrgs(d);
      if (!form.organization && d.length) setForm((f) => ({ ...f, organization: String(d[0].id) }));
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function useTemplate(t) {
    setForm((f) => ({
      ...f,
      name: t.name,
      role: t.role,
      description: t.description,
      instructions: t.instructions,
    }));
    setPicked(true);
  }

  function startScratch() {
    setForm((f) => ({ ...f, name: "", role: "", description: "", instructions: "" }));
    setPicked(true);
  }

  async function handleSave() {
    setError("");
    if (!form.name || !form.role || !form.instructions || !form.organization) {
      setError("Please fill name, role, instructions, and select an organization.");
      return;
    }
    setSaving(true);
    try {
      const agent = await createAgent({ ...form, organization: parseInt(form.organization) });
      router.push(`/agents/${agent.id}`);
    } catch (e) {
      if (e.message.toLowerCase().includes("limit")) {
        router.push("/pricing?reason=limit");
      } else {
        setError(e.message);
      }
    }
    finally { setSaving(false); }
  }

  const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <button onClick={() => router.push("/agents")} className="text-sm text-slate-400 hover:text-white transition">← Back to agents</button>
      <h1 className="text-2xl font-bold">New AI Agent</h1>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}

      {/* STEP 1 — template picker */}
      {!picked && (
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">Start from a ready-made template, or build your own from scratch.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => useTemplate(t)}
                className="text-left bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 hover:-translate-y-0.5 transition">
                <div className="text-2xl mb-2">{t.icon}</div>
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
          <button onClick={startScratch}
            className="w-full border border-white/10 rounded-2xl p-4 text-sm text-slate-300 hover:bg-white/5 transition flex items-center justify-center gap-2">
            <span className="text-lg">✏️</span> Start from scratch
          </button>
        </div>
      )}

      {/* STEP 2 — form */}
      {picked && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-400">Fill in the details, then create your agent.</p>
            <button onClick={() => setPicked(false)} className="text-xs text-indigo-400 hover:text-indigo-300 transition">← Change template</button>
          </div>

          <Dropdown
            label="Organization"
            value={orgs.find((o) => String(o.id) === String(form.organization))?.name || ""}
            onChange={(v) => { const o = orgs.find((x) => x.name === v); if (o) set("organization", String(o.id)); }}
            options={orgs.map((o) => o.name)}
          />
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Agent name <span className="text-indigo-400">*</span></label>
            <input className={input} placeholder="e.g. Support Assistant" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Role <span className="text-indigo-400">*</span></label>
            <input className={input} placeholder="e.g. Customer Support Agent" value={form.role} onChange={(e) => set("role", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Description <span className="text-slate-600">(optional)</span></label>
            <input className={input} placeholder="What does this agent do?" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Instructions <span className="text-indigo-400">*</span></label>
            <textarea className={`${input} min-h-[120px] resize-y`} placeholder="How should the agent behave? e.g. 'Answer customer questions politely, keep replies short, always offer further help.'" value={form.instructions} onChange={(e) => set("instructions", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Business knowledge <span className="text-slate-600">(optional)</span></label>
            <textarea className={`${input} min-h-[100px] resize-y`} placeholder="Any info the agent should know: products, prices, policies, hours..." value={form.knowledge} onChange={(e) => set("knowledge", e.target.value)} />
          </div>
          <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.role.trim() || !form.instructions.trim()}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-40 transition">
            {saving ? "Creating..." : "Create Agent"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function NewAgentPage() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <NewAgentForm />
      </Suspense>
    </AppShell>
  );
}
