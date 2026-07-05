"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import CodeBlock from "../components/CodeBlock";

export default function DocsPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [section, setSection] = useState("intro");

  const endpoints = [
    {
      id: "intro", label: "Introduction",
    },
    {
      id: "auth", label: "Authentication",
    },
    {
      id: "scan", label: "Run a Scan",
      method: "POST", path: "/api/scanner/scan",
      desc: "Analyze a business and get an AI readiness report.",
      snippets: {
        curl: `curl ${apiUrl}/api/scanner/scan \\
  -H "Authorization: Api-Key qev_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "organization": 1,
    "intake": { "industry": "retail", "team_size": "20" }
  }'`,
        javascript: `const res = await fetch("${apiUrl}/api/scanner/scan", {
  method: "POST",
  headers: {
    "Authorization": "Api-Key qev_your_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    organization: 1,
    intake: { industry: "retail", team_size: "20" },
  }),
});
const report = await res.json();`,
        python: `import requests

res = requests.post(
    "${apiUrl}/api/scanner/scan",
    headers={"Authorization": "Api-Key qev_your_key"},
    json={"organization": 1, "intake": {"industry": "retail", "team_size": "20"}},
)
report = res.json()`,
      },
    },
    {
      id: "reports", label: "List Reports",
      method: "GET", path: "/api/scanner/reports",
      desc: "Get all scan reports for your account.",
      snippets: {
        curl: `curl ${apiUrl}/api/scanner/reports \\
  -H "Authorization: Api-Key qev_your_key"`,
        javascript: `const res = await fetch("${apiUrl}/api/scanner/reports", {
  headers: { "Authorization": "Api-Key qev_your_key" },
});
const reports = await res.json();`,
        python: `import requests
res = requests.get(
    "${apiUrl}/api/scanner/reports",
    headers={"Authorization": "Api-Key qev_your_key"},
)
reports = res.json()`,
      },
    },
    {
      id: "agent", label: "Chat with an Agent",
      method: "POST", path: "/api/agents/{agent_id}/public-chat",
      desc: "Send a message to an AI agent and get a reply. Chats are not stored by Qevora — you keep the history.",
      snippets: {
        curl: `# Replace {agent_id} with your agent's ID (see it in the agent's page)
curl ${apiUrl}/api/agents/{agent_id}/public-chat \\
  -H "Authorization: Api-Key qev_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What are your hours?", "history": []}'`,
        javascript: `// Replace {agent_id} with your agent's ID
async function askAgent(message, history = []) {
  const res = await fetch("${apiUrl}/api/agents/{agent_id}/public-chat", {
    method: "POST",
    headers: {
      "Authorization": "Api-Key qev_your_key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  return data.reply;  // agent's reply
}`,
        python: `# Replace {agent_id} with your agent's ID
import requests

def ask_agent(message, history=None):
    res = requests.post(
        "${apiUrl}/api/agents/{agent_id}/public-chat",
        headers={"Authorization": "Api-Key qev_your_key"},
        json={"message": message, "history": history or []},
    )
    return res.json()["reply"]`,
      },
    },
  ];

  const current = endpoints.find((e) => e.id === section);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          {/* sidebar */}
          <aside className="space-y-1 md:sticky md:top-24 h-fit">
            <p className="text-xs uppercase tracking-wide text-slate-600 mb-2 px-3">API Reference</p>
            {endpoints.map((e) => (
              <button key={e.id} onClick={() => setSection(e.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${section === e.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                {e.label}
              </button>
            ))}
            <div className="pt-4 px-3">
              <button onClick={() => router.push("/api-keys")} className="text-xs text-indigo-400 hover:text-indigo-300">Manage API Keys →</button>
            </div>
          </aside>

          {/* content */}
          <div className="min-w-0 space-y-6">
            {section === "intro" && (
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Qevora API</h1>
                <p className="text-slate-400">Integrate Qevora into your own apps, websites, and workflows. Run scans, fetch reports, and chat with your AI agents — all from your code.</p>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-sm text-slate-300">
                  🔒 <span className="font-medium">Privacy-first:</span> Agent chats through the API are never stored by Qevora. Your users&apos; conversations stay on your side.
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <p className="text-sm font-medium mb-2">Base URL</p>
                  <code className="text-sm text-indigo-300 bg-black/40 px-3 py-1.5 rounded-lg">{apiUrl}</code>
                </div>
                <button onClick={() => setSection("auth")} className="text-indigo-400 hover:text-indigo-300 text-sm">Next: Authentication →</button>
              </div>
            )}

            {section === "auth" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Authentication</h1>
                <p className="text-slate-400 text-sm">All API requests require an API key in the <code className="text-indigo-300">Authorization</code> header. Create one from the API Keys page.</p>
                <CodeBlock snippets={{
                  curl: `-H "Authorization: Api-Key qev_your_key"`,
                  javascript: `headers: {
  "Authorization": "Api-Key qev_your_key"
}`,
                  python: `headers = {"Authorization": "Api-Key qev_your_key"}`,
                }} />
                <button onClick={() => router.push("/api-keys")} className="text-sm bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2 font-medium hover:opacity-90 transition">Create an API Key</button>
              </div>
            )}

            {current?.snippets && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">{current.label}</h1>
                  <span className={`text-xs px-2 py-1 rounded-md font-mono ${current.method === "GET" ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"}`}>{current.method}</span>
                </div>
                <code className="text-sm text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg inline-block break-all">{current.path}</code>
                <p className="text-slate-400 text-sm">{current.desc}</p>

                {/* agent id helper — sirf agent endpoint pe */}
                {current.id === "agent" && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-slate-400">
                    <p className="text-white font-medium mb-1">Where do I find my agent ID?</p>
                    <p>Open the agent from your <button onClick={() => router.push("/agents")} className="text-indigo-400 hover:text-indigo-300">Agents</button> page. The number in the address bar is your agent ID — for example, in <code className="text-indigo-300">/agents/4</code> the ID is <code className="text-indigo-300">4</code>. The agent&apos;s own <span className="text-white">&quot;API&quot;</span> and <span className="text-white">&quot;Add to Website&quot;</span> tabs also show ready-to-copy code with your ID already filled in.</p>
                  </div>
                )}

                <CodeBlock snippets={current.snippets} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}