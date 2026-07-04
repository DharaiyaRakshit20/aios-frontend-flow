"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PublicShell from "../components/PublicShell";

export default function Contact() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition";

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold mb-2">Contact us</h1>
        <p className="text-slate-400 text-sm mb-10">Have a question or feedback? We&apos;d love to hear from you.</p>

        {sent ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-6 text-center">
            <p className="font-medium mb-1">Thanks for reaching out!</p>
            <p className="text-sm text-emerald-300/80">We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Name</label>
              <input className={input} placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input className={input} type="email" placeholder="you@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Message</label>
              <textarea className={`${input} min-h-[120px] resize-none`} placeholder="How can we help?" value={form.message} onChange={(e) => set("message", e.target.value)} />
            </div>
            <button
              onClick={() => { if (form.name && form.email && form.message) setSent(true); }}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 font-medium hover:opacity-90 transition"
            >
              Send message
            </button>
            <p className="text-xs text-slate-600 text-center">Or email us directly at hello@qevora.com</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}