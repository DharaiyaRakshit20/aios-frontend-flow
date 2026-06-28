"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">AIOS</h1>
        <p className="text-slate-500 mb-6 text-sm">
          {isRegister ? "Create your account" : "Welcome back"}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {isRegister && (
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isRegister ? "Sign up" : "Log in"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-slate-900 font-medium underline"
          >
            {isRegister ? "Log in" : "Create account"}
          </button>
        </p>
      </div>
    </div>
  );
}