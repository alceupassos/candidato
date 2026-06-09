"use client";

import { useMemo } from "react";

import { EChart } from "@/components/echart";
import { gaugeOption, orgTreeOption } from "@/components/echart-options";
import {
  LEVELS,
  getOrgAggregates,
  getOrgTree,
  getOrganizers,
} from "@/lib/mock/organizers";
import { getRegion } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

const nf = (n: number) => n.toLocaleString("pt-BR");
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

const STATUS_BADGE: Record<string, string> = {
  ativo: "badge-real",
  atencao: "badge-amarelo",
  inativo: "badge-cinza",
};

export function OrganizadoresSection({ region }: { region: RegionId }) {
  const nomeRegiao = getRegion(region)?.nome ?? "Todo o RJ";
  const agg = useMemo(() => getOrgAggregates(region), [region]);
  const leaders = useMemo(() => getOrganizers(region), [region]);
  const treeOpt = useMemo(() => orgTreeOption(getOrgTree(region)), [region]);

  const meta = agg.metas.lista;
  const atual = agg.metas.atual;
  const totalLideres = agg.porNivel
    .slice(0, 3)
    .reduce((s, n) => s + n.total, 0);

  const gListaOpt = useMemo(
    () => gaugeOption(pct(atual.lista, meta.lista), "Lista", "#8b5cf6"),
    [atual.lista, meta.lista],
  );
  const gCadOpt = useMemo(
    () =>
      gaugeOption(pct(atual.cadastro, meta.cadastro), "Cadastro", "#3b82f6"),
    [atual.cadastro, meta.cadastro],
  );
  const gEngOpt = useMemo(
    () =>
      gaugeOption(pct(atual.engajado, meta.engajado), "Engajado", "#22c55e"),
    [atual.engajado, meta.engajado],
  );

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="network" /> <strong>Organizadores de Eleitores</strong>{" "}
        · {nomeRegiao}
      </div>

      {/* Explicação auto-explicável */}
      <div className="explainer">
        <div className="explainer-step">
          <span className="step-n" style={{ background: "#8b5cf6" }}>
            1
          </span>{" "}
          <strong>Líderes de Igreja</strong>,{" "}
          <strong>Gerentes Regionais</strong> e{" "}
          <strong>Deputados Estaduais</strong> comandam a base.
        </div>
        <div className="explainer-step">
          <span className="step-n" style={{ background: "#22c55e" }}>
            2
          </span>{" "}
          Abaixo deles, os <strong>cabos eleitorais</strong> mobilizam os{" "}
          <strong>eleitores</strong>.
        </div>
        <div className="explainer-step">
          <span className="step-n" style={{ background: "#60a5fa" }}>
            3
          </span>{" "}
          Todos cumprem 3 metas: <strong>Lista</strong> ·{" "}
          <strong>Cadastro</strong> (com dados) · <strong>Engajado</strong>{" "}
          (clicou no QR do grupo e participa das pesquisas/mensageria).
        </div>
      </div>

      <div className="kpi-row" style={{ marginTop: 12 }}>
        <div className="kpi-card">
          <div className="kpi-label">Líderes (3 níveis)</div>
          <div className="kpi-value" style={{ color: "#8b5cf6" }}>
            {totalLideres}
          </div>
          <div className="kpi-sub">igreja · gerentes · deputados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Cabos Eleitorais</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            {nf(agg.cabos)}
          </div>
          <div className="kpi-sub up">mobilizando a base</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Eleitores na Rede</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {nf(agg.eleitores)}
          </div>
          <div className="kpi-sub">alcance direto</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Meta de Cadastro</div>
          <div className="kpi-value" style={{ color: "#f0c030" }}>
            {pct(atual.cadastro, meta.cadastro)}%
          </div>
          <div className="kpi-sub up">
            {nf(atual.cadastro)} / {nf(meta.cadastro)}
          </div>
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Organograma da Rede</div>
            <span className="card-badge badge-est">clique p/ expandir</span>
          </div>
          <EChart option={treeOpt} height={360} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Composição da Rede</div>
            <span className="card-badge badge-azul">{nomeRegiao}</span>
          </div>
          <div className="level-list">
            {agg.porNivel.map((lv) => {
              const total = agg.porNivel.reduce(
                (m, x) => Math.max(m, x.total),
                0,
              );
              return (
                <div className="level-row" key={lv.nivel}>
                  <span className="level-dot" style={{ background: lv.cor }} />
                  <span className="level-name">{lv.plural}</span>
                  <span className="level-bar">
                    <span
                      style={{
                        width: `${(lv.total / total) * 100}%`,
                        background: lv.cor,
                      }}
                    />
                  </span>
                  <span className="level-val">{nf(lv.total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Cumprimento de Metas da Rede</div>
          <span className="card-badge badge-real">
            lista · cadastro · engajado
          </span>
        </div>
        <div className="grid3">
          <div>
            <EChart option={gListaOpt} height={180} />
            <div className="gauge-cap">
              Lista · {nf(atual.lista)} / {nf(meta.lista)}
            </div>
          </div>
          <div>
            <EChart option={gCadOpt} height={180} />
            <div className="gauge-cap">
              Cadastro · {nf(atual.cadastro)} / {nf(meta.cadastro)}
            </div>
          </div>
          <div>
            <EChart option={gEngOpt} height={180} />
            <div className="gauge-cap">
              Engajado · {nf(atual.engajado)} / {nf(meta.engajado)}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Líderes & Progresso</div>
          <span className="card-badge badge-est">{leaders.length} líderes</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Líder</th>
                <th>Nível</th>
                <th>Cabos</th>
                <th>Eleitores</th>
                <th>Cadastro</th>
                <th>Engajado</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l) => {
                const lv = LEVELS.find((x) => x.id === l.nivel)!;
                return (
                  <tr key={l.id}>
                    <td>{l.nome}</td>
                    <td>
                      <span
                        className="level-dot"
                        style={{ background: lv.cor, marginRight: 6 }}
                      />
                      {lv.nome}
                    </td>
                    <td>{l.cabos}</td>
                    <td>{nf(l.eleitores)}</td>
                    <td>{pct(l.atual.cadastro, l.meta.cadastro)}%</td>
                    <td>{pct(l.atual.engajado, l.meta.engajado)}%</td>
                    <td>
                      <span className={`card-badge ${STATUS_BADGE[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
