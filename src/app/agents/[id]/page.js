"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken, getAgent, getAgentMessages, sendAgentMessage, takeActionOrder, takeActionVerify } from "@/lib/api";
import AppShell from "../../components/AppShell";
import CodeBlock from "../../components/CodeBlock";
import ThumbFeedback from "../../components/ThumbFeedback";

export default function AgentChatPage() {
  const router = useRouter();
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("chat");
  const [copied, setCopied] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const bottomRef = useRef(null);
  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAgent(id).then(setAgent).catch((e) => setError(e.message));
    getAgentMessages(id).then((d) => setMessages(d.results || d)).catch(() => {});

    // razorpay script load karo (take action payment ke liye)
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
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

  async function handleTakeAction() {
    setShowActionConfirm(false);
    setActionBusy(true);
    try {
      const order = await takeActionOrder(id);
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Qevora",
        description: "Take Action — Activate your chatbot",
        order_id: order.order_id,
        handler: async function (response) {
          try {
            const res = await takeActionVerify(id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setActionDone(true);
            router.push(`/agents/${id}/action?slug=${res.slug}`);
          } catch (e) {
            alert("Verification failed: " + e.message);
          } finally { setActionBusy(false); }
        },
        modal: { ondismiss: () => setActionBusy(false) },
        theme: { color: "#6366f1" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      alert(e.message);
      setActionBusy(false);
    }
  }

  if (error && !agent) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-red-400">{error}</div></AppShell>;
  if (!agent) return <AppShell><div className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading agent...</div></AppShell>;

  // base url — trailing slash hata do (double-slash bug fix)
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
  const widgetUrl = (typeof window !== "undefined" ? window.location.origin : "") + "/widget.js";

  // user ki key — agar hai to prefix wali dikhao, warna placeholder
  const hasKeys = apiKeys.length > 0;
  const keyPlaceholder = hasKeys ? `${apiKeys[0].prefix}...your_key` : "qev_your_api_key";

  const embedCode = `<script src="${widgetUrl}"
  data-agent="${id}"
  data-key="${keyPlaceholder}"
  data-api="${apiUrl}"
  data-title="Chat with us"
  data-color="#6366f1"></script>`;

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const curlExample = `curl ${apiUrl}/api/agents/${id}/public-chat \\
  -H "Authorization: Api-Key ${keyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello", "history": []}'`;

  const jsExample = `async function askAgent(message, history = []) {
  const res = await fetch("${apiUrl}/api/agents/${id}/public-chat", {
    method: "POST",
    headers: {
      "Authorization": "Api-Key ${keyPlaceholder}",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  return data.reply;
}`;

  const pyExample = `import requests

def ask_agent(message, history=None):
    res = requests.post(
        "${apiUrl}/api/agents/${id}/public-chat",
        headers={"Authorization": "Api-Key ${keyPlaceholder}"},
        json={"message": message, "history": history or []},
    )
    return res.json()["reply"]`;

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
          {agent.is_public ? (
            <button onClick={() => router.push(`/agents/${id}/action?slug=${agent.public_slug}`)}
              className="text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg px-4 py-2 hover:bg-emerald-500/20 transition">
              ✓ Live — View setup
            </button>
          ) : (
            <button onClick={() => setShowActionConfirm(true)} disabled={actionBusy}
              className="text-sm bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg px-4 py-2 font-medium hover:opacity-90 disabled:opacity-50 transition">
              {actionBusy ? "Processing..." : "⚡ Take Action"}
            </button>
          )}
        </div>

        {/* tabs */}
        <div className="flex gap-1 mb-4 bg-white/[0.03] border border-white/10 rounded-lg p-1 w-fit">
          {[["chat", "Test Chat"], ["embed", "Add to Website"], ["api", "API"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-md text-sm transition ${tab === k ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "text-slate-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* CHAT */}
        {tab === "chat" && (
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
                  {/* YAHAN, message content ke neeche */}
                  {m.role === "assistant" && (
                    <ThumbFeedback targetType="agent_message" targetId={m.id || i} />
                  )}
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
        )}

        {/* EMBED */}
        {tab === "embed" && (
          <div className="space-y-5">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-sm text-slate-300">
              🔒 Chats are <span className="text-white">not stored</span> by Qevora. Add this chatbot to any website in seconds.
            </div>

            {!hasKeys && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-sm text-amber-300">
                You need an API key first. <button onClick={() => router.push("/api-keys")} className="underline hover:text-amber-200">Create one →</button>
              </div>
            )}

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Paste this before &lt;/body&gt; on your website</p>
                <button onClick={copyEmbed} className="text-xs text-slate-500 hover:text-white transition">{copied ? "Copied!" : "Copy code"}</button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Replace <code className="text-indigo-300">{keyPlaceholder}</code> with your full API key from the <button onClick={() => router.push("/api-keys")} className="text-indigo-400 hover:text-indigo-300">API Keys</button> page. Everything else is already set for this agent.
              </p>
              <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">{embedCode}</pre>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm text-slate-400">
              <p className="font-medium text-white mb-2">Customize (optional)</p>
              <ul className="space-y-1 text-xs">
                <li><code className="text-indigo-300">data-title</code> — chat window title</li>
                <li><code className="text-indigo-300">data-color</code> — theme color (hex)</li>
              </ul>
            </div>
          </div>
        )}

        {/* API */}
        {tab === "api" && (
          <div className="space-y-5">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className="text-sm font-medium mb-1">Call the agent from your code</p>
              <p className="text-xs text-slate-400 mb-4">
                Agent ID <code className="text-indigo-300">{id}</code> is already set. Replace <code className="text-indigo-300">{keyPlaceholder}</code> with your full API key.
              </p>
              <CodeBlock snippets={{ curl: curlExample, javascript: jsExample, python: pyExample }} />
              <p className="text-xs text-slate-600 mt-3">Full reference in <button onClick={() => router.push("/docs")} className="text-indigo-400 hover:text-indigo-300">API Docs →</button></p>
            </div>
          </div>
        )}
      </div>
      {showActionConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowActionConfirm(false)}>
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 text-xl">⚡</div>
              <h3 className="text-lg font-semibold mb-2 text-center">Take Action</h3>
              <p className="text-slate-400 text-sm mb-1 text-center">Activate this agent as a live chatbot you can share with your customers.</p>
              <p className="text-slate-500 text-xs mb-6 text-center">A one-time activation fee of <span className="text-white font-medium">₹1</span> applies.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowActionConfirm(false)} className="flex-1 border border-white/10 text-slate-300 rounded-lg py-2.5 text-sm hover:bg-white/5 transition">Cancel</button>
                <button onClick={handleTakeAction} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition">Pay ₹1 & Activate</button>
              </div>
            </div>
          </div>
        )}
    </AppShell>
  );
}