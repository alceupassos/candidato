"use client";

import { useMemo } from "react";

import { EChart } from "@/components/echart";
import { Oraculo } from "@/components/oraculo";
import { RegionDrillMap } from "@/components/charts/region-drill-map";
import { barOption, lineOption } from "@/components/echart-options";
import {
  getExpectedVotesByRegion,
  getTerritoriosIdade,
  getFlutuacao,
} from "@/lib/mock/campaign-metrics";
import { getOpportunityRanking } from "@/lib/mock/priorities";
import { getPresidentialByState } from "@/lib/mock/races";
import { REGIONS, getRegion, regionEleitorado } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

function statusRegiao(cob: number): { label: string; cor: string } {
  if (cob >= 70) return { label: "forte", cor: "#22c55e" };
  if (cob >= 50) return { label: "atenção", cor: "#f0c030" };
  return { label: "crítica", cor: "#ef4444" };
}

const nf = (n: number) => n.toLocaleString("pt-BR");

export function TerritoriosSection({
  region,
  onRegionChange,
}: {
  region: RegionId;
  onRegionChange: (id: RegionId) => void;
}) {
  const r = getRegion(region);
  const nomeRegiao = r?.nome ?? "Todo o RJ";

  const bairros = r
    ? r.bairrosDestaque
    : REGIONS.flatMap((reg) => reg.bairrosDestaque).slice(0, 12);
  const municipios = r
    ? r.municipios.length
    : REGIONS.reduce((s, x) => s + x.municipios.length, 0);
  const cabos = r ? r.cabos : REGIONS.reduce((s, x) => s + x.cabos, 0);
  const cobertura = r
    ? r.cobertura
    : Math.round(REGIONS.reduce((s, x) => s + x.cobertura, 0) / REGIONS.length);
  const eleitorado = r
    ? regionEleitorado(r)
    : REGIONS.reduce((s, x) => s + regionEleitorado(x), 0);

  const brasil = useMemo(() => getPresidentialByState(), []);
  const situacao = useMemo(() => {
    const exp = getExpectedVotesByRegion().regioes;
    return REGIONS.map((reg) => {
      const e = exp.find((x) => x.id === reg.id);
      const top = getOpportunityRanking(reg.id)[0];
      return {
        id: reg.id as RegionId,
        nome: reg.nome,
        cobertura: reg.cobertura,
        intencao: reg.intencaoVoto,
        votos: e?.votos ?? 0,
        tema: top?.tema ?? "—",
        st: statusRegiao(reg.cobertura),
      };
    }).sort((a, b) => b.votos - a.votos);
  }, []);
  const idadeOpt = useMemo(
    () => barOption(getTerritoriosIdade(region)),
    [region],
  );
  const flutOpt = useMemo(
    () => lineOption(getFlutuacao(region), { area: false }),
    [region],
  );

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="map" /> <strong>Territórios e Bairros</strong> ·{" "}
        {nomeRegiao}
      </div>

      <Oraculo section="territorios" context={`Região ${nomeRegiao}`} />

      {/* Situação por Região */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">
            Situação por Região — como está cada uma
          </div>
          <span className="card-badge badge-real">clique para focar</span>
        </div>
        <div className="situacao-grid">
          {situacao.map((s) => (
            <button
              type="button"
              className="situacao-card"
              key={s.id}
              style={{ borderTopColor: s.st.cor }}
              onClick={() => onRegionChange(s.id)}
            >
              <div className="sit-top">
                <span className="sit-nome">{s.nome}</span>
                <span
                  className="sit-badge"
                  style={{ color: s.st.cor, borderColor: s.st.cor }}
                >
                  {s.st.label}
                </span>
              </div>
              <div className="sit-bar">
                <span
                  style={{ width: `${s.cobertura}%`, background: s.st.cor }}
                />
              </div>
              <div className="sit-metrics">
                <span>{s.cobertura}% cobertura</span>
                <span>{s.intencao}% intenção</span>
              </div>
              <div className="sit-foot">
                <span className="sit-votos">{nf(s.votos)} votos</span>
                <span className="sit-tema">foco: {s.tema}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Bairros mapeados</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            {bairros.length}
          </div>
          <div className="kpi-sub up">▲ +8 no mês</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Municípios ativos</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {municipios}
          </div>
          <div className="kpi-sub">{nf(eleitorado)} eleitores</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Cabos eleitorais</div>
          <div className="kpi-value" style={{ color: "#f0c030" }}>
            {nf(cabos)}
          </div>
          <div className="kpi-sub up">▲ +24</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Cobertura média</div>
          <div className="kpi-value">{cobertura}%</div>
          <div className="kpi-sub up">▲ +5 p.p.</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">
            Mapa — Brasil ▸ Regiões do Rio de Janeiro
          </div>
          <span className="card-badge badge-est">
            drill-down · clique p/ filtrar
          </span>
        </div>
        <RegionDrillMap
          brasil={brasil}
          onRegionChange={onRegionChange}
          height={420}
        />
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Bairros & Localidades — Desempenho</div>
          <span className="card-badge badge-est">penetração</span>
        </div>
        <div className="bairro-grid">
          {bairros.map((b) => (
            <div className="bairro-chip" key={b.nome}>
              <span>{b.nome}</span>
              <strong
                style={{
                  color:
                    b.valor >= 60
                      ? "#22c55e"
                      : b.valor >= 45
                        ? "#f0c030"
                        : "#ef4444",
                }}
              >
                {b.valor}%
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Aprovação por Faixa Etária</div>
            <span className="card-badge badge-azul">{nomeRegiao}</span>
          </div>
          <EChart option={idadeOpt} height={240} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Flutuação por Município — 4 semanas
            </div>
            <span className="card-badge badge-est">tendência</span>
          </div>
          <EChart option={flutOpt} height={240} />
        </div>
      </div>
    </div>
  );
}
