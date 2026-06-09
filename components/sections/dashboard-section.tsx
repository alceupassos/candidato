"use client";

import { useEffect, useMemo, useState } from "react";

import { EChart } from "@/components/echart";
import { useIs3D } from "@/components/charts/use-is-3d";
import {
  bar3DOption,
  donutOption,
  heatmapOption,
  lineOption,
} from "@/components/echart-options";
import {
  getDashboardKpis,
  getFaixaEtaria,
  getIntencaoEvolution,
} from "@/lib/mock/campaign-metrics";
import { getPriorityMatrix } from "@/lib/mock/priorities";
import { REGIONS, getRegion, regionEleitorado } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

const KPI_COLORS = ["#22c55e", "#60a5fa", "#f0c030", "#8b5cf6"];
const nf = (n: number) => n.toLocaleString("pt-BR");

export function DashboardSection({ region }: { region: RegionId }) {
  const r = getRegion(region);
  const nomeRegiao = r?.nome ?? "Todo o RJ";
  const is3D = useIs3D();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3500);
    return () => clearInterval(id);
  }, []);

  const kpis = useMemo(() => getDashboardKpis(region), [region]);
  const evoOpt = useMemo(
    () => lineOption(getIntencaoEvolution(region), { area: true }),
    [region],
  );
  const faixa = useMemo(() => getFaixaEtaria(region), [region]);
  const faixaOpt = useMemo(
    () =>
      donutOption(
        faixa.labels,
        faixa.datasets[0].data as number[],
        faixa.datasets[0].palette ?? ["#22c55e"],
        "%",
      ),
    [faixa],
  );
  const cubeOpt = useMemo(() => {
    const temas = getPriorityMatrix(REGIONS[0].id).map((m) => m.tema);
    const regions = REGIONS.map((reg) => reg.nome);
    const values = REGIONS.map((reg) =>
      getPriorityMatrix(reg.id).map((m) => m.oportunidade),
    );
    return is3D
      ? bar3DOption(regions, temas, values)
      : heatmapOption(regions, temas, values);
  }, [is3D]);

  const municipios = r
    ? r.municipios
    : REGIONS.flatMap((reg) => reg.municipios);
  const topMun = [...municipios]
    .sort((a, b) => b.cobertura - a.cobertura)
    .slice(0, 6);
  const cobertura = r
    ? r.cobertura
    : Math.round(REGIONS.reduce((s, x) => s + x.cobertura, 0) / REGIONS.length);
  const cabos = r ? r.cabos : REGIONS.reduce((s, x) => s + x.cabos, 0);
  const sentPos = r ? r.sentimento.positivo : 61;

  const wave = Math.sin(tick / 1.5);

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="layout-dashboard" /> <strong>Dashboard Geral</strong> ·{" "}
        {nomeRegiao}
        <span className="card-badge badge-real" style={{ marginLeft: 8 }}>
          <span className="dot-live" /> ao vivo
        </span>
      </div>

      <div className="kpi-row">
        {kpis.map((k, i) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div
              className="kpi-value"
              style={{ color: KPI_COLORS[i % KPI_COLORS.length] }}
            >
              {k.valor}
            </div>
            <div
              className={`kpi-sub ${k.trend === "up" ? "up" : k.trend === "down" ? "down" : ""}`}
            >
              {k.delta
                ? `${k.trend === "up" ? "▲" : k.trend === "down" ? "▼" : "•"} ${k.delta}`
                : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">
            Raio-X Estadual — Oportunidade por Região × Tema
          </div>
          <span className="card-badge badge-real">
            {is3D ? "3D animado" : "mapa de calor"}
          </span>
        </div>
        <EChart option={cubeOpt} use3D={is3D} height={360} />
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Evolução da Intenção de Voto — 2026
            </div>
            <span className="card-badge badge-azul">série</span>
          </div>
          <EChart option={evoOpt} height={250} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Perfil do Eleitor</div>
            <span className="card-badge badge-est">faixa etária</span>
          </div>
          <EChart option={faixaOpt} height={250} />
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Municípios por Cobertura</div>
            <span className="card-badge badge-real">campo</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Município</th>
                  <th>Eleitorado</th>
                  <th>Cobertura</th>
                </tr>
              </thead>
              <tbody>
                {topMun.map((m) => (
                  <tr key={m.nome}>
                    <td>{m.nome}</td>
                    <td>{nf(m.eleitorado)}</td>
                    <td>{m.cobertura}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Saúde da Campanha</div>
            <span className="card-badge badge-est">indicadores</span>
          </div>
          <div className="detail-list">
            <div className="detail-row">
              <span>Cobertura territorial</span>
              <span style={{ color: "var(--branco)", fontWeight: 700 }}>
                {Math.round(cobertura + wave)}%
              </span>
            </div>
            <div className="detail-row">
              <span>Cabos eleitorais ativos</span>
              <span style={{ color: "var(--branco)", fontWeight: 700 }}>
                {nf(cabos)}
              </span>
            </div>
            <div className="detail-row">
              <span>Eleitorado mapeado</span>
              <span style={{ color: "var(--branco)", fontWeight: 700 }}>
                {nf(
                  r
                    ? regionEleitorado(r)
                    : REGIONS.reduce((s, x) => s + regionEleitorado(x), 0),
                )}
              </span>
            </div>
            <div className="detail-row">
              <span>Sentimento positivo</span>
              <span style={{ color: "var(--branco)", fontWeight: 700 }}>
                {sentPos}%
              </span>
            </div>
            <div className="detail-row">
              <span>Compliance TSE</span>
              <span style={{ color: "var(--branco)", fontWeight: 700 }}>
                92%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
