"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getToken, getAgent } from "@/lib/api";
import AppShell from "../../../components/AppShell";
import PageLoader from "../components/PageLoader";

function ActionContent() {
  const router = useRouter();
  const { id } = useParams();
  const params = useSearchParams();
  const [agent, setAgent] = useState(null);
  const [copied, setCopied] = useState(false);
  const slug = params.get("slug");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    getAgent(id).then(setAgent).catch(() => {});
  }, [id, router]);

  const chatUrl = typeof window !== "undefined"
    ? `${window.location.origin}/chat/${slug || agent?.public_slug}`
    : "";

  function copyLink() {
    navigator.clipboard.writeText(chatUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!agent) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* success banner */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-1">Your chatbot is live! 🎉</h1>
        <p className="text-slate-400 text-sm">{agent.name} is ready to talk to your customers.</p>
      </div>

      {/* the link */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <p className="text-sm font-medium mb-1">Your chatbot link</p>
        <p className="text-xs text-slate-500 mb-3">Share this link with your customers — anyone can chat with your agent, no login needed.</p>
        <div className="flex gap-2">
          <code className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-indigo-300 break-all">{chatUrl}</code>
          <button onClick={copyLink} className="bg-white/10 border border-white/10 rounded-lg px-4 text-sm hover:bg-white/20 transition whitespace-nowrap">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <a href={chatUrl} target="_blank" rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300">
          Open your chatbot →
        </a>
      </div>

      {/* steps: what to do */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">What to do next</h2>
        <ol className="space-y-4">
          {[
            { t: "Share your link everywhere", d: "Put it in your WhatsApp bio, Instagram, visiting card, Google listing, or SMS to customers. No website needed!" },
            { t: "Customers chat instantly", d: "They open the link and ask questions — your AI answers 24/7, even when you're busy or closed." },
            { t: "Add it to your website (optional)", d: "Already have a website? You can embed the chatbot directly on it too." },
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs rounded-full flex items-center justify-center">{i + 1}</span>
              <div>
                <p className="font-medium text-sm">{s.t}</p>
                <p className="text-sm text-slate-400 mt-0.5">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* embed option */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <p className="text-sm font-medium mb-2">Have your own website?</p>
        <p className="text-xs text-slate-400 mb-3">Add this chatbot to your site with one line of code.</p>
        <button onClick={() => router.push(`/agents/${id}`)} className="text-sm text-indigo-400 hover:text-indigo-300">
          See embed code →
        </button>
      </div>

      <button onClick={() => router.push(`/agents/${id}`)} className="text-sm text-slate-400 hover:text-white transition">← Back to agent</button>
    </div>
  );
}

export default function ActionPage() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <ActionContent />
      </Suspense>
    </AppShell>
  );
}
