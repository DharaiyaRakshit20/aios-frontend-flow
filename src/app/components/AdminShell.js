"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout, getProfile } from "@/lib/api";

const LINKS = [
  { label: "Overview", path: "/admin-panel", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
  { label: "Users", path: "/admin-panel/users", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "Billing", path: "/admin-panel/billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Metrics", path: "/admin-panel/metrics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Feedback", path: "/admin-panel/feedback", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z" },
];

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebar, setSidebar] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => { getProfile().then(setUser).catch(() => {}); }, []);

  function go(path) { setSidebar(false); router.push(path); }

  const displayName = user?.full_name || user?.email || "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* mobile overlay */}
      {sidebar && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebar(false)} />}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0c0c14] border-r border-amber-500/15 z-50 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebar ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-2 px-5 h-16 border-b border-amber-500/15 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center font-bold text-sm">Q</div>
          <span className="text-lg font-semibold tracking-tight">Qevora <span className="text-amber-400 text-sm font-normal">Admin</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {LINKS.map((l) => {
            const active = pathname === l.path;
            return (
              <button key={l.path} onClick={() => go(l.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active ? "bg-amber-500/15 text-white border border-amber-500/25" : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}>
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={l.icon} />
                </svg>
                {l.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-amber-500/15 shrink-0 space-y-1">
          <button onClick={() => go("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
            Exit to app
          </button>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 border-b border-amber-500/20 bg-[#0a0a0f]/90 backdrop-blur flex items-center justify-between px-4 sm:px-6">
          <button onClick={() => setSidebar(true)} className="lg:hidden text-slate-300 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 lg:hidden text-center text-sm font-medium text-amber-400">Admin</div>

          <button onClick={() => go("/profile")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm font-bold">{initial}</div>
            <span className="text-sm text-slate-300 group-hover:text-white transition hidden sm:block max-w-[140px] truncate">{displayName}</span>
          </button>
        </header>

        <main className="w-full px-4 sm:px-6 lg:px-10 py-8 [&>div]:max-w-none [&>div]:mx-0 [&>div]:px-0 [&>div]:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}
