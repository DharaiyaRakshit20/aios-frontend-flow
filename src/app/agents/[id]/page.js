"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken, getAgent, getAgentMessages, sendAgentMessage } from "@/lib/api";
import AppShell from "../../components/AppShell";

export default function AgentChatPage() {
  const router = useRouter();
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAgent(id).then(setAgent).catch((e) => setError(e.message));
    getAgentMessages(id).then((d) => setMessages(d.results || d)).catch(() => {});
  }, [id, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setError("");
    // user message turant dikhao
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: "user", content: text }]);
    setSending(true);
    try {
      const reply = await sendAgentMessage(id, text);
      setMessages((m) => [...m, reply]);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  if (error && !agent) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-red-400">{error}</div></AppShell>;
  if (!agent) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading agent...</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[75vh]">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/agents")} className="text-slate-400 hover:text-white transition">←</button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">
              {agent.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{agent.name}</p>
              <p className="text-xs text-slate-500">{agent.role}</p>
            </div>
          </div>
          <button onClick={() => router.push(`/agents/${id}/edit`)} className="text-sm text-slate-400 hover:text-white transition">Edit</button>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-5 scrollbar-hide">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
              <p className="mb-1">Start chatting to test your agent</p>
              <p className="text-xs">Ask it something a real customer might ask.</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
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

        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

        {/* input */}
        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl px-5 font-medium hover:opacity-90 disabled:opacity-40 transition"
          >
            Send
          </button>
        </div>
      </div>
    </AppShell>
  );
}