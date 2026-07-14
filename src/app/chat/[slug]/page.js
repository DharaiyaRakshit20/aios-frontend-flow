"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function HostedChat() {
  const { slug } = useParams();
  const [agent, setAgent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2) + Date.now().toString(36));
  const [lang, setLang] = useState("en");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const T = {
    en: { online: "Online", greeting: "👋 Hi! How can I help you today?", sub: "Ask me anything.", placeholder: "Type a message...", send: "Send", error: "Connection error. Please try again." },
    hi: { online: "ऑनलाइन", greeting: "👋 नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?", sub: "कुछ भी पूछें।", placeholder: "मैसेज लिखें...", send: "भेजें", error: "कनेक्शन में समस्या। कृपया दोबारा कोशिश करें।" },
  };
  const t = T[lang] || T.en;

  useEffect(() => {
    fetch(`${API}/api/agents/public/${slug}/info`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setAgent)
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setSending(true);
    try {
      const doFetch = () => fetch(`${API}/api/agents/public/${slug}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages, session_id: sessionId, lang }),
        signal: AbortSignal.timeout(60000), // 60 sec (backend jagne ka time)
      });

      let res;
      try {
        res = await doFetch();
      } catch {
        // pehli koshish fail (shayad backend so raha tha) — 2 sec baad ek retry
        await new Promise((r) => setTimeout(r, 2000));
        res = await doFetch();
      }
      const data = await res.json();
      setMessages([...newHistory, { role: "assistant", content: data.reply || "Sorry, something went wrong." }]);
    } catch {
      setMessages([...newHistory, { role: "assistant", content: t.error }]);
    } finally {
      setSending(false);
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-slate-400">This chatbot is not available.</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* header */}
      <header className="border-b border-white/5 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">
            {agent.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{agent.name}</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> {t.online}
            </p>
          </div>
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs shrink-0">
            {[["en", "EN"], ["hi", "हिं"]].map(([code, lbl]) => (
              <button key={code} onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-md transition ${lang === code ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 py-16">
              <p className="mb-1">{t.greeting}</p>
              <p className="text-xs">{t.sub}</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                  : "bg-white/5 border border-white/10 text-slate-200"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* input */}
      <footer className="border-t border-white/5 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
            placeholder={t.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          />
          <button onClick={send} disabled={sending || !input.trim()}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl px-5 font-medium hover:opacity-90 disabled:opacity-40 transition">
            {t.send}
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-3">Powered by Qevora</p>
      </footer>
    </div>
  );
}

