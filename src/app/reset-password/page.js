"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "@/lib/api";
import PageLoader from "../components/PageLoader";

function ResetContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (loading) return;
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true); setError("");
    try {
      await confirmPasswordReset(token, password);
      setDone(true);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  if (!token) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
        <p className="text-slate-400 text-sm mb-5">This reset link is invalid or incomplete.</p>
        <button onClick={() => router.push("/forgot-password")} className="text-sm text-indigo-400 hover:text-indigo-300">
          Request a new link
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Password updated</h1>
        <p className="text-slate-400 text-sm mb-6">You can now log in with your new password.</p>
        <button onClick={() => router.push("/login")}
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl py-3 font-medium hover:opacity-90 transition">
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
      <h1 className="text-xl font-bold mb-1">Set a new password</h1>
      <p className="text-slate-400 text-sm mb-6">Choose a strong password you haven&apos;t used before.</p>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <input
        type="password"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition mb-3"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition mb-4"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
      />
      <button onClick={submit} disabled={loading || !password || !confirm}
        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl py-3 font-medium hover:opacity-90 disabled:opacity-40 transition">
        {loading ? "Updating..." : "Update password"}
      </button>
    </div>
  );
}

export default function ResetPassword() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 mb-8 mx-auto">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">Q</div>
          <span className="text-xl font-semibold">Qevora</span>
        </button>
        <Suspense fallback={<PageLoader />}>
          <ResetContent />
        </Suspense>
      </div>
    </div>
  );
}
