"use client";
import { useRouter } from "next/navigation";
import Dropdown from "../components/Dropdown";
import { useState, useEffect } from "react";
import { login, register, requestPasswordReset, logout } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [forgot, setForgot] = useState(null); // null | "form" | "sent"
  const [step, setStep] = useState(0); // 0 = personal, 1 = password
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", role: "",
    password: "", confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  // login page pe aaye = koi valid session nahi. Purana/expired token saaf karo.
  useEffect(() => {
    logout();
  }, []);

  function goToPassword() {
    setError("");
    if (!form.full_name || !form.email) {
      setError("Please fill your name and email.");
      return;
    }
    setStep(1);
  }

  async function handleRegister() {
    if (loading) return;
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...payload } = form;
      await register(payload);
      router.push("/dashboard");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleLogin() {
    setError("");
    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      router.push(data.is_platform_admin ? "/admin-panel" : "/dashboard");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleForgot() {
    setError("");
    if (!form.email.trim()) { setError("Please enter your email."); return; }
    setLoading(true);
    try {
      await requestPasswordReset(form.email.trim());
      setForgot("sent");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function openForgot() { setForgot("form"); setError(""); }
  function backToLogin() { setForgot(null); setError(""); }

  function switchMode() {
    setIsRegister(!isRegister);
    setForgot(null);
    setStep(0);
    setError("");
  }

  const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition";

  const heading = forgot === "sent" ? "Check your email"
    : forgot === "form" ? "Forgot your password?"
    : !isRegister ? "Welcome back"
    : step === 0 ? "Create your account" : "Set your password";

  const subheading = forgot === "sent" ? "We've sent you a reset link"
    : forgot === "form" ? "Enter your email and we'll send you a reset link"
    : !isRegister ? "Log in to continue to Qevora"
    : step === 0 ? "Step 1 of 2 · Your details" : "Step 2 of 2 · Password";

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0f] text-white">
      {/* LEFT — branding */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden border-r border-white/5">
        <div className="pointer-events-none absolute top-[10%] left-[10%] w-[400px] h-[400px] max-w-full rounded-full bg-indigo-600/25 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[10%] right-[10%] w-[350px] h-[350px] max-w-full rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">Q</div>
            <span className="text-xl font-semibold tracking-tight">Qevora</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Turn AI potential into
              <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                real business results
              </span>
            </h2>
            <p className="text-slate-400 max-w-md">
              Join businesses using Qevora to score their AI readiness and unlock savings they didn&apos;t know existed.
            </p>
          </div>
          <p className="text-slate-600 text-sm">© 2026 Qevora</p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
            <span className="text-lg font-semibold">Qevora</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">{heading}</h1>
          <p className="text-slate-400 text-sm mb-6">{subheading}</p>

          {isRegister && !forgot && (
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                   style={{ width: step === 0 ? "50%" : "100%" }} />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-5">
              {error}
            </div>
          )}

          {/* FORGOT — email form */}
          {forgot === "form" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input className={input} placeholder="you@company.com" type="email" value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleForgot(); }} />
              </div>
              <button onClick={handleForgot} disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20">
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <button onClick={backToLogin} className="w-full text-sm text-slate-400 hover:text-white transition">
                Back to login
              </button>
            </div>
          )}

          {/* FORGOT — sent */}
          {forgot === "sent" && (
            <div className="space-y-5">
              <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-300">
                  If an account exists for <span className="text-white font-medium">{form.email}</span>, we&apos;ve sent a link to reset your password.
                </p>
                <p className="text-xs text-slate-500 mt-2">The link expires in 1 hour.</p>
              </div>
              <button onClick={backToLogin}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20">
                Back to login
              </button>
            </div>
          )}

          {/* LOGIN */}
          {!forgot && !isRegister && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input className={input} placeholder="you@company.com" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                <input className={input} placeholder="••••••••" type="password" value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} />
              </div>
              <button onClick={openForgot} className="text-xs text-slate-400 hover:text-indigo-400 transition">
                Forgot password?
              </button>
              <button onClick={handleLogin} disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20">
                {loading ? "Please wait..." : "Log in"}
              </button>
            </div>
          )}

          {/* REGISTER STEP 0 — Personal */}
          {!forgot && isRegister && step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
                <input className={input} placeholder="John Doe" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input className={input} placeholder="you@company.com" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Phone</label>
                <input className={input} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <Dropdown
                label="Your role"
                value={form.role}
                onChange={(v) => set("role", v)}
                options={["Owner / Founder", "Manager", "Director", "Consultant", "Other"]}
              />
              <button onClick={goToPassword}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20">
                Continue
              </button>
            </div>
          )}

          {/* REGISTER STEP 1 — Password */}
          {!forgot && isRegister && step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                <input className={input} placeholder="At least 8 characters" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Confirm password</label>
                <input className={input} placeholder="Re-enter password" type="password" value={form.confirm_password} onChange={(e) => set("confirm_password", e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep(0); setError(""); }}
                  className="border border-white/10 text-slate-300 rounded-lg px-5 py-2.5 hover:bg-white/5 transition">
                  Back
                </button>
                <button onClick={handleRegister} disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20">
                  {loading ? "Creating..." : "Create account"}
                </button>
              </div>
            </div>
          )}

          {!forgot && (
            <p className="text-center text-sm text-slate-500 mt-6">
              {isRegister ? "Already have an account?" : "New to Qevora?"}{" "}
              <button onClick={switchMode} className="text-indigo-400 font-medium hover:text-indigo-300">
                {isRegister ? "Log in" : "Create account"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
