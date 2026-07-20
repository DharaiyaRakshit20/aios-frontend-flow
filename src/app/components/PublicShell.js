"use client";
import { useRouter } from "next/navigation";
import PublicNav from "./PublicNav";

export default function PublicShell({ children }) {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col">
      <PublicNav />

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xs">Q</div>
                <span className="font-semibold">Qevora</span>
              </div>
              <p className="text-slate-500 text-sm">AI Operating System for Business.</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Product</p>
              <div className="space-y-2 text-sm text-slate-400">
                <button onClick={() => router.push("/pricing")} className="block hover:text-white transition">Pricing</button>
                <button onClick={() => router.push("/demo")} className="block hover:text-white transition">Live Demo</button>
                <button onClick={() => router.push("/docs")} className="block hover:text-white transition">Docs</button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Company</p>
              <div className="space-y-2 text-sm text-slate-400">
                <button onClick={() => router.push("/contact")} className="block hover:text-white transition">Contact</button>
                <button onClick={() => router.push("/")} className="block hover:text-white transition">Home</button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Legal</p>
              <div className="space-y-2 text-sm text-slate-400">
                <button onClick={() => router.push("/privacy")} className="block hover:text-white transition">Privacy</button>
                <button onClick={() => router.push("/terms")} className="block hover:text-white transition">Terms</button>
                <button onClick={() => router.push("/cookie-policy")} className="block hover:text-white transition">Cookie Policy</button>
                <button onClick={() => window.dispatchEvent(new Event("qv-open-consent"))} className="block hover:text-white transition">Cookie preferences</button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6">
            <p className="text-slate-500 text-sm text-center sm:text-left">© 2026 Qevora · AI Operating System for Business</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
