"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import Reveal from "./components/Reveal";
import RoiSimulator from "./components/RoiSimulator";
import PublicShell from "./components/PublicShell";

export default function Landing() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(() => { if (getToken()) router.push("/dashboard"); }, [router]);
  const go = () => router.push("/login");

  return (
    <PublicShell>
      <div className="relative w-full overflow-x-hidden">
        {/* animated glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-w-full rounded-full bg-indigo-600/20 blur-[110px] animate-float" />
        <div className="pointer-events-none absolute top-[40%] right-0 w-[350px] h-[350px] max-w-full rounded-full bg-violet-600/20 blur-[110px] animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative z-10">
          {/* HERO */}
          <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
            <span className="inline-block text-xs tracking-wide uppercase text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
              AI Operating System for Business
            </span>
            <h1 className="text-5xl sm:text-7xl font-bold leading-[1.05] tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Build Your AI Company.
              <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent" style={{ animation: "gradientMove 4s ease infinite" }}>
                Without Hiring AI Engineers.
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Qevora scans your business, scores your AI readiness, builds a roadmap, and even lets you launch AI agents — in minutes, not months.
            </p>
            <div className="flex gap-3 justify-center flex-wrap animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <button onClick={go} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl px-7 py-3.5 font-medium hover:opacity-90 hover:scale-105 transition shadow-lg shadow-indigo-500/25">
                Scan your business free
              </button>
              <button onClick={() => router.push("/demo")} className="border border-white/15 rounded-xl px-7 py-3.5 font-medium hover:bg-white/5 transition">
                ▶ Watch live demo
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="max-w-4xl mx-auto px-6 pb-20">
            <Reveal>
              <div className="grid grid-cols-3 gap-4 sm:gap-8 border-y border-white/5 py-8">
                {[
                  { n: "5 min", l: "Average scan time" },
                  { n: "0–100", l: "AI readiness score" },
                  { n: "20+", l: "Business factors analyzed" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{s.n}</p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ROI SIMULATOR */}
          <section id="roi" className="max-w-5xl mx-auto px-6 pb-24">
            <Reveal>
              <RoiSimulator />
            </Reveal>
          </section>

          {/* TRUSTED BY */}
          <section className="max-w-4xl mx-auto px-6 pb-24">
            <Reveal>
              <p className="text-center text-xs uppercase tracking-wider text-slate-600 mb-6">Built for businesses of every kind</p>
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-slate-500 font-semibold">
                {["Retail", "Manufacturing", "Healthcare", "Logistics", "Hospitality", "Services"].map((n) => (
                  <span key={n} className="hover:text-slate-300 transition">{n}</span>
                ))}
              </div>
            </Reveal>
          </section>

          {/* FEATURES */}
          <section id="features" className="max-w-5xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything you need, in one platform</h2>
                <p className="text-slate-400 max-w-xl mx-auto">From understanding AI to actually running it in your business — Qevora covers the whole journey.</p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { t: "AI Readiness Score", d: "A clear 0–100 score with a maturity level, so you know exactly where you stand.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { t: "Savings & ROI", d: "Estimated monthly savings and annual ROI, tailored to your business.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8" },
                { t: "Opportunity Map", d: "See which areas give the highest impact for the least effort — no guesswork.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" },
                { t: "Implementation Blueprints", d: "For each opportunity, get a full plan: tools, steps, timeline, cost, and team needed.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { t: "AI Agent Builder", d: "Create custom AI chatbots for your business — test them, then deploy them anywhere.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { t: "Your AI knows your stock", d: "Add your products, prices and stock once. Your agent answers with real information — and never invents a product you don't sell.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
                { t: "One-line Website Embed", d: "Add your AI agent to any website with a single line of code — like a chat widget.", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
                { t: "Developer API & Docs", d: "Integrate Qevora into your own apps with a clean API and ready-to-use code examples.", icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { t: "Team Collaboration", d: "Invite your team and manage multiple businesses from one dashboard, with roles.", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5a4 4 0 11-8 0 4 4 0 018 0z" },
                { t: "Privacy-first", d: "Your data is never sold. Chats on embedded agents aren't stored. Bring your own AI key.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 hover:-translate-y-1 transition duration-300 h-full">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.t}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="max-w-5xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
                <p className="text-slate-400">Four simple steps from sign-up to a live AI agent.</p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-4 gap-8">
              {[
                { n: "1", t: "Scan your business", d: "Answer a few quick questions — our AI analyzes 20+ factors in minutes." },
                { n: "2", t: "Get your roadmap", d: "See your score, savings, and a detailed blueprint for each opportunity." },
                { n: "3", t: "Build AI agents", d: "Add your products and stock, then turn opportunities into AI chatbots that know your business." },
                { n: "4", t: "Deploy anywhere", d: "Add your agent to your website with one line, or use our API." },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 120}>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-lg mb-4">{s.n}</div>
                    <h3 className="font-semibold text-lg mb-2">{s.t}</h3>
                    <p className="text-slate-400 text-sm">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* WHY QEVORA */}
          <section className="max-w-4xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-3xl p-8 sm:p-12">
                <div className="text-center mb-10">
                  <span className="inline-block text-xs uppercase tracking-wide text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">Why we built Qevora</span>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">AI is everywhere — but where do <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">you</span> start?</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">
                    Most business owners know AI can help, but not how, where, or if it&apos;s worth it. Consultants are expensive. Generic advice doesn&apos;t fit your business. So most people do nothing — and fall behind.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-red-500/[0.04] border border-red-500/15 rounded-2xl p-6">
                    <p className="text-sm font-semibold text-red-300 mb-3">Without Qevora</p>
                    <ul className="space-y-2.5 text-sm text-slate-400">
                      <li className="flex gap-2"><span className="text-red-400">✕</span> Guessing where AI might help</li>
                      <li className="flex gap-2"><span className="text-red-400">✕</span> Paying consultants thousands</li>
                      <li className="flex gap-2"><span className="text-red-400">✕</span> Generic advice that doesn&apos;t fit</li>
                      <li className="flex gap-2"><span className="text-red-400">✕</span> Months of research, no action</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-500/[0.04] border border-emerald-500/15 rounded-2xl p-6">
                    <p className="text-sm font-semibold text-emerald-300 mb-3">With Qevora</p>
                    <ul className="space-y-2.5 text-sm text-slate-300">
                      <li className="flex gap-2"><span className="text-emerald-400">✓</span> A clear AI score &amp; roadmap in minutes</li>
                      <li className="flex gap-2"><span className="text-emerald-400">✓</span> Tailored to your exact business</li>
                      <li className="flex gap-2"><span className="text-emerald-400">✓</span> Real savings &amp; ROI estimates</li>
                      <li className="flex gap-2"><span className="text-emerald-400">✓</span> Build &amp; deploy AI agents, live</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* BENEFITS */}
          <section className="max-w-5xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">What you actually get</h2>
                <p className="text-slate-400 max-w-xl mx-auto">Not just a report — a clear path from &quot;AI sounds useful&quot; to AI working in your business.</p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { icon: "💰", title: "Know your savings", desc: "See exactly how much time and money AI could save you — in real numbers, not hype." },
                { icon: "🗺️", title: "Get a clear roadmap", desc: "A step-by-step plan for each opportunity: what to build, what tools, what it costs." },
                { icon: "🤖", title: "Launch AI agents", desc: "Turn your plan into working AI chatbots and add them to your website in one line." },
              ].map((b, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-full hover:border-indigo-500/40 transition">
                    <div className="text-3xl mb-3">{b.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                    <p className="text-slate-400 text-sm">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* USE CASES */}
          <section id="use-cases" className="max-w-5xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Made for real businesses</h2>
                <p className="text-slate-400 max-w-xl mx-auto">See what Qevora surfaces for teams like yours.</p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { t: "Retail & E-commerce", d: "Automate order entry, customer replies, and inventory insights." },
                { t: "Services & Agencies", d: "Cut manual reporting and speed up client communication." },
                { t: "Manufacturing", d: "Optimize scheduling, quality checks, and demand forecasting." },
              ].map((u, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 transition h-full">
                    <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">{u.t}</h3>
                    <p className="text-slate-400 text-sm">{u.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="max-w-5xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">What early users say</h2>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { q: "Qevora showed us exactly where to start with AI. The savings estimate alone paid for itself.", n: "Priya S.", r: "Retail Owner" },
                { q: "The report was clear enough that I could share it with my whole team in one meeting.", n: "Arjun M.", r: "Operations Head" },
                { q: "As a consultant, scanning multiple clients from one dashboard is a game-changer.", n: "Neha K.", r: "Business Consultant" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                    <p className="text-slate-300 text-sm leading-relaxed flex-1">“{t.q}”</p>
                    <div className="flex items-center gap-3 mt-5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold">{t.n.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium">{t.n}</p>
                        <p className="text-xs text-slate-500">{t.r}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Frequently asked questions</h2>
              </div>
            </Reveal>
            <div className="space-y-3">
              {[
                { q: "How long does a scan take?", a: "About 5 minutes. You answer a guided questionnaire and our AI does the rest instantly." },
                { q: "Is it really free to start?", a: "Yes — you can scan your first business free, no credit card required." },
                { q: "Can I scan more than one business?", a: "Absolutely. You can add multiple organizations and scan each one separately." },
                { q: "Can I put an AI agent on my own website?", a: "Yes. Build an agent, then add it to any website with a single line of code, or use our API." },
                { q: "Will the AI make up products or prices?", a: "No. You add your products, prices and stock in your Knowledge page, and your agent can only answer from that. If something isn't listed, it says so and offers to take the customer's details — it never invents an item or a price." },
                { q: "Is my data safe?", a: "Your data is never sold. Chats on embedded agents aren't stored by us, and you can even use your own AI key for full privacy." },
                { q: "What do I get at the end?", a: "A full report with your AI readiness score, opportunities, savings, ROI, blueprints, and downloadable PDF." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 60}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{f.q}</span>
                      <span className={`text-indigo-400 text-xl transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                    </div>
                    {openFaq === i && <p className="text-slate-400 text-sm mt-3 leading-relaxed">{f.a}</p>}
                  </button>
                </Reveal>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="max-w-4xl mx-auto px-6 pb-24">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 p-12 text-center">
                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] max-w-full rounded-full bg-indigo-500/20 blur-[80px] animate-float" />
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to see your AI readiness?</h2>
                  <p className="text-slate-300 max-w-lg mx-auto mb-8">Scan your first business free. No credit card required.</p>
                  <button onClick={go} className="bg-white text-slate-900 rounded-xl px-8 py-3.5 font-semibold hover:bg-slate-100 hover:scale-105 transition">
                    Get started free
                  </button>
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}