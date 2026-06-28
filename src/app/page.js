"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

export default function Landing() {
  const router = useRouter();

  // agar already logged in hai to seedha dashboard
  useEffect(() => {
    if (getToken()) router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <span className="text-xl font-bold">AIOS</span>
        <button
          onClick={() => router.push("/login")}
          className="text-sm bg-white text-slate-900 rounded-lg px-4 py-2 font-medium hover:bg-slate-100"
        >
          Log in
        </button>
      </nav>

      {/* hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block text-xs tracking-wide uppercase bg-white/10 rounded-full px-3 py-1 mb-6">
          AI Operating System for Business
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Find out how AI can transform your business
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          AIOS scans your business, scores your AI readiness, and shows you
          exactly where to save time and money — in minutes, not months.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-slate-900 rounded-lg px-6 py-3 font-medium hover:bg-slate-100"
          >
            Get started free
          </button>
          <button
            onClick={() => router.push("/login")}
            className="border border-white/30 rounded-lg px-6 py-3 font-medium hover:bg-white/10"
          >
            See a demo
          </button>
        </div>
      </section>

      {/* features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-6">
        {[
          { t: "AI Readiness Score", d: "Get a clear 0–100 score showing how prepared your business is for AI." },
          { t: "Opportunity Map", d: "See exactly which areas give the highest impact for the least effort." },
          { t: "Savings Estimate", d: "Know how much time and money you could save every month." },
        ].map((f, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-lg font-bold">
              {i + 1}
            </div>
            <h3 className="font-semibold text-lg mb-2">{f.t}</h3>
            <p className="text-slate-400 text-sm">{f.d}</p>
          </div>
        ))}
      </section>

      {/* footer */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        © 2026 AIOS · Built for businesses ready to grow with AI
      </footer>
    </div>
  );
}