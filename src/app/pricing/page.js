"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getPlans, getMySubscription, subscribe, createOrder, verifyPayment } from "@/lib/api";
import AppShell from "../components/AppShell";

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [successPlan, setSuccessPlan] = useState(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    Promise.all([getPlans(), getMySubscription()])
      .then(([p, s]) => { setPlans(p); setCurrent(s); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    // razorpay script load karo
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
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
    if (p.key === "free") handleFree();
    else handlePay(p.key, p.name);
  }

  if (loading) return <AppShell><div className="max-w-5xl mx-auto px-4 py-10 text-slate-500">Loading...</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Choose your plan</h1>
          <p className="text-slate-400 mt-2">Scale Qevora as your business grows.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 max-w-md mx-auto">{error}</div>}

        <div className="grid sm:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isCurrent = current?.plan === p.key;
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
                  {isCurrent ? "Current plan"
                    : busy === p.key ? "Processing..."
                    : p.price === 0 ? "Switch to Free"
                    : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-600">
          Secure payments via Razorpay. Cancel anytime.
        </p>
      </div>
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
    </AppShell>
  );
}