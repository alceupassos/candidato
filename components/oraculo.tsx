"use client";

import { useEffect, useState } from "react";

export function Oraculo({
  section,
  context = "",
}: {
  section: string;
  context?: string;
}) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const r = await fetch("/api/oracle", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, context }),
        });
        const d = await r.json().catch(() => ({}));
        if (on) setInsight(d.insight ?? "");
      } catch {
        /* silencioso */
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [section, context]);

  return (
    <div className="oraculo">
      <div className="oraculo-orb" aria-hidden>
        <i data-lucide="sparkles" />
      </div>
      <div className="oraculo-body">
        <div className="oraculo-head">
          <span className="oraculo-title">Oráculo</span>
          <span className="oraculo-tag">IA · análise</span>
        </div>
        {loading ? (
          <div className="oraculo-skel">
            <span />
            <span />
          </div>
        ) : (
          <div className="oraculo-text">{insight}</div>
        )}
      </div>
    </div>
  );
}
