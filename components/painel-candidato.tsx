"use client";

import { useEffect, useMemo, useState } from "react";

import { EChart } from "@/components/echart";
import { gaugeOption, lineOption } from "@/components/echart-options";
import { getCandidatoPainel } from "@/lib/mock/candidato-painel";
import type { RegionId } from "@/lib/mock/types";

const nf = (n: number) => n.toLocaleString("pt-BR");

export function PainelCandidato({
  region,
  compact = false,
}: {
  region: RegionId;
  compact?: boolean;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const p = useMemo(() => getCandidatoPainel(region), [region]);
  const corVaga = p.dentro
    ? "#22c55e"
    : p.pctVaga >= 80
      ? "#f0c030"
      : "#ef4444";
  const gauge = useMemo(
    () => gaugeOption(Math.min(100, p.pctVaga), "da vaga", corVaga),
    [p.pctVaga, corVaga],
  );
  const sparkOpt = useMemo(
    () =>
      lineOption(
        {
          labels: p.momentum.spark.map((_, i) => `${i + 1}`),
          datasets: [
            {
              label: "Intenção",
              color: p.momentum.dir === "down" ? "#ef4444" : "#22c55e",
              data: p.momentum.spark,
            },
          ],
        },
        { area: true },
      ),
    [p.momentum],
  );
  const maxInt = Math.max(...p.headToHead.map((h) => h.intencao), 1);
  // micro-oscilação "ao vivo" só no número exibido
  const vivo = p.votosProjetados + Math.round(Math.sin(tick / 1.6) * 40);

  const arrow =
    p.momentum.dir === "up" ? "▲" : p.momentum.dir === "down" ? "▼" : "▬";
  const arrowCor =
    p.momentum.dir === "up"
      ? "#22c55e"
      : p.momentum.dir === "down"
        ? "#ef4444"
        : "#8a8aaa";

  return (
    <div className={`painel-cand ${compact ? "compact" : ""}`}>
      {/* Vaga */}
      <div className="pc-block">
        <div className="pc-head">
          <span className="pc-title">Vou me eleger?</span>
          <span className="pc-tag">estimativa · vaga</span>
        </div>
        <div className="pc-vaga">
          <div className="pc-gauge">
            <EChart option={gauge} height={compact ? 120 : 150} />
          </div>
          <div className="pc-vaga-info">
            <div className="pc-status" style={{ color: corVaga }}>
              {p.dentro ? "DENTRO DA VAGA" : "FORA DA VAGA"}
            </div>
            <div className="pc-vaga-num">
              {p.dentro ? (
                <>
                  folga de <strong>{nf(p.folga)}</strong> votos
                </>
              ) : (
                <>
                  faltam{" "}
                  <strong style={{ color: corVaga }}>{nf(p.faltam)}</strong>{" "}
                  votos
                </>
              )}
            </div>
            <div className="pc-vaga-sub">
              projeção {nf(vivo)} · eleger ~{nf(p.votosParaEleger)}
            </div>
          </div>
        </div>
      </div>

      {/* Momentum */}
      <div className="pc-block">
        <div className="pc-head">
          <span className="pc-title">Momentum</span>
          <span className="pc-tag">
            <span className="dot-live" /> ao vivo
          </span>
        </div>
        <div className="pc-mom">
          <div className="pc-mom-delta" style={{ color: arrowCor }}>
            <span className="pc-arrow">{arrow}</span>
            {p.momentum.delta > 0 ? "+" : ""}
            {p.momentum.delta} <small>p.p./semana</small>
          </div>
          <div className="pc-spark">
            <EChart option={sparkOpt} height={compact ? 70 : 90} />
          </div>
        </div>
      </div>

      {/* Head-to-head */}
      <div className="pc-block">
        <div className="pc-head">
          <span className="pc-title">Head-to-head</span>
          <span className="pc-tag">{p.posicao}º na vaga</span>
        </div>
        <div className="pc-h2h">
          {p.headToHead.map((h) => (
            <div className={`pc-h2h-row ${h.alvo ? "alvo" : ""}`} key={h.nome}>
              <span className="pc-h2h-nome">
                {h.nome} <small>{h.partido}</small>
              </span>
              <div className="pc-h2h-bar">
                <span
                  style={{
                    width: `${(h.intencao / maxInt) * 100}%`,
                    background: h.alvo ? "#22c55e" : h.cor,
                  }}
                />
              </div>
              <span className="pc-h2h-val">{h.intencao}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
