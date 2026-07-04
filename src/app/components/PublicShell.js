"use client";
import { useRouter } from "next/navigation";

export default function PublicShell({ children }) {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col">
      {/* header */}
      <header className="border-b border-white/5 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => router.push("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
            <span className="text-lg font-semibold tracking-tight">Qevora</span>
          </button>
          <button onClick={() => router.push("/login")} className="text-sm bg-white/10 border border-white/10 rounded-lg px-4 py-2 font-medium hover:bg-white/20 transition">
            Get started
          </button>
        </div>
      </header>

      {/* content */}
      <main className="flex-1 w-full">{children}</main>

      {/* footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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
  );
}