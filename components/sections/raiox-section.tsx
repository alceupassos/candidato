"use client";

import { useMemo } from "react";

import { EChart } from "@/components/echart";
import { Oraculo } from "@/components/oraculo";
import { useIs3D } from "@/components/charts/use-is-3d";
import {
  heatmapOption,
  priorityScatterOption,
  scatter3DOption,
} from "@/components/echart-options";
import {
  getOpportunityRanking,
  getPriorityMatrix,
} from "@/lib/mock/priorities";
import { REGIONS, getRegion } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

export function RaioxSection({ region }: { region: RegionId }) {
  const r = getRegion(region);
  const nomeRegiao = r?.nome ?? "Todo o RJ";
  const matrix = useMemo(() => getPriorityMatrix(region), [region]);
  const ranking = useMemo(() => getOpportunityRanking(region), [region]);

  const is3D = useIs3D();
  const scatterOpt = useMemo(() => priorityScatterOption(matrix), [matrix]);
  const scatter3DOpt = useMemo(
    () => (is3D ? scatter3DOption(matrix) : priorityScatterOption(matrix)),
    [matrix, is3D],
  );
  const heatmapOpt = useMemo(() => {
    const temas = getPriorityMatrix(REGIONS[0].id).map((m) => m.tema);
    const regions = REGIONS.map((reg) => reg.nome);
    const values = REGIONS.map((reg) =>
      getPriorityMatrix(reg.id).map((m) => m.oportunidade),
    );
    return heatmapOption(regions, temas, values);
  }, []);

  const top = ranking[0];
  const satisfacaoMedia = Math.round(
    matrix.reduce((s, m) => s + m.satisfacaoAtual, 0) / matrix.length,
  );
  const demandaMedia = Math.round(
    matrix.reduce((s, m) => s + m.demanda, 0) / matrix.length,
  );

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="scan-search" /> <strong>Raio-X Regional</strong> ·{" "}
        {nomeRegiao} — o que a população precisa e o que dá mais votos
      </div>

      <Oraculo section="raiox" context={`Região ${nomeRegiao}`} />

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Maior Oportunidade</div>
          <div className="kpi-value" style={{ color: "#22c55e", fontSize: 20 }}>
            {top.tema}
          </div>
          <div className="kpi-sub up">índice {top.oportunidade}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Demanda Média</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {demandaMedia}
          </div>
          <div className="kpi-sub">intensidade popular</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Satisfação Média</div>
          <div
            className="kpi-value"
            style={{ color: satisfacaoMedia < 45 ? "#ef4444" : "#f59e0b" }}
          >
            {satisfacaoMedia}
          </div>
          <div className="kpi-sub">quanto menor, mais dor</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Temas Mapeados</div>
          <div className="kpi-value">{matrix.length}</div>
          <div className="kpi-sub">eixos de prioridade</div>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Quadrante Demanda × Potencial de Votos
            </div>
            <span className="card-badge badge-est">bolha = urgência</span>
          </div>
          <EChart option={scatterOpt} height={300} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              {is3D ? "Cubo 3D" : "Dispersão"} — Demanda × Potencial ×
              Satisfação
            </div>
            <span className="card-badge badge-real">{is3D ? "3D" : "2D"}</span>
          </div>
          <EChart option={scatter3DOpt} use3D={is3D} height={300} />
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Mapa de Calor — Oportunidade por Região × Tema
            </div>
            <span className="card-badge badge-azul">estado inteiro</span>
          </div>
          <EChart option={heatmapOpt} height={320} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Ranking de Oportunidades</div>
            <span className="card-badge badge-est">{nomeRegiao}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tema</th>
                  <th>Demanda</th>
                  <th>Potencial</th>
                  <th>Satisf.</th>
                  <th>Índice</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((o, i) => (
                  <tr key={o.tema}>
                    <td>{i + 1}</td>
                    <td>{o.tema}</td>
                    <td>{o.demanda}</td>
                    <td>{o.potencialVotos}</td>
                    <td>{o.satisfacaoAtual}</td>
                    <td>
                      <span className="card-badge badge-real">
                        {o.oportunidade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
