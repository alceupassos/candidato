"use client";

import { useMemo } from "react";

import { RACES, getRaceRanking } from "@/lib/mock/races";
import { getOpportunityRanking } from "@/lib/mock/priorities";
import { intencaoMediaEstadual } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

/** Faixa global de indicadores rolando no topo do cockpit. */
export function TopTicker({ region }: { region: RegionId }) {
  const text = useMemo(() => {
    const out: string[] = [];
    out.push(`📊 Intenção estadual ${intencaoMediaEstadual()}%`);
    for (const race of RACES) {
      const lead = getRaceRanking(race.id, region)[0];
      out.push(`🏆 ${race.nome}: ${lead.nome} ${lead.intencao}%`);
    }
    getOpportunityRanking(region)
      .slice(0, 3)
      .forEach((o) =>
        out.push(`🎯 ${o.tema} — oportunidade ${o.oportunidade}`),
      );
    out.push("🟢 Sistema ao vivo · dados monitorados em tempo real");
    return out.join("   •   ");
  }, [region]);

  return (
    <div className="top-ticker" aria-label="Indicadores ao vivo">
      <span className="top-ticker-tag">
        <span className="dot-live" /> AO VIVO
      </span>
      <div className="top-ticker-track">
        <span>
          {text}
          {"   •   "}
          {text}
        </span>
      </div>
    </div>
  );
}
