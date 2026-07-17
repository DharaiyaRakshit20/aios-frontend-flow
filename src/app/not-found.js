"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xl mx-auto mb-6">Q</div>
        <p className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-3">404</p>
        <h1 className="text-xl font-bold mb-2">Page not found</h1>
        <p className="text-slate-400 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/")}
            className="border border-white/15 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition">
            Go home
          </button>
          <button onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
