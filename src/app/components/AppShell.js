"use client";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/api";

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Activity", path: "/activity" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col">
      {/* HEADER */}
      <header className="border-b border-white/5 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
            <span className="text-lg font-semibold tracking-tight">Qevora</span>
          </button>

          <nav className="flex items-center gap-5 text-sm">
            {navLinks.map((l) => (
              <button
                key={l.path}
                onClick={() => router.push(l.path)}
                className={`transition ${pathname === l.path ? "text-white font-medium" : "text-slate-400 hover:text-white"}`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="text-slate-400 hover:text-white transition"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-500">
          <p>© 2026 Qevora · AI Operating System for Business</p>
          <div className="flex gap-4">
            <button className="hover:text-slate-300 transition">Privacy</button>
            <button className="hover:text-slate-300 transition">Terms</button>
            <button className="hover:text-slate-300 transition">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}