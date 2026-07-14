"use client";
import { useState } from "react";
import { submitFeedback } from "@/lib/api";

export default function ThumbFeedback({ targetType, targetId }) {
  const [choice, setChoice] = useState(null);

  async function pick(thumb) {
    setChoice(thumb);
    try {
      await submitFeedback({ kind: "thumb", target_type: targetType, target_id: String(targetId), thumb });
    } catch {}
  }

  return (
    <div className="flex gap-2 mt-1.5 px-1">
      <button onClick={() => pick("up")} title="Helpful"
        className={`text-xs transition ${choice === "up" ? "opacity-100" : "opacity-40 hover:opacity-80"}`}>👍</button>
      <button onClick={() => pick("down")} title="Not helpful"
        className={`text-xs transition ${choice === "down" ? "opacity-100" : "opacity-40 hover:opacity-80"}`}>👎</button>
    </div>
  );
}

