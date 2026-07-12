"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getProfile, updateProfile, exportMyData, deleteMyAccount, logout } from "@/lib/api";
import AppShell from "../components/AppShell";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [hasOwnKey, setHasOwnKey] = useState(false);
  const [language, setLanguage] = useState("en");
  const [langSaved, setLangSaved] = useState(false);
  const [aiKey, setAiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [keyMsg, setKeyMsg] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleting, setDeleting] = useState(false);

  function loadProfile() {
    getProfile().then((u) => {
      setEmail(u.email); setFullName(u.full_name || ""); setHasOwnKey(u.has_own_ai_key);
      setLanguage(u.language || "en");
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    loadProfile();
  }, [router]);

  async function handleSave() {
    setSaving(true); setError(""); setSaved(false);
    try { await updateProfile(fullName); setSaved(true); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleLanguageChange(lang) {
    setLanguage(lang);
    setLangSaved(false);
    try {
      await updateProfile(undefined, undefined, lang);
      setLangSaved(true);
      setTimeout(() => setLangSaved(false), 2000);
    } catch (e) { setError(e.message); }
  }

  async function handleSaveKey() {
    setKeyMsg("");
    try {
      await updateProfile(undefined, aiKey.trim());
      setAiKey("");
      setKeyMsg("AI key saved. Your agent chats will now use your own key.");
      loadProfile();
    } catch (e) { setKeyMsg(e.message); }
  }

  async function handleRemoveKey() {
    setKeyMsg("");
    try {
      await updateProfile(undefined, "");
      setKeyMsg("Your key was removed. Agent chats will use Qevora's default AI.");
      loadProfile();
    } catch (e) { setKeyMsg(e.message); }
  }

  async function handleExport() {
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "qevora-my-data.json";
      link.click();
    } catch (e) { setError(e.message); }
  }

  async function handleDeleteAccount() {
    setDeleting(true); setError("");
    try {
      await deleteMyAccount(confirmEmail);
      logout();
      router.push("/login");
    } catch (e) { setError(e.message); setDeleting(false); }
  }

  if (loading) return <AppShell><div className="max-w-xl mx-auto px-4 py-10 text-slate-500">Loading...</div></AppShell>;

  const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition";

  return (
    <AppShell>
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">{error}</div>}
        {saved && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg p-3">Profile updated successfully.</div>}

        {/* profile */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl font-bold">
              {(fullName || email || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{fullName || "No name set"}</p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
            <input className={input} value={fullName} onChange={(e) => { setFullName(e.target.value); setSaved(false); }} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <input className="w-full bg-white/[0.02] border border-white/5 rounded-lg px-3.5 py-2.5 text-slate-500" value={email} disabled />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50 transition">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        {/* language */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Language</h2>
              <p className="text-slate-500 text-sm mt-1">Reports, blueprints, and agent replies will be in this language.</p>
            </div>
            {langSaved && <span className="text-xs text-emerald-400">Saved</span>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`flex-1 rounded-lg py-3 text-sm font-medium border transition ${
                language === "en"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 border-transparent text-white"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => handleLanguageChange("hi")}
              className={`flex-1 rounded-lg py-3 text-sm font-medium border transition ${
                language === "hi"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 border-transparent text-white"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              🇮🇳 हिंदी
            </button>
          </div>
        </div>

        {/* own AI key */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Your Own AI Key <span className="text-xs text-slate-500 font-normal">(optional)</span></h2>
            <p className="text-slate-500 text-sm mt-1">For maximum privacy, use your own Google Gemini key. Your agent chats will run on your key — not through Qevora&apos;s AI.</p>
          </div>

          {keyMsg && <div className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg p-3">{keyMsg}</div>}

          {hasOwnKey ? (
            <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
              <div className="text-sm">
                <p className="text-emerald-400 font-medium">✓ Your own AI key is active</p>
                <p className="text-slate-500 text-xs mt-0.5">Agent chats use your key.</p>
              </div>
              <button onClick={handleRemoveKey} className="text-sm text-slate-500 hover:text-red-400 transition">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input className={input} type="password" placeholder="Paste your Gemini API key" value={aiKey} onChange={(e) => setAiKey(e.target.value)} />
              <button onClick={handleSaveKey} disabled={!aiKey.trim()}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition whitespace-nowrap">
                Save key
              </button>
            </div>
          )}
          <p className="text-xs text-slate-600">Get a free key from Google AI Studio. Your key is stored securely and never shared.</p>
        </div>

        {/* privacy & data */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Privacy & Data</h2>
            <p className="text-slate-500 text-sm mt-1">You own your data. Export or delete it anytime.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 text-sm text-slate-400 space-y-1.5">
            <p>🔒 Your business data is never sold or shared.</p>
            <p>💬 Chats on agents you embed elsewhere are <span className="text-white">not stored</span> by Qevora.</p>
            <p>🗑️ You can permanently delete everything, any time.</p>
          </div>
          <button onClick={handleExport} className="w-full sm:w-auto border border-white/10 rounded-lg px-4 py-2.5 text-sm hover:bg-white/5 transition">
            Export my data (JSON)
          </button>
        </div>

        {/* danger zone */}
        <div className="bg-white/[0.03] border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-400 mb-1">Delete Account</h2>
          <p className="text-slate-500 text-sm mb-4">This permanently deletes your account and all data. This cannot be undone.</p>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm hover:bg-red-500/10 transition">
              Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-300">Type your email <span className="text-white font-medium">{email}</span> to confirm:</p>
              <input className={input} placeholder={email} value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} disabled={deleting || confirmEmail.toLowerCase() !== email.toLowerCase()}
                  className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-40 transition">
                  {deleting ? "Deleting..." : "Permanently delete"}
                </button>
                <button onClick={() => { setConfirmDelete(false); setConfirmEmail(""); }} className="text-slate-500 text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}