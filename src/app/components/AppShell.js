"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout, getNotifications, getUnreadCount, markNotificationsRead, clearNotifications, getProfile } from "@/lib/api";

const NAV = [
  { label: "Dashboard", path: "/dashboard", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
  { label: "Organizations", path: "/organizations", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Agents", path: "/agents", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.8-4A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { label: "Inquiries", path: "/inquiries", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
  { label: "Pricing", path: "/pricing", icon: "M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" },
  { label: "API Keys", path: "/api-keys", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
  { label: "Docs", path: "/docs", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { label: "Profile", path: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Support", path: "/support", icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 6.396a3 3 0 01-4.243-4.242m4.243 4.242L18.364 18.364" },
  { label: "Support Messages", path: "/admin-panel/support", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.8-4A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { label: "Knowledge", path: "/knowledge", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { label: "Activity", path: "/activity", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

// yeh top-level pages hain (sidebar wale) — inpe back nahi chahiye
const TOP_LEVEL = ["/dashboard", "/organizations", "/agents", "/inquiries", "/pricing", "/api-keys", "/docs", "/profile", "/activity", "/support", "/knowledge"];

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);      // bell dropdown
  const [sidebar, setSidebar] = useState(false); // mobile sidebar
  const [user, setUser] = useState(null);
  const bellRef = useRef(null);

  useEffect(() => { getProfile().then(setUser).catch(() => {}); }, []);

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

  function go(path) {
    setSidebar(false);
    router.push(path);
  }

  async function toggleBell() {
    if (!open) {
      const data = await getNotifications().catch(() => []);
      setNotifs(data.results || data || []);
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
    setNotifs([]); setUnread(0);
  }

  async function handleMarkAllRead(e) {
    e.stopPropagation();
    await markNotificationsRead().catch(() => {});
    setNotifs((list) => list.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
  }
  async function handleClearOne(e, id) {
    e.stopPropagation();
    await clearNotifications(id).catch(() => {});
    setNotifs((list) => list.filter((n) => n.id !== id));
  }

  function timeAgo(d) {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString();
  }

  const displayName = user?.full_name || user?.email || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* mobile overlay */}
      {sidebar && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebar(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0c0c14] border-r border-white/5 z-50 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebar ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => go("/dashboard")} className="flex items-center gap-2 px-5 h-16 border-b border-white/5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
          <span className="text-lg font-semibold tracking-tight">Qevora</span>
        </button>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.filter((l) => l.path !== "/admin-panel/support" || user?.is_platform_admin).map((l) => {
            const active = pathname === l.path;
            return (
              <button key={l.path} onClick={() => go(l.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active ? "bg-indigo-500/15 text-white border border-indigo-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}>
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={l.icon} />
                </svg>
                {l.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 shrink-0">
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
        {/* HEADER */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur flex items-center justify-between px-4 sm:px-6">
          {/* hamburger (mobile) */}
          <button onClick={() => setSidebar(true)} aria-label="Open menu" className="lg:hidden text-slate-300 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {/* bell */}
            <div ref={bellRef} className="relative">
              <button onClick={toggleBell} aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"} className="relative text-slate-400 hover:text-white transition flex">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">{unread}</span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 bg-[#12121a] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Notifications</span>
                    {notifs.length > 0 && (
                      <div className="flex items-center gap-3">
                        {notifs.some((n) => !n.is_read) && (
                          <button onClick={handleMarkAllRead} className="text-xs text-slate-500 hover:text-indigo-400 transition">Mark all read</button>
                        )}
                        <button onClick={handleClearAll} className="text-xs text-slate-500 hover:text-red-400 transition">Clear all</button>
                      </div>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto no-scrollbar">
                    {notifs.length === 0 ? (
                      <p className="px-4 py-8 text-center text-slate-500 text-sm">No notifications yet.</p>
                    ) : notifs.map((n) => (
                      <div key={n.id} className={`relative group border-b border-white/5 last:border-0 ${!n.is_read ? "bg-indigo-500/5" : ""}`}>
                        <button onClick={() => openNotif(n)} className="w-full text-left px-4 py-3 pr-8 hover:bg-white/5 transition">
                          <div className="flex items-start gap-2">
                            {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />}
                            <div className={`min-w-0 ${n.is_read ? "pl-3.5" : ""}`}>
                              <p className={`text-sm ${n.is_read ? "text-slate-300" : "font-medium text-white"}`}>{n.title}</p>
                              {n.message && <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>}
                              <p className="text-xs text-slate-600 mt-1">{timeAgo(n.created_at)}</p>
                            </div>
                          </div>
                        </button>
                        <button onClick={(e) => handleClearOne(e, n.id)} aria-label="Dismiss notification"
                          className="absolute top-3 right-3 text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* user name */}
            <button onClick={() => go("/profile")} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold">{initial}</div>
              <span className="text-sm text-slate-300 group-hover:text-white transition hidden sm:block max-w-[140px] truncate">{displayName}</span>
            </button>
          </div>
        </header>

        <main id="main-content" className="w-full px-4 sm:px-6 lg:px-10 py-8 [&>div]:max-w-none [&>div]:mx-0 [&>div]:px-0 [&>div]:py-0">
          {!TOP_LEVEL.includes(pathname) && (
            <button onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition mb-5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}