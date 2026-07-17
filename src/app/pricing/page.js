"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getPlans, getMySubscription, subscribe, createOrder, verifyPayment } from "@/lib/api";
import AppShell from "../components/AppShell";
import PageLoader from "../components/PageLoader";
import PublicShell from "../components/PublicShell";

// backend na de paye (logged out) to yeh dikhao
const FALLBACK_PLANS = [
  { key: "free", name: "Free", price: 0, scan_limit: 3, agent_limit: 1 },
  { key: "pro", name: "Pro", price: 2499, scan_limit: 100, agent_limit: 20 },
  { key: "business", name: "Business", price: 7999, scan_limit: 1000, agent_limit: 100 },
];

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [successPlan, setSuccessPlan] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const isIn = !!getToken();
    setLoggedIn(isIn);

    if (!isIn) {
      // public view — bina login ke API call nahi, fixed plans dikhao
      setPlans(FALLBACK_PLANS);
      setLoading(false);
      return;
    }

    Promise.all([getPlans(), getMySubscription()])
      .then(([p, s]) => { setPlans(p); setCurrent(s); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    // razorpay script — sirf logged-in pe (visitor pe koi tracking cookie nahi)
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, [router]);

  // free plan -> seedha subscribe (no payment)
  async function handleFree() {
    setBusy("free"); setError("");
    try {
      const s = await subscribe("free");
      setCurrent(s);
    } catch (e) { setError(e.message); }
    finally { setBusy(""); }
  }

  // paid plan -> razorpay payment
  async function handlePay(key, planName) {
    setBusy(key); setError("");
    try {
      const order = await createOrder(key);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Qevora",
        description: `${planName} Plan`,
        order_id: order.order_id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const s = await getMySubscription();
            setCurrent(s);
            setError("");
            setSuccessPlan(planName);
          } catch (e) {
            setError("Payment verification failed: " + e.message);
          } finally {
            setBusy("");
          }
        },
        modal: {
          ondismiss: function () { setBusy(""); },
        },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
        setBusy("");
      });
      rzp.open();
    } catch (e) {
      setError(e.message);
      setBusy("");
    }
  }

  function handleChoose(p) {
    if (!loggedIn) { router.push("/login"); return; }   // visitor -> signup
    if (p.key === "free") handleFree();
    else handlePay(p.key, p.name);
  }

  const content = (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Choose your plan</h1>
        <p className="text-slate-400 mt-2">
          {loggedIn ? "Scale Qevora as your business grows." : "Start free. Upgrade when you're ready — no credit card to begin."}
        </p>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 max-w-md mx-auto">{error}</div>}

      {loading ? <PageLoader /> : (
        <div className="grid sm:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isCurrent = loggedIn && current?.plan === p.key;
            const isPro = p.key === "pro";
            return (
              <div key={p.key} className={`rounded-2xl p-6 border flex flex-col ${
                isPro ? "border-indigo-500/40 bg-gradient-to-b from-indigo-500/10 to-transparent" : "border-white/10 bg-white/[0.03]"
              }`}>
                {isPro && <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 self-start mb-3">Most popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-3xl font-bold mt-2">
                  ₹{p.price.toLocaleString("en-IN")}<span className="text-sm text-slate-500 font-normal">/mo</span>
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-400 flex-1">
                  <li>✓ {p.scan_limit} scans / month</li>
                  <li>✓ {p.agent_limit} AI agents</li>
                  <li>✓ Blueprints & reports</li>
                  {p.key !== "free" && <li>✓ Priority support</li>}
                </ul>
                <button
                  onClick={() => handleChoose(p)}
                  disabled={isCurrent || busy === p.key}
                  className={`mt-6 rounded-lg py-2.5 text-sm font-medium transition ${
                    isCurrent
                      ? "bg-white/5 text-slate-500 cursor-default"
                      : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90"
                  }`}
                >
                  {!loggedIn ? (p.price === 0 ? "Start free" : `Get ${p.name}`)
                    : isCurrent ? "Current plan"
                    : busy === p.key ? "Processing..."
                    : p.price === 0 ? "Switch to Free"
                    : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-slate-600">
        {loggedIn
          ? "Secure payments via Razorpay. Cancel anytime."
          : "Create a free account to get started — no credit card required. Paid plans are billed monthly and can be cancelled anytime."}
      </p>

      {!loggedIn && !loading && (
        <div className="text-center bg-gradient-to-br from-indigo-600/15 to-violet-600/15 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Not sure which plan?</h2>
          <p className="text-slate-300 text-sm mb-6">Start with the free plan — scan your business and see your AI readiness score in 5 minutes.</p>
          <button onClick={() => router.push("/login")}
            className="bg-white text-slate-900 rounded-xl px-7 py-3 font-semibold hover:bg-slate-100 hover:scale-105 transition">
            Scan my business free →
          </button>
        </div>
      )}
    </div>
  );

  // abhi pata nahi logged in hai ya nahi -> flash na ho
  if (loggedIn === null) return <div className="min-h-screen bg-[#0a0a0f]" />;

  const shell = loggedIn
    ? <AppShell>{content}</AppShell>
    : <PublicShell>{content}</PublicShell>;

  return (
    <>
      {shell}
      {successPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-slate-400 text-sm mb-1">Your <span className="text-white font-medium">{successPlan}</span> plan is now active.</p>
            <p className="text-slate-500 text-xs mb-6">An invoice has been sent to your email.</p>
            <button
              onClick={() => { setSuccessPlan(null); router.push("/dashboard"); }}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg py-2.5 font-medium hover:opacity-90 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}