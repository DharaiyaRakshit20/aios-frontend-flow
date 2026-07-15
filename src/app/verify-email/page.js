"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail, getToken } from "@/lib/api";

function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState("loading"); // loading | ok | fail
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!token) { setState("fail"); setError("This verification link is incomplete."); return; }
    verifyEmail(token)
      .then(() => setState("ok"))
      .catch((e) => { setState("fail"); setError(e.message); });
  }, [token]);

  if (state === "loading") {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Verifying your email...</p>
      </div>
    );
  }

  if (state === "ok") {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Email verified 🎉</h1>
        <p className="text-slate-400 text-sm mb-6">Your Qevora account is now fully set up.</p>
        <button onClick={() => router.push(getToken() ? "/dashboard" : "/login")}
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl py-3 font-medium hover:opacity-90 transition">
          {getToken() ? "Go to dashboard" : "Go to login"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-xl font-bold mb-2">Verification failed</h1>
      <p className="text-slate-400 text-sm mb-6">{error || "This link is invalid or has expired."}</p>
      <p className="text-slate-500 text-xs mb-5">Log in and use the banner on your dashboard to send a fresh link.</p>
      <button onClick={() => router.push("/login")}
        className="w-full border border-white/15 rounded-xl py-3 text-sm font-medium hover:bg-white/5 transition">
        Go to login
      </button>
    </div>
  );
}

export default function VerifyEmailPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 mb-8 mx-auto">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">Q</div>
          <span className="text-xl font-semibold">Qevora</span>
        </button>
        <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
