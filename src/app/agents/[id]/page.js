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
  const [tab, setTab] = useState("chat");   // chat | integrate
  const [copied, setCopied] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAgent(id).then(setAgent).catch((e) => setError(e.message));
    getAgentMessages(id).then((d) => setMessages(d.results || d)).catch(() => {});
  }, [id, router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput(""); setError("");
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: "user", content: text }]);
    setSending(true);
    try {
      const reply = await sendAgentMessage(id, text);
      setMessages((m) => [...m, reply]);
    } catch (e) { setError(e.message); }
    finally { setSending(false); }
  }

  function copy(text, which) {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(""), 2000);
  }

  if (error && !agent) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-red-400">{error}</div></AppShell>;
  if (!agent) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading agent...</div></AppShell>;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const curlExample = `curl ${apiUrl}/api/agents/${id}/public-chat \\
  -H "Authorization: Api-Key qev_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello", "history": []}'`;

  const jsExample = `async function askAgent(message, history = []) {
  const res = await fetch("${apiUrl}/api/agents/${id}/public-chat", {
    method: "POST",
    headers: {
      "Authorization": "Api-Key qev_your_key_here",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  return data.reply;
}`;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-6">
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
        </div>

        {/* tabs */}
        <div className="flex gap-1 mb-4 bg-white/[0.03] border border-white/10 rounded-lg p-1 w-fit">
          <button onClick={() => setTab("chat")} className={`px-4 py-1.5 rounded-md text-sm transition ${tab === "chat" ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "text-slate-400 hover:text-white"}`}>Test Chat</button>
          <button onClick={() => setTab("integrate")} className={`px-4 py-1.5 rounded-md text-sm transition ${tab === "integrate" ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "text-slate-400 hover:text-white"}`}>Integrate</button>
        </div>

        {tab === "chat" ? (
          <div className="flex flex-col h-[65vh]">
            <div className="flex-1 overflow-y-auto space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-5 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                  <p className="mb-1">Start chatting to test your agent</p>
                  <p className="text-xs">Ask it something a real customer might ask.</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-white/5 border border-white/10 text-slate-200"}`}>
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
            <div className="flex gap-2 mt-4">
              <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} />
              <button onClick={handleSend} disabled={sending || !input.trim()} className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl px-5 font-medium hover:opacity-90 disabled:opacity-40 transition">Send</button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* privacy note */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-sm text-slate-300">
              🔒 <span className="font-medium">Privacy-first:</span> Chats through this API are <span className="text-white">not stored</span> by Qevora. Your users&apos; conversations stay on your side.
            </div>

            {/* step 1 */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className="text-sm font-medium mb-1">1. Get an API key</p>
              <p className="text-xs text-slate-400 mb-3">Create a key to authenticate your requests.</p>
              <button onClick={() => router.push("/api-keys")} className="text-sm bg-white/10 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/20 transition">Go to API Keys →</button>
            </div>

            {/* step 2 - curl */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium">2. Call the agent (cURL)</p>
                <button onClick={() => copy(curlExample, "curl")} className="text-xs text-slate-500 hover:text-white transition">{copied === "curl" ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">{curlExample}</pre>
            </div>

            {/* step 3 - js */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium">3. Use in your app (JavaScript)</p>
                <button onClick={() => copy(jsExample, "js")} className="text-xs text-slate-500 hover:text-white transition">{copied === "js" ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">{jsExample}</pre>
              <p className="text-xs text-slate-600 mt-3">Pass <code>history</code> as an array of {`{role, content}`} to keep conversation context. You store it — we don&apos;t.</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}