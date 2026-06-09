"use client";

import { useEffect, useMemo, useState } from "react";
import { Player } from "@remotion/player";

import { EChart } from "@/components/echart";
import { BrazilMap } from "@/components/charts/brazil-map";
import { useIs3D } from "@/components/charts/use-is-3d";
import {
  barOption,
  bar3DOption,
  heatmapOption,
  lineOption,
  regionsTreemapOption,
} from "@/components/echart-options";
import { MotionReport } from "@/remotion/MotionReport";
import {
  RACES,
  getPresidentialByState,
  getRaceRanking,
  getRaceTimeline,
  getRaceIntencaoRejeicao,
} from "@/lib/mock/races";
import {
  getOpportunityRanking,
  getPriorityMatrix,
  getRegionTopOpportunity,
} from "@/lib/mock/priorities";
import { REGIONS, getRegion, regionEleitorado } from "@/lib/mock/rj-regions";
import type { RaceId, RegionId } from "@/lib/mock/types";

type NocProps = { region: RegionId; onRegionChange: (id: RegionId) => void };

const nameToId = new Map(REGIONS.map((r) => [r.nome, r.id]));

export function NocSection({ region, onRegionChange }: NocProps) {
  const [race, setRace] = useState<RaceId>("dep-federal");
  const [tick, setTick] = useState(0);

  // Pulso "ao vivo": atualiza a cada 2.5s.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  const r = getRegion(region);
  const nomeRegiao = r?.nome ?? "Todo o RJ";

  // Opções pesadas memoizadas por região/cargo (não recriam a cada tick).
  const timelineOpt = useMemo(
    () => lineOption(getRaceTimeline(race, region), { area: false }),
    [race, region],
  );
  const intRejOpt = useMemo(
    () => barOption(getRaceIntencaoRejeicao(race, region)),
    [race, region],
  );

  const treemapOpt = useMemo(() => {
    const tops = getRegionTopOpportunity();
    const data = REGIONS.map((reg) => {
      const top = tops.find((t) => t.id === reg.id)!;
      return {
        name: reg.nome,
        value: regionEleitorado(reg),
        oportunidade: top.indice,
        tema: top.tema,
      };
    });
    return regionsTreemapOption(data);
  }, []);

  const is3D = useIs3D();
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

  const presidentialByState = useMemo(() => getPresidentialByState(), []);
  const ranking = getRaceRanking(race, region);
  const maxIntencao = Math.max(...ranking.map((c) => c.intencao));
  const oportunidades = getOpportunityRanking(region).slice(0, 5);
  const regionTops = useMemo(() => getRegionTopOpportunity(), []);

  // Números "vivos" — base por região, oscilando com o tick.
  const baseIntencao = r ? r.intencaoVoto : 8.7;
  const wave = Math.sin(tick / 1.7);
  const liveStats = [
    {
      label: "Intenção (Dep. Fed.)",
      value: `${(baseIntencao + wave * 0.15).toFixed(1)}%`,
      cor: "#22c55e",
    },
    {
      label: "Engajamento",
      value: `${(68 + wave * 1.4).toFixed(0)}%`,
      cor: "#8b5cf6",
    },
    {
      label: "Alcance 24h",
      value: `${(342 + wave * 9).toFixed(0)}k`,
      cor: "#60a5fa",
    },
    { label: "Cabos ativos", value: `${r ? r.cabos : 318}`, cor: "#f0c030" },
  ];

  // Ticker rolando manchetes/movimentações.
  const headlines = [
    `${ranking[0].nome} lidera ${RACES.find((x) => x.id === race)!.nome} com ${ranking[0].intencao}% em ${nomeRegiao}`,
    `Maior oportunidade em ${nomeRegiao}: ${oportunidades[0].tema} (índice ${oportunidades[0].oportunidade})`,
    `Engajamento sobe para ${(68 + wave * 1.4).toFixed(0)}% na última hora`,
    `${oportunidades[1].tema} e ${oportunidades[2].tema} puxam intenção de voto na região`,
  ];

  const motionMetrics = [
    {
      label: "Intenção",
      value: `${baseIntencao.toFixed(1)}%`,
      color: "#22c55e",
    },
    { label: "Engajados", value: "12.4k", color: "#8b5cf6" },
    { label: "Cabos", value: `${r ? r.cabos : 318}`, color: "#60a5fa" },
    { label: "Oportunidade", value: oportunidades[0].tema, color: "#f0c030" },
  ];

  return (
    <div className="section active">
      {/* Banner war-room */}
      <div className="noc-banner-img">
        <div className="noc-banner-overlay">
          <div className="noc-banner-title">NOC ao Vivo — War Room</div>
          <div className="noc-banner-sub">
            Monitoramento eleitoral · {nomeRegiao}
          </div>
        </div>
      </div>
      {/* Ticker ao vivo */}
      <div className="noc-ticker">
        <span className="noc-live">
          <span className="dot-live" /> AO VIVO
        </span>
        <div className="noc-ticker-track">
          <span>
            {headlines.join("   •   ")} • {headlines.join("   •   ")}
          </span>
        </div>
      </div>

      <div className="kpi-row" style={{ marginTop: 12 }}>
        {liveStats.map((s) => (
          <div className="kpi-card" key={s.label}>
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-value" style={{ color: s.cor }}>
              {s.value}
            </div>
            <div className="kpi-sub up">▲ atualizando…</div>
          </div>
        ))}
      </div>

      {/* Abas de cargo */}
      <div className="race-tabs" style={{ marginTop: 12 }}>
        {RACES.map((rc) => (
          <button
            key={rc.id}
            type="button"
            className={`race-tab ${race === rc.id ? "active" : ""}`}
            onClick={() => setRace(rc.id)}
          >
            <strong>{rc.nome}</strong>
            <span>{rc.escopo}</span>
          </button>
        ))}
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Evolução — {RACES.find((x) => x.id === race)!.nome}
            </div>
            <span className="card-badge badge-real">6 ondas</span>
          </div>
          <EChart option={timelineOpt} height={260} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Ranking ao Vivo</div>
            <span className="card-badge badge-est">{nomeRegiao}</span>
          </div>
          <div className="rank-list">
            {ranking.map((c, i) => (
              <div className="rank-row" key={c.nome}>
                <span className="rank-pos">{i + 1}º</span>
                <span className="rank-name">
                  {c.nome}
                  <small>{c.partido}</small>
                </span>
                <span className="rank-bar">
                  <span
                    style={{
                      width: `${(c.intencao / maxIntencao) * 100}%`,
                      background: c.cor,
                    }}
                  />
                </span>
                <span className="rank-val">{c.intencao}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Intenção × Rejeição</div>
            <span className="card-badge badge-azul">
              {RACES.find((x) => x.id === race)!.nome}
            </span>
          </div>
          <EChart option={intRejOpt} height={240} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Mapa de Oportunidade Regional</div>
            <span className="card-badge badge-est">clique p/ filtrar</span>
          </div>
          <EChart
            option={treemapOpt}
            height={240}
            onSelect={(name) => {
              const id = nameToId.get(name);
              if (id) onRegionChange(id);
            }}
          />
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Mapa Nacional — Corrida Presidencial</div>
          <span className="card-badge badge-real">
            intenção do líder por estado
          </span>
        </div>
        <BrazilMap data={presidentialByState} max={58} height={420} />
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Cubo Raio-X — Oportunidade por Região × Tema
            </div>
            <span className="card-badge badge-real">
              {is3D ? "3D" : "mapa de calor"}
            </span>
          </div>
          <EChart option={cubeOpt} use3D={is3D} height={320} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Oportunidades</div>
            <span className="card-badge badge-est">{nomeRegiao}</span>
          </div>
          <div className="opp-list">
            {oportunidades.map((o) => (
              <div className="opp-row" key={o.tema}>
                <div className="opp-top">
                  <strong>{o.tema}</strong>
                  <span className="opp-idx">{o.oportunidade}</span>
                </div>
                <div className="opp-meta">
                  Demanda {o.demanda} · Potencial {o.potencialVotos} ·
                  Satisfação {o.satisfacaoAtual}
                </div>
                <div className="opp-bar">
                  <span style={{ width: `${o.oportunidade}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top oportunidade por ÁREA (todas as regiões de uma vez) */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">
            Top Oportunidade por Área — Estado Inteiro
          </div>
          <span className="card-badge badge-est">
            clique p/ filtrar a região
          </span>
        </div>
        <div className="opp-area-grid">
          {regionTops
            .slice()
            .sort((a, b) => b.indice - a.indice)
            .map((rt) => {
              const id = nameToId.get(rt.nome);
              return (
                <button
                  type="button"
                  className="opp-area-card"
                  key={rt.id}
                  onClick={() => id && onRegionChange(id)}
                >
                  <div className="opp-area-top">
                    <span className="opp-area-reg">{rt.nome}</span>
                    <span className="opp-idx">{rt.indice}</span>
                  </div>
                  <div className="opp-area-tema">{rt.tema}</div>
                  <div className="opp-bar">
                    <span style={{ width: `${rt.indice}%` }} />
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Motion Report</div>
          <span className="card-badge badge-real">Remotion · loop</span>
        </div>
        <div className="motion-wrap">
          <Player
            component={MotionReport}
            durationInFrames={240}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            autoPlay
            loop
            controls
            inputProps={{
              candidate: "Renato Araújo",
              regiao: nomeRegiao,
              metrics: motionMetrics,
            }}
            style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}
          />
        </div>
      </div>
    </div>
  );
}
