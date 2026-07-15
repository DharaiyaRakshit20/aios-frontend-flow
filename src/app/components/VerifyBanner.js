"use client";
import { useEffect, useState } from "react";
import { getProfile, resendVerification } from "@/lib/api";

export default function VerifyBanner() {
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getProfile()
      .then((u) => { if (u && u.is_email_verified === false) setShow(true); })
      .catch(() => {});
  }, []);

  async function resend() {
    if (sending) return;
    setSending(true);
    try { await resendVerification(); setSent(true); }
    catch {}
    finally { setSending(false); }
  }

  if (!show) return null;

  return (
    <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div className="flex items-start gap-3 flex-1">
        <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-amber-200">Please verify your email</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {sent ? "Verification email sent — check your inbox." : "We sent you a link when you signed up. Verify to secure your account."}
          </p>
        </div>
      </div>
      {!sent && (
        <button onClick={resend} disabled={sending}
          className="text-xs bg-amber-500/15 border border-amber-500/25 text-amber-200 rounded-lg px-4 py-2 hover:bg-amber-500/25 disabled:opacity-50 transition shrink-0">
          {sending ? "Sending..." : "Resend email"}
        </button>
      )}
      <button onClick={() => setShow(false)} className="text-slate-500 hover:text-white transition text-sm shrink-0 hidden sm:block">✕</button>
    </div>
  );
}