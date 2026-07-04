"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import Reveal from "./components/Reveal";

export default function Landing() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(() => { if (getToken()) router.push("/dashboard"); }, [router]);
  const go = () => router.push("/login");

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* animated glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-w-full rounded-full bg-indigo-600/20 blur-[110px] animate-float" />
      <div className="pointer-events-none absolute top-[40%] right-0 w-[350px] h-[350px] max-w-full rounded-full bg-violet-600/20 blur-[110px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="relative z-10">
        {/* NAV */}
        <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
            <span className="text-lg font-semibold tracking-tight">Qevora</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={go} className="text-sm text-slate-300 hover:text-white transition">Log in</button>
            <button onClick={go} className="text-sm bg-white/10 border border-white/10 rounded-lg px-4 py-2 font-medium hover:bg-white/20 transition">Get started</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="inline-block text-xs tracking-wide uppercase text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
            AI Operating System for Business
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold leading-[1.05] tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Discover how AI can
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent" style={{ animation: "gradientMove 4s ease infinite" }}>
              transform your business
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Qevora scans your business, scores your AI readiness, and shows you exactly where to save time and money — in minutes, not months.
          </p>
          <div className="flex gap-3 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <button onClick={go} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl px-7 py-3.5 font-medium hover:opacity-90 hover:scale-105 transition shadow-lg shadow-indigo-500/25">
              Scan your business free
            </button>
            <button onClick={go} className="border border-white/15 rounded-xl px-7 py-3.5 font-medium hover:bg-white/5 transition">
              See how it works
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
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything you need to go AI-ready</h2>
              <p className="text-slate-400 max-w-xl mx-auto">One scan gives you a complete, actionable picture of where AI fits in your business.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { t: "AI Readiness Score", d: "A clear 0–100 score with a maturity level, so you know exactly where you stand.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { t: "Opportunity Map", d: "See which areas give the highest impact for the least effort — no guesswork.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" },
              { t: "Savings & ROI", d: "Estimated monthly savings and annual ROI, tailored to your business.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8" },
              { t: "Recommendations", d: "A prioritized list of concrete next steps — not vague advice.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { t: "PDF Reports", d: "Export a clean report to share with your team or investors.", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
              { t: "Multiple Organizations", d: "Scan several businesses or clients from a single dashboard.", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5a4 4 0 11-8 0 4 4 0 018 0z" },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 80}>
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
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
              <p className="text-slate-400">Three simple steps from sign-up to a full AI roadmap.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: "1", t: "Add your business", d: "Create an organization and tell us about your operations." },
              { n: "2", t: "Run a scan", d: "Answer a guided questionnaire — our AI analyzes 20+ factors." },
              { n: "3", t: "Get your report", d: "Receive your score, opportunities, savings, and next steps." },
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

        {/* USE CASES */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
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
              { q: "What do I get at the end?", a: "A full report with your AI readiness score, opportunities, savings estimate, ROI, and prioritized recommendations — downloadable as a PDF." },
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

        {/* FOOTER */}
        <footer className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xs">Q</div>
              <span className="font-semibold">Qevora</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 Qevora · AI Operating System for Business</p>
            <div className="flex gap-4 text-sm text-slate-500">
              <button onClick={() => router.push("/privacy")} className="hover:text-slate-300 transition">Privacy</button>
              <button onClick={() => router.push("/terms")} className="hover:text-slate-300 transition">Terms</button>
              <button onClick={() => router.push("/contact")} className="hover:text-slate-300 transition">Contact</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}