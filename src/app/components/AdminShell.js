"use client";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/api";

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { label: "Overview", path: "/admin-panel" },
    { label: "Users", path: "/admin-panel/users" },
    { label: "Billing", path: "/admin-panel/billing" },
    { label: "Metrics", path: "/admin-panel/metrics" },
    { label: "Feedback", path: "/admin-panel/feedback" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col">
      <header className="border-b border-amber-500/20 bg-[#0a0a0f]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center font-bold text-sm">Q</div>
            <span className="text-lg font-semibold tracking-tight">Qevora <span className="text-amber-400 text-sm font-normal">Admin</span></span>
          </div>
          <nav className="flex items-center gap-5 text-sm">
            {links.map((l) => (
              <button key={l.path} onClick={() => router.push(l.path)}
                className={`transition ${pathname === l.path ? "text-white font-medium" : "text-slate-400 hover:text-white"}`}>
                {l.label}
              </button>
            ))}
            <button onClick={() => router.push("/dashboard")} className="text-slate-400 hover:text-white transition">Exit</button>
            <button onClick={() => { logout(); router.push("/login"); }} className="text-slate-400 hover:text-white transition">Log out</button>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}