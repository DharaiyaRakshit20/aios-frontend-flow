"use client";
import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import Dropdown from "../components/Dropdown";
import { PRESETS } from "./presets";
import {
  getOrganizations, getBusinessProfile, saveBusinessProfile,
  getProducts, createProduct, updateProduct, deleteProduct,
  getBusinessContextPreview,
} from "@/lib/api";
import ConfirmModal from "../components/ConfirmModal";

const EMPTY = { name: "", category: "", price: "", price_text: "", stock: "", sizes: "", colors: "", description: "" };

export default function KnowledgePage() {
  const [orgs, setOrgs] = useState([]);
  const [orgId, setOrgId] = useState(null);
  const [industry, setIndustry] = useState("retail");
  const [tab, setTab] = useState("products");

  const [profile, setProfile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const preset = PRESETS[industry];
  const trackStock = preset.trackStock;

  // Dropdown component strings pe kaam karta hai — mapping helpers
  const orgNames = orgs.map((o) => o.name);
  const currentOrgName = orgs.find((o) => o.id === orgId)?.name || "";
  const industryLabels = Object.values(PRESETS).map((p) => p.label);
  const currentIndustryLabel = preset.label;

  useEffect(() => {
    getOrganizations()
      .then((d) => {
        const list = d.results || d.organizations || d || [];
        setOrgs(list);
        if (list.length) setOrgId(list[0].id);
      })
      .catch(() => setError("Couldn't load your organizations."));
  }, []);

  useEffect(() => {
    if (!orgId) return;
    setError("");
    getBusinessProfile(orgId).then(setProfile).catch(() => {});
    loadProducts();
    setPreview("");
  }, [orgId]);

  async function loadProducts() {
    try {
      const d = await getProducts(orgId);
      setProducts(d.products || []);
    } catch (e) {
      setError(`Couldn't load your products — ${e.message}`);
      console.error("products error:", e);
    }
  }

  function toPayload(f) {
    const variants = {};
    if (f.sizes.trim()) variants.sizes = f.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    if (f.colors.trim()) variants.colors = f.colors.split(",").map((s) => s.trim()).filter(Boolean);
    return {
      name: f.name.trim(),
      category: f.category.trim(),
      description: f.description.trim(),
      price: trackStock && f.price !== "" ? Number(f.price) : null,
      price_text: trackStock ? "" : f.price_text.trim(),
      stock: trackStock ? Number(f.stock) || 0 : 0,
      track_stock: trackStock,
      variants,
    };
  }

  async function submitProduct(e) {
    e.preventDefault();
    if (!form.name.trim() || busy) return;
    setBusy(true); setError("");
    try {
      if (editingId) await updateProduct(orgId, editingId, toPayload(form));
      else await createProduct(orgId, toPayload(form));
      setForm(EMPTY); setEditingId(null);
      loadProducts();
    } catch (e) {
      setError(`Couldn't save — ${e.message}`);
      console.error("save error:", e);
    } finally { setBusy(false); }
  }

  function loadExample() {
    const ex = preset.examples[0];
    setEditingId(null);
    setForm({
      name: ex.name, category: ex.category,
      price: ex.price ?? "", price_text: ex.priceText || "",
      stock: ex.stock ?? 0,
      sizes: ex.sizes || "", colors: ex.colors || "",
      description: ex.description || "",
    });
  }

  function loadExampleProfile() {
    setProfile({ ...profile, ...preset.profile });
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name || "", category: p.category || "",
      price: p.price ?? "", price_text: p.price_text || "",
      stock: p.stock ?? 0,
      sizes: (p.variants?.sizes || []).join(", "),
      colors: (p.variants?.colors || []).join(", "),
      description: p.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(orgId, deleteTarget.id);
      loadProducts();
      setDeleteTarget(null);
    } catch (e) {
      setError(`Couldn't delete — ${e.message}`);
    } finally { setDeleting(false); }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSavingProfile(true); setProfileSaved(false); setError("");
    try {
      const saved = await saveBusinessProfile(orgId, profile);
      setProfile(saved); setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch { setError("Couldn't save your business info."); }
    finally { setSavingProfile(false); }
  }

  async function loadPreview() {
    setPreview("Loading...");
    try {
      const d = await getBusinessContextPreview(orgId);
      setPreview(d.context || "Nothing added yet.");
    } catch { setPreview("Couldn't load the preview."); }
  }

  const field = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition";
  const P = (k, v) => setProfile({ ...profile, [k]: v });

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-1">Knowledge</h1>
        <p className="text-slate-400 text-sm mb-6">
          Everything you add here is given to your AI agents automatically — what you sell, prices, stock, hours and policies.
          Add this before creating an agent so it can answer your customers properly.
        </p>

        {/* selectors */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-6">
          {orgs.length > 1 && (
            <Dropdown
              label="Organization"
              value={currentOrgName}
              onChange={(name) => {
                const o = orgs.find((x) => x.name === name);
                if (o) setOrgId(o.id);
              }}
              options={orgNames}
            />
          )}
          <div>
            <Dropdown
              label="Business type"
              value={currentIndustryLabel}
              onChange={(label) => {
                const key = Object.keys(PRESETS).find((k) => PRESETS[k].label === label);
                if (key) setIndustry(key);
              }}
              options={industryLabels}
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              This changes the fields and examples below.
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {/* tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 overflow-x-auto no-scrollbar">
          {[["products", `${preset.itemWord}s`], ["business", "Business Info"], ["preview", "What your agent knows"]].map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); if (id === "preview") loadPreview(); }}
              className={`px-4 py-2.5 text-sm transition border-b-2 -mb-px whitespace-nowrap ${
                tab === id ? "border-indigo-500 text-white" : "border-transparent text-slate-400 hover:text-white"
              }`}>{label}</button>
          ))}
        </div>

        {/* ITEMS */}
        {tab === "products" && (
          <div className="space-y-6">
            <form onSubmit={submitProduct} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm font-medium">
                  {editingId ? `Edit ${preset.itemWord.toLowerCase()}` : `Add a ${preset.itemWord.toLowerCase()}`}
                </p>
                <button type="button" onClick={loadExample}
                  className="text-xs text-indigo-400 hover:text-indigo-300">Fill with an example</button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <input className={field} placeholder={`${preset.itemWord} name *`} value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className={field} placeholder={`Category (e.g. ${preset.categoryHint})`} value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })} />

                {trackStock ? (
                  <>
                    <input className={field} type="text" inputMode="decimal" placeholder="Price in ₹" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^\d.]/g, "") })} />
                    <input className={field} type="text" inputMode="numeric" placeholder="Stock quantity" value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value.replace(/\D/g, "") })} />
                    <input className={field} placeholder="Sizes, comma separated (S, M, L)" value={form.sizes}
                      onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
                    <input className={field} placeholder="Colours, comma separated (red, blue)" value={form.colors}
                      onChange={(e) => setForm({ ...form, colors: e.target.value })} />
                  </>
                ) : (
                  <input className={`${field} sm:col-span-2`} placeholder="Pricing — write it as you'd tell a customer (e.g. 10.5% p.a., or ₹300 - ₹800)"
                    value={form.price_text} onChange={(e) => setForm({ ...form, price_text: e.target.value })} />
                )}
              </div>

              <textarea className={`${field} min-h-[80px] resize-y`}
                placeholder={trackStock
                  ? "Short description (optional)"
                  : "Details customers ask about — eligibility, documents needed, duration, conditions"}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

              <div className="flex gap-2 items-center">
                <button type="submit" disabled={busy || !form.name.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition">
                  {busy ? "Saving..." : editingId ? "Update" : `Add ${preset.itemWord.toLowerCase()}`}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }}
                    className="text-sm text-slate-400 hover:text-white px-3">Cancel</button>
                )}
              </div>
            </form>

            {products.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Nothing added yet. Add your first {preset.itemWord.toLowerCase()}{" "}
                above — or hit &quot;Fill with an example&quot; to see how it works.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">{products.length} items</p>
                {products.map((p) => (
                  <div key={p.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {p.name}
                        {p.category && <span className="text-slate-500 font-normal text-sm"> · {p.category}</span>}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {p.price_text ? <span className="text-white">{p.price_text}</span>
                          : p.price != null ? <span className="text-white">₹{p.price}</span> : null}
                        {(p.price_text || p.price != null) && " · "}
                        {p.track_stock !== false ? (
                          <span className={p.stock > 0 ? "text-emerald-400" : "text-red-400"}>
                            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                          </span>
                        ) : <span className="text-emerald-400">Available</span>}
                        {p.variants?.sizes?.length ? ` · sizes: ${p.variants.sizes.join(", ")}` : ""}
                        {p.variants?.colors?.length ? ` · colours: ${p.variants.colors.join(", ")}` : ""}
                      </p>
                      {p.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>}
                    </div>
                    <div className="flex gap-3 text-xs shrink-0">
                      <button onClick={() => startEdit(p)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                      <button onClick={() => setDeleteTarget(p)} className="text-slate-500 hover:text-red-400">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BUSINESS INFO */}
        {tab === "business" && profile && (
          <form onSubmit={saveProfile} className="space-y-3 max-w-2xl">
            <div className="flex justify-end">
              <button type="button" onClick={loadExampleProfile}
                className="text-xs text-indigo-400 hover:text-indigo-300">Fill with an example</button>
            </div>
            <textarea className={`${field} min-h-[80px] resize-y`} placeholder="About your business — what you do, in 2-3 lines"
              value={profile.about || ""} onChange={(e) => P("about", e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={field} placeholder="Opening hours (Mon-Sat 10 AM - 8 PM)"
                value={profile.hours || ""} onChange={(e) => P("hours", e.target.value)} />
              <input className={field} placeholder="Phone number customers can call"
                value={profile.phone || ""} onChange={(e) => P("phone", e.target.value)} />
            </div>
            <input className={field} placeholder="Address / location"
              value={profile.location || ""} onChange={(e) => P("location", e.target.value)} />
            <input className={field} placeholder="Payment methods you accept (UPI, Cash, Card)"
              value={profile.payment_methods || ""} onChange={(e) => P("payment_methods", e.target.value)} />
            <textarea className={`${field} min-h-[70px] resize-y`} placeholder="Delivery — areas you cover, charges, how long it takes"
              value={profile.delivery_info || ""} onChange={(e) => P("delivery_info", e.target.value)} />
            <textarea className={`${field} min-h-[70px] resize-y`} placeholder="Return or exchange policy"
              value={profile.return_policy || ""} onChange={(e) => P("return_policy", e.target.value)} />
            <textarea className={`${field} min-h-[70px] resize-y`} placeholder="Anything else your agent should know about your business"
              value={profile.extra_notes || ""} onChange={(e) => P("extra_notes", e.target.value)} />

            <div className="flex items-center gap-3">
              <button type="submit" disabled={savingProfile}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition">
                {savingProfile ? "Saving..." : "Save business info"}
              </button>
              {profileSaved && <span className="text-sm text-emerald-400">Saved ✓</span>}
            </div>
          </form>
        )}

        {/* PREVIEW */}
        {tab === "preview" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              This is exactly what your AI agents receive. If something looks wrong here, your agent will get it wrong too.
            </p>
            <button onClick={loadPreview} className="text-sm text-indigo-400 hover:text-indigo-300">Refresh</button>
            <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-slate-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto no-scrollbar">{preview}</pre>
          </div>
        )}
      <ConfirmModal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          loading={deleting}
          title={`Delete ${deleteTarget?.name || "this item"}?`}
          message="Your AI agents will stop mentioning it right away. This can't be undone."
        />
      </div>
    </AppShell>
  );
}
