"use client";
import { useState } from "react";
import { submitFeedback } from "@/lib/api";

export default function StarRating({ targetType, targetId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [done, setDone] = useState(false);

  async function pick(n) {
    setRating(n);
    try {
      await submitFeedback({ kind: "rating", target_type: targetType, target_id: String(targetId), rating: n });
      setDone(true);
    } catch {}
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
      <p className="text-sm font-medium mb-3">{done ? "Thanks for your feedback! 🙏" : "How useful was this?"}</p>
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            onClick={() => pick(n)} disabled={done} className="text-3xl transition disabled:cursor-default">
            <span className={(hover || rating) >= n ? "text-amber-400" : "text-slate-600"}>★</span>
          </button>
        ))}
      </div>
    </div>
  );
}

