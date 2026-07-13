"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout, getNotifications, getUnreadCount, markNotificationsRead, clearNotifications } from "@/lib/api";

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Agents", path: "/agents" },
    { label: "Inquiries", path: "/inquiries" },
    { label: "Pricing", path: "/pricing" },
    { label: "API Keys", path: "/api-keys" },
    { label: "Docs", path: "/docs" },
    { label: "Profile", path: "/profile" },
    { label: "Activity", path: "/activity" },
  ];

  useEffect(() => {
    getUnreadCount().then((d) => setUnread(d.unread)).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function toggleBell() {
    if (!open) {
      const data = await getNotifications().catch(() => []);
      setNotifs(data.results || data || []);
      if (unread > 0) { markNotificationsRead().catch(() => {}); setUnread(0); }
    }
    setOpen((o) => !o);
  }

  function openNotif(n) {
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  async function handleClearAll(e) {
    e.stopPropagation();
    await clearNotifications().catch(() => {});
    setNotifs([]);
    setUnread(0);
  }

  async function handleClearOne(e, id) {
    e.stopPropagation();
    await clearNotifications(id).catch(() => {});
    setNotifs((list) => list.filter((n) => n.id !== id));
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col">
      <header className="border-b border-white/5 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
            <span className="text-lg font-semibold tracking-tight">Qevora</span>
          </button>

          <nav className="flex items-center gap-5 text-sm">
            {navLinks.map((l) => (
              <button key={l.path} onClick={() => router.push(l.path)}
                className={`transition ${pathname === l.path ? "text-white font-medium" : "text-slate-400 hover:text-white"}`}>
                {l.label}
              </button>
            ))}

            {/* bell */}
            <div ref={bellRef} className="relative">
              <button onClick={toggleBell} className="relative text-slate-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">{unread}</span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-80 bg-[#12121a] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium">Notifications</span>
                    {notifs.length > 0 && (
                      <button onClick={handleClearAll} className="text-xs text-slate-500 hover:text-red-400 transition">Clear all</button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="px-4 py-8 text-center text-slate-500 text-sm">No notifications yet.</p>
                    ) : notifs.map((n) => (
                      <div key={n.id} className={`relative group border-b border-white/5 last:border-0 ${!n.is_read ? "bg-indigo-500/5" : ""}`}>
                        <button onClick={() => openNotif(n)} className="w-full text-left px-4 py-3 pr-8 hover:bg-white/5 transition">
                          <p className="text-sm font-medium">{n.title}</p>
                          {n.message && <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>}
                          <p className="text-xs text-slate-600 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                        </button>
                        <button onClick={(e) => handleClearOne(e, n.id)}
                          className="absolute top-3 right-3 text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => { logout(); router.push("/login"); }} className="text-slate-400 hover:text-white transition">Log out</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-500">
          <p>© 2026 Qevora · AI Operating System for Business</p>
          <div className="flex gap-4">
            <button onClick={() => router.push("/privacy")} className="hover:text-slate-300 transition">Privacy</button>
            <button onClick={() => router.push("/terms")} className="hover:text-slate-300 transition">Terms</button>
            <button onClick={() => router.push("/contact")} className="hover:text-slate-300 transition">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}