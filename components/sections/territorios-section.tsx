"use client";

import { useMemo } from "react";

import { EChart } from "@/components/echart";
import { RegionDrillMap } from "@/components/charts/region-drill-map";
import { barOption, lineOption } from "@/components/echart-options";
import { getTerritoriosIdade, getFlutuacao } from "@/lib/mock/campaign-metrics";
import { getPresidentialByState } from "@/lib/mock/races";
import { REGIONS, getRegion, regionEleitorado } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

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
