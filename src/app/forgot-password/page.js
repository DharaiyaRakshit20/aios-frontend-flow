"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/api";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!email.trim() || loading) return;
    setLoading(true); setError("");
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 mb-8 mx-auto">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">Q</div>
          <span className="text-xl font-semibold">Qevora</span>
        </button>

        {sent ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2">Check your email</h1>
            <p className="text-slate-400 text-sm mb-6">
              If an account exists for <span className="text-slate-200">{email}</span>, we&apos;ve sent a link to reset your password. It expires in 1 hour.
            </p>
            <button onClick={() => router.push("/login")} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
              Back to login
            </button>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <h1 className="text-xl font-bold mb-1">Forgot your password?</h1>
            <p className="text-slate-400 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

            <input
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition mb-4"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            <button onClick={submit} disabled={loading || !email.trim()}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl py-3 font-medium hover:opacity-90 disabled:opacity-40 transition">
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <button onClick={() => router.push("/login")} className="w-full text-sm text-slate-400 hover:text-white transition mt-4">
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
