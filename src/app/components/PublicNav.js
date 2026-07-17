"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PublicNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdown, setDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const go = () => router.push("/login");
  const nav = (path) => { setMobileMenu(false); setDropdown(null); router.push(path); };

  // landing pe ho to scroll, warna landing pe jaake scroll
  const jump = (id) => {
    setMobileMenu(false); setDropdown(null);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const productMenu = [
    { t: "AI Business Scanner", d: "Score your AI readiness", action: () => jump("features") },
    { t: "Implementation Blueprints", d: "Step-by-step AI plans", action: () => jump("features") },
    { t: "AI Agent Builder", d: "Build & deploy chatbots", action: () => jump("features") },
    { t: "Embed & API", d: "Add AI to your website", action: () => jump("features") },
    { t: "ROI Simulator", d: "See what AI could save you", action: () => jump("roi") },
  ];
  const solutionsMenu = [
    { t: "Retail & E-commerce", d: "Orders, replies, inventory", action: () => jump("use-cases") },
    { t: "Services & Agencies", d: "Reporting & client comms", action: () => jump("use-cases") },
    { t: "Healthcare", d: "Appointments & queries", action: () => jump("use-cases") },
    { t: "Manufacturing", d: "Scheduling & forecasting", action: () => jump("use-cases") },
  ];
  const resourcesMenu = [
    { t: "Live Demo", d: "See Qevora in action", action: () => nav("/demo") },
    { t: "Contact", d: "Get in touch", action: () => nav("/contact") },
    { t: "Privacy", d: "How we handle data", action: () => nav("/privacy") },
    { t: "Terms", d: "Terms of service", action: () => nav("/terms") },
  ];

  const Menu = ({ id, label, items, align = "left" }) => (
    <div className="relative" onMouseEnter={() => setDropdown(id)} onMouseLeave={() => setDropdown(null)}>
      <button className="px-3 py-2 text-sm text-slate-300 hover:text-white transition flex items-center gap-1">
        {label}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {dropdown === id && (
        <div className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full pt-2`}>
          <div className="w-72 bg-[#12121a] border border-white/10 rounded-2xl p-2 shadow-xl shadow-black/50">
            {items.map((m, i) => (
              <button key={i} onClick={m.action} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition">
                <p className="text-sm font-medium text-white">{m.t}</p>
                <p className="text-xs text-slate-500">{m.d}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => nav("/")} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-sm">Q</div>
          <span className="text-lg font-semibold tracking-tight">Qevora</span>
        </button>

        {/* desktop */}
        <div className="hidden lg:flex items-center gap-1">
          <Menu id="product" label="Product" items={productMenu} />
          <Menu id="solutions" label="Solutions" items={solutionsMenu} />
          <button onClick={() => nav("/docs")}
            className={`px-3 py-2 text-sm transition ${pathname === "/docs" ? "text-white" : "text-slate-300 hover:text-white"}`}>Docs</button>
          <button onClick={() => nav("/pricing")}
            className={`px-3 py-2 text-sm transition ${pathname === "/pricing" ? "text-white" : "text-slate-300 hover:text-white"}`}>Pricing</button>
          <Menu id="resources" label="Resources" items={resourcesMenu} align="right" />
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button onClick={go} className="text-sm text-slate-300 hover:text-white transition">Sign in</button>
          <button onClick={go} className="text-sm bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2 font-medium hover:opacity-90 transition">Get Started</button>
        </div>

        <button onClick={() => setMobileMenu(true)} className="lg:hidden text-slate-300 hover:text-white transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* mobile */}
      {mobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0a0f] overflow-y-auto">
          <div className="px-6 h-16 flex items-center justify-between border-b border-white/5">
            <span className="text-lg font-semibold">Qevora</span>
            <button onClick={() => setMobileMenu(false)} className="text-slate-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Product</p>
              {productMenu.map((m, i) => (
                <button key={i} onClick={m.action} className="block w-full text-left py-2 text-slate-200 hover:text-white">{m.t}</button>
              ))}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Solutions</p>
              {solutionsMenu.map((m, i) => (
                <button key={i} onClick={m.action} className="block w-full text-left py-2 text-slate-200 hover:text-white">{m.t}</button>
              ))}
            </div>
            <div className="space-y-1">
              <button onClick={() => nav("/docs")} className="block w-full text-left py-2 text-slate-200 hover:text-white">Docs</button>
              <button onClick={() => nav("/pricing")} className="block w-full text-left py-2 text-slate-200 hover:text-white">Pricing</button>
              <button onClick={() => nav("/demo")} className="block w-full text-left py-2 text-slate-200 hover:text-white">Live Demo</button>
              <button onClick={() => nav("/contact")} className="block w-full text-left py-2 text-slate-200 hover:text-white">Contact</button>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <button onClick={go} className="border border-white/15 rounded-xl py-3 text-sm font-medium hover:bg-white/5 transition">Sign in</button>
              <button onClick={go} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl py-3 text-sm font-medium hover:opacity-90 transition">Get Started</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
