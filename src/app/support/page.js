"use client";
import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import PublicShell from "../components/PublicShell";
import { getToken } from "@/lib/api";
import { submitSupport } from "@/lib/api";

export default function SupportPage() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setLoggedIn(!!getToken()); }, []);

  async function submit(e) {
    e.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true); setError("");
    try {
      await submitSupport({ name, email, subject, message });
      setDone(true);
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setError("Something went wrong — please try again shortly.");
    } finally { setBusy(false); }
  }

  const content = (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Support</h1>
      <p className="text-slate-400 mb-8">Have a question or running into an issue? Write to us below — we&apos;ll get back to you soon.</p>

      {done ? (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="font-medium mb-1">Message received!</p>
          <p className="text-sm text-slate-400 mb-4">We&apos;ll get in touch with you shortly.</p>
          <button onClick={() => setDone(false)}
            className="text-sm text-indigo-400 hover:text-indigo-300">Send another</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {!loggedIn && (
            <>
              <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                placeholder="Your email (so we can reply)" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </>
          )}
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
            placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition min-h-[140px] resize-y"
            placeholder="Write your message..." value={message} onChange={(e) => setMessage(e.target.value)} required />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={busy || !message.trim()}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition">
            {busy ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </div>
  );

  if (loggedIn === null) return <div className="min-h-screen bg-[#0a0a0f]" />;
  if (loggedIn) return <AppShell>{content}</AppShell>;
  return <PublicShell>{content}</PublicShell>;
}
