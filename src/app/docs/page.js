"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import CodeBlock from "../components/CodeBlock";
import { getToken } from "@/lib/api";
import PublicShell from "../components/PublicShell";

export default function DocsPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [section, setSection] = useState("intro");
  const [search, setSearch] = useState("");
  const [tryKey, setTryKey] = useState("");
  const [tryBody, setTryBody] = useState("");
  const [tryBusy, setTryBusy] = useState(false);
  const [tryResult, setTryResult] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);   // null = abhi pata nahi

  useEffect(() => { setLoggedIn(!!getToken()); }, []);

  const endpoints = [
    { id: "intro", label: "Introduction" },
    { id: "auth", label: "Authentication" },
    {
      id: "org", label: "Create Organization",
      method: "POST", path: "/api/organizations/",
      desc: "Create an organization (business). You'll use its ID to run scans and create agents.",
      snippets: {
        curl: `curl ${apiUrl}/api/organizations/ \\
  -H "Authorization: Api-Key qev_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Shop", "industry": "retail"}'`,
        javascript: `const res = await fetch("${apiUrl}/api/organizations/", {
  method: "POST",
  headers: {
    "Authorization": "Api-Key qev_your_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "My Shop", industry: "retail" }),
});
const org = await res.json();
// org.id ko scan / agent me use karo`,
        python: `import requests
res = requests.post(
    "${apiUrl}/api/organizations/",
    headers={"Authorization": "Api-Key qev_your_key"},
    json={"name": "My Shop", "industry": "retail"},
)
org = res.json()
# org["id"] ko scan / agent me use karo`,
      },
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

  function defaultBody(id) {
    if (id === "org") return JSON.stringify({ name: "My Shop", industry: "retail" }, null, 2);
    if (id === "scan") return JSON.stringify({ organization: 1, intake: { industry: "retail", team_size: "20" } }, null, 2);
    if (id === "agent") return JSON.stringify({ agent_id: 1, message: "Hello, what are your hours?", history: [] }, null, 2);
    return "";
  }

  // endpoint badle -> body reset, purana result hatao
  useEffect(() => {
    setTryBody(defaultBody(section));
    setTryResult(null);
  }, [section]);

  const filteredEndpoints = endpoints.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (e.label || "").toLowerCase().includes(q)
      || (e.path || "").toLowerCase().includes(q)
      || (e.desc || "").toLowerCase().includes(q);
  });

  // response ki values ko demo se badlo — keys asli rehti hain, list se sirf 1 item
  function maskValues(v, key = "") {
    if (Array.isArray(v)) return v.length ? [maskValues(v[0], key)] : [];
    if (v && typeof v === "object") {
      const out = {};
      Object.keys(v).forEach((k) => { out[k] = maskValues(v[k], k); });
      return out;
    }
    if (typeof v === "number") {
      if (/score/i.test(key)) return 42;
      if (/inr|amount|saving|cost|price/i.test(key)) return 35000;
      if (/percent|roi/i.test(key)) return 180;
      if (/id$/i.test(key)) return 1;
      if (/count|total/i.test(key)) return 3;
      return 10;
    }
    if (typeof v === "boolean") return true;
    if (v === null) return null;
    const s = String(v);
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return "2026-07-18T10:24:00Z";
    if (/email/i.test(key)) return "you@example.com";
    if (/phone/i.test(key)) return "+91 98765 43210";
    if (/name/i.test(key)) return "Example Name";
    if (/^(status|role|impact|effort|method|currency|language|maturity_level)$/i.test(key)) return s;
    if (/summary|overview|desc|reply|content|message|detail|title|area|recommendation/i.test(key)) {
      return "Example text — your real content appears here.";
    }
    return "example";
  }

  async function runTry() {
    if (!tryKey.trim() || !current?.path || tryBusy) return;
    setTryBusy(true); setTryResult(null);
    try {
      let path = current.path;
      let body = null;

      if (current.method === "POST") {
        try {
          body = JSON.parse(tryBody);
        } catch {
          setTryResult({ status: "error", body: "Your JSON isn't valid. Check for missing commas or quotes." });
          setTryBusy(false);
          return;
        }
        if (current.id === "agent") {
          const aid = body.agent_id || 1;
          path = path.replace("{agent_id}", aid);
          delete body.agent_id;
        }
      }

      const opts = {
        method: current.method,
        headers: { "Authorization": `Api-Key ${tryKey.trim()}`, "Content-Type": "application/json" },
      };
      if (body) opts.body = JSON.stringify(body);

      const res = await fetch(`${apiUrl}${path}`, opts);
      const raw = await res.json().catch(() => ({}));
      const shown = res.ok ? maskValues(raw) : raw;

      setTryResult({
        status: res.status,
        masked: res.ok,
        body: JSON.stringify(shown, null, 2).slice(0, 3000),
      });
    } catch (e) {
      setTryResult({ status: "error", body: e.message });
    } finally { setTryBusy(false); }
  }

  const content = (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* sidebar */}
        <aside className="space-y-1 md:sticky md:top-24 h-fit">
          <p className="text-xs uppercase tracking-wide text-slate-600 mb-2 px-3">API Reference</p>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition mb-3"
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredEndpoints.map((e) => (
            <button key={e.id} onClick={() => setSection(e.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${section === e.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              {e.label}
            </button>
          ))}
          {filteredEndpoints.length === 0 && <p className="text-xs text-slate-600 px-3 py-2">No matches.</p>}
          <div className="pt-4 px-3">
            {loggedIn ? (
              <button onClick={() => router.push("/api-keys")} className="text-xs text-indigo-400 hover:text-indigo-300">Manage API Keys →</button>
            ) : (
              <button onClick={() => router.push("/login")} className="text-xs text-indigo-400 hover:text-indigo-300">Sign up for an API key →</button>
            )}
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
              <button onClick={() => router.push(loggedIn ? "/api-keys" : "/login")}
                className="text-sm bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2 font-medium hover:opacity-90 transition">
                {loggedIn ? "Create an API Key" : "Create free account"}
              </button>
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

              {/* agent id helper */}
              {current.id === "agent" && loggedIn && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-slate-400">
                  <p className="text-white font-medium mb-1">Where do I find my agent ID?</p>
                  <p>Open the agent from your <button onClick={() => router.push("/agents")} className="text-indigo-400 hover:text-indigo-300">Agents</button> page. The number in the address bar is your agent ID — for example, in <code className="text-indigo-300">/agents/4</code> the ID is <code className="text-indigo-300">4</code>. The agent&apos;s own <span className="text-white">&quot;API&quot;</span> and <span className="text-white">&quot;Add to Website&quot;</span> tabs also show ready-to-copy code with your ID already filled in.</p>
                </div>
              )}

              <CodeBlock snippets={current.snippets} />

              {loggedIn ? (
                /* Try it */
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div>
                    <p className="text-sm font-medium">Try it</p>
                    <p className="text-xs text-slate-500 mt-0.5">Send a real request and see the response structure.</p>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">
                      API key
                      <button onClick={() => router.push("/api-keys")} className="text-indigo-400 hover:text-indigo-300 ml-2">Get one →</button>
                    </label>
                    <input
                      type="password"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition font-mono"
                      placeholder="qev_your_api_key"
                      value={tryKey}
                      onChange={(e) => setTryKey(e.target.value)}
                    />
                  </div>

                  {current.method === "POST" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-slate-400">Request body (JSON) — edit this</label>
                        <button onClick={() => setTryBody(defaultBody(current.id))} className="text-xs text-slate-500 hover:text-white transition">Reset</button>
                      </div>
                      <textarea
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none transition min-h-[130px] resize-y no-scrollbar"
                        value={tryBody}
                        onChange={(e) => setTryBody(e.target.value)}
                        spellCheck={false}
                      />

                      <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 mt-2 text-xs text-slate-400 space-y-1.5">
                        <p className="text-white font-medium">What to put here</p>
                        {current.id === "org" && (
                          <>
                            <p><code className="text-indigo-300">name</code> — your business name (required).</p>
                            <p><code className="text-indigo-300">industry</code> — e.g. retail, healthcare (optional).</p>
                            <p className="text-slate-500">The response includes an <code className="text-indigo-300">id</code> — copy it and use it as <code className="text-indigo-300">organization</code> when you run a scan.</p>
                          </>
                        )}
                        {current.id === "scan" && (
                          <>
                            <p><code className="text-indigo-300">organization</code> — your org ID. Open <button onClick={() => router.push("/organizations")} className="text-indigo-400 hover:text-indigo-300">Organizations</button> → Settings; the number in the URL (<code className="text-indigo-300">/org/3</code>) is the ID.</p>
                            <p><code className="text-indigo-300">intake</code> — your business details. The more you give (industry, team_size, current_tools, pain_points, goals), the better the report.</p>
                          </>
                        )}
                        {current.id === "agent" && (
                          <>
                            <p><code className="text-indigo-300">agent_id</code> — open <button onClick={() => router.push("/agents")} className="text-indigo-400 hover:text-indigo-300">Agents</button> → your agent; the number in the URL (<code className="text-indigo-300">/agents/4</code>) is the ID.</p>
                            <p><code className="text-indigo-300">message</code> — what the customer says.</p>
                            <p><code className="text-indigo-300">history</code> — past turns, e.g. <code className="text-indigo-300">[&#123;&quot;role&quot;:&quot;user&quot;,&quot;content&quot;:&quot;Hi&quot;&#125;]</code>. Empty <code className="text-indigo-300">[]</code> starts fresh.</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <button onClick={runTry} disabled={tryBusy || !tryKey.trim()}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition">
                    {tryBusy ? "Sending..." : "Send request"}
                  </button>

                  {tryResult && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <p className={`text-xs ${String(tryResult.status).startsWith("2") ? "text-emerald-400" : "text-red-400"}`}>
                          Status: {tryResult.status}
                        </p>
                        {tryResult.masked && (
                          <span className="text-[11px] text-slate-500">· example values, 1 item</span>
                        )}
                      </div>
                      <pre className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-slate-300 overflow-x-auto max-h-64 overflow-y-auto no-scrollbar">{tryResult.body}</pre>
                      {tryResult.masked && (
                        <p className="text-[11px] text-slate-600 mt-2">
                          Your request really ran. The field names are exactly what the API returns — values are shown as examples here, and lists are trimmed to one item.
                        </p>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-600">Your key stays in your browser — it&apos;s only sent to the Qevora API.</p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
                  <p className="font-medium mb-1">Want to try these endpoints live?</p>
                  <p className="text-sm text-slate-400 mb-4">Create a free account to get an API key and send real requests right from these docs.</p>
                  <button onClick={() => router.push("/login")}
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
                    Create free account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loggedIn === null) return <div className="min-h-screen bg-[#0a0a0f]" />;

  if (loggedIn) return <AppShell>{content}</AppShell>;

  return <PublicShell>{content}</PublicShell>;
}