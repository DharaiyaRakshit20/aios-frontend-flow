"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">404</p>
        <h1 className="text-xl font-semibold text-slate-200 mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-6">This page doesn&apos;t exist or has been moved.</p>
        <button onClick={() => router.push("/dashboard")}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 transition">
          Back to dashboard
        </button>
      </div>
    </div>
  );
}