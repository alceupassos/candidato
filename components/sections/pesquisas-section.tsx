"use client";

import { useMemo, useState } from "react";

import { EChart } from "@/components/echart";
import {
  barOption,
  gaugeOption,
  lineOption,
} from "@/components/echart-options";
import {
  RACES,
  RECORTES,
  getDemographicCut,
  getRaceInstitutos,
  getRaceIntencaoRejeicao,
  getRaceRanking,
  getRaceTimeline,
  type Recorte,
} from "@/lib/mock/races";
import { getPriorities } from "@/lib/mock/priorities";
import { getRegion } from "@/lib/mock/rj-regions";
import type { RaceId, RegionId } from "@/lib/mock/types";

const INSTITUTOS = ["Datafolha", "Quaest", "IBOPE", "Atlas", "Paraná"];

export function PesquisasSection({ region }: { region: RegionId }) {
  const [race, setRace] = useState<RaceId>("dep-federal");
  const [recorte, setRecorte] = useState<Recorte>("idade");
  const [instituto, setInstituto] = useState(INSTITUTOS[0]);
  const [swing, setSwing] = useState(0);
  const [comparecimento, setComparecimento] = useState(78);

  const nomeRegiao = getRegion(region)?.nome ?? "Todo o RJ";
  const ranking = getRaceRanking(race, region);
  const lider = ranking[0];

  const timelineOpt = useMemo(
    () => lineOption(getRaceTimeline(race, region), { area: false }),
    [race, region],
  );
  const institutosOpt = useMemo(
    () => barOption(getRaceInstitutos(race, region)),
    [race, region],
  );
  const intRejOpt = useMemo(
    () => barOption(getRaceIntencaoRejeicao(race, region)),
    [race, region],
  );
  const recorteOpt = useMemo(
    () => barOption(getDemographicCut(race, region, recorte)),
    [race, region, recorte],
  );
  const prioridadesOpt = useMemo(() => {
    const p = getPriorities(region);
    return barOption(
      {
        labels: p.map((x) => x.tema),
        datasets: [
          {
            label: "Demanda",
            color: "#22c55e",
            data: p.map((x) => x.demanda),
            palette: p.map((x) =>
              x.demanda >= 70
                ? "#ef4444"
                : x.demanda >= 55
                  ? "#f0c030"
                  : "#22c55e",
            ),
          },
        ],
      },
      { horizontal: true },
    );
  }, [region]);

  const institutoValor =
    getRaceInstitutos(race, region).datasets[0].data[
      INSTITUTOS.indexOf(instituto)
    ] ?? lider.intencao;
  const projetado = Math.max(0, Number((lider.intencao + swing).toFixed(1)));
  const projGauge = useMemo(
    () =>
      gaugeOption(
        Math.min(100, (projetado / Math.max(20, lider.intencao * 2)) * 100),
        `${projetado}% proj.`,
        "#22c55e",
      ),
    [projetado, lider.intencao],
  );

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="bar-chart-3" /> <strong>Central de Pesquisas</strong> ·{" "}
        {nomeRegiao}
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <label className="field">
          <span className="field-label">Cargo</span>
          <select
            className="field-input"
            value={race}
            onChange={(e) => setRace(e.target.value as RaceId)}
          >
            {RACES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome} · {r.escopo}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Instituto</span>
          <select
            className="field-input"
            value={instituto}
            onChange={(e) => setInstituto(e.target.value)}
          >
            {INSTITUTOS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Recorte</span>
          <select
            className="field-input"
            value={recorte}
            onChange={(e) => setRecorte(e.target.value as Recorte)}
          >
            {RECORTES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="kpi-row" style={{ marginTop: 12 }}>
        <div className="kpi-card">
          <div className="kpi-label">
            Líder ({RACES.find((x) => x.id === race)!.nome})
          </div>
          <div className="kpi-value" style={{ color: lider.cor, fontSize: 19 }}>
            {lider.nome.split(" ")[0]}
          </div>
          <div className="kpi-sub up">{lider.intencao}% intenção</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{instituto}</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {institutoValor}%
          </div>
          <div className="kpi-sub">última onda</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Candidaturas</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {ranking.length}
          </div>
          <div className="kpi-sub">no comparativo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Margem de erro</div>
          <div className="kpi-value">±2.3%</div>
          <div className="kpi-sub">95% confiança</div>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Evolução das Candidaturas</div>
            <span className="card-badge badge-real">6 ondas</span>
          </div>
          <EChart option={timelineOpt} height={250} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Comparativo entre Institutos</div>
            <span className="card-badge badge-azul">
              {lider.nome.split(" ")[0]}
            </span>
          </div>
          <EChart option={institutosOpt} height={250} />
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Intenção × Rejeição</div>
            <span className="card-badge badge-est">todos</span>
          </div>
          <EChart option={intRejOpt} height={240} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Recorte por {RECORTES.find((x) => x.id === recorte)!.nome}
            </div>
            <span className="card-badge badge-azul">
              {lider.nome.split(" ")[0]}
            </span>
          </div>
          <EChart option={recorteOpt} height={240} />
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Prioridades da População</div>
            <span className="card-badge badge-real">{nomeRegiao}</span>
          </div>
          <EChart option={prioridadesOpt} height={300} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Simulador de Cenário</div>
            <span className="card-badge badge-est">projeção</span>
          </div>
          <EChart option={projGauge} height={180} />
          <label className="field" style={{ marginTop: 8 }}>
            <span className="field-label">
              Variação de campanha: {swing > 0 ? "+" : ""}
              {swing} p.p.
            </span>
            <input
              type="range"
              min={-10}
              max={10}
              step={0.5}
              value={swing}
              onChange={(e) => setSwing(Number(e.target.value))}
            />
          </label>
          <label className="field" style={{ marginTop: 8 }}>
            <span className="field-label">
              Comparecimento: {comparecimento}%
            </span>
            <input
              type="range"
              min={60}
              max={90}
              value={comparecimento}
              onChange={(e) => setComparecimento(Number(e.target.value))}
            />
          </label>
          <div className="detail-row" style={{ marginTop: 8 }}>
            <span>Intenção projetada</span>
            <span style={{ color: "var(--branco)", fontWeight: 700 }}>
              {projetado}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
