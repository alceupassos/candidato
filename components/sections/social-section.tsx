"use client";

import { useMemo, useState } from "react";

import { EChart } from "@/components/echart";
import { BrazilMap } from "@/components/charts/brazil-map";
import { barOption, donutOption } from "@/components/echart-options";
import {
  ESPECTROS,
  NETWORKS,
  SOCIAL_FIGURES,
  espectroColor,
  getMentionsByState,
  getSpectrumSplit,
  totalFollowers,
  type Espectro,
  type Network,
} from "@/lib/mock/social-figures";

type NetSel = Network | "total";

function fmtK(thousands: number): string {
  if (thousands >= 1000) return `${(thousands / 1000).toFixed(1)}M`;
  return `${thousands}k`;
}

export function SocialSection() {
  const [net, setNet] = useState<NetSel>("total");
  const [espectro, setEspectro] = useState<Espectro | "todos">("todos");

  const ranking = useMemo(() => {
    const filtered = SOCIAL_FIGURES.filter(
      (f) => espectro === "todos" || f.espectro === espectro,
    );
    return filtered
      .map((f) => ({
        figure: f,
        followers: net === "total" ? totalFollowers(f) : f.redes[net],
      }))
      .sort((a, b) => b.followers - a.followers);
  }, [net, espectro]);

  const lider = ranking[0];
  const sentimentoMedio = Math.round(
    ranking.reduce((s, r) => s + r.figure.sentimento, 0) /
      Math.max(1, ranking.length),
  );
  const mentions = useMemo(() => getMentionsByState(), []);
  const split = useMemo(() => getSpectrumSplit(), []);
  const spectrumOpt = useMemo(
    () => donutOption(split.labels, split.data, split.palette, "M"),
    [split],
  );

  const topBarOpt = useMemo(() => {
    const top = ranking.slice(0, 8);
    return barOption(
      {
        labels: top.map((r) => r.figure.nome.split(" ")[0]),
        datasets: [
          {
            label: "Seguidores (mi)",
            color: "#22c55e",
            data: top.map((r) => Number((r.followers / 1000).toFixed(1))),
            palette: top.map((r) => espectroColor(r.figure.espectro)),
          },
        ],
      },
      { horizontal: true },
    );
  }, [ranking]);

  const netLabel =
    net === "total"
      ? "Todas as redes"
      : NETWORKS.find((n) => n.id === net)!.nome;

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="radio-tower" />{" "}
        <strong>Ranking de Redes Sociais</strong> · figuras nacionais &
        colunistas{" "}
        <span className="card-badge badge-cinza" style={{ marginLeft: 8 }}>
          dados demonstrativos
        </span>
      </div>

      {/* Abas de rede */}
      <div className="race-tabs" style={{ marginTop: 4 }}>
        <button
          type="button"
          className={`race-tab ${net === "total" ? "active" : ""}`}
          onClick={() => setNet("total")}
        >
          <strong>Todas</strong>
          <span>X · IG · YT · FB</span>
        </button>
        {NETWORKS.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`race-tab ${net === n.id ? "active" : ""}`}
            onClick={() => setNet(n.id)}
          >
            <strong>{n.nome}</strong>
            <span>seguidores</span>
          </button>
        ))}
      </div>

      {/* Filtro de espectro */}
      <div className="chip-row" style={{ marginTop: 10 }}>
        <button
          type="button"
          className={`chip ${espectro === "todos" ? "active" : ""}`}
          onClick={() => setEspectro("todos")}
        >
          Todos
        </button>
        {ESPECTROS.map((e) => (
          <button
            key={e.id}
            type="button"
            className={`chip ${espectro === e.id ? "active" : ""}`}
            style={
              espectro === e.id
                ? { borderColor: e.cor, color: e.cor }
                : undefined
            }
            onClick={() => setEspectro(e.id)}
          >
            <span className="chip-dot" style={{ background: e.cor }} /> {e.nome}
          </button>
        ))}
      </div>

      <div className="kpi-row" style={{ marginTop: 12 }}>
        <div className="kpi-card">
          <div className="kpi-label">Figuras monitoradas</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {ranking.length}
          </div>
          <div className="kpi-sub">{netLabel}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Maior audiência</div>
          <div
            className="kpi-value"
            style={{
              color: lider ? espectroColor(lider.figure.espectro) : "#22c55e",
              fontSize: 18,
            }}
          >
            {lider?.figure.nome.split(" ")[0] ?? "—"}
          </div>
          <div className="kpi-sub up">
            {lider ? fmtK(lider.followers) : "—"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Sentimento médio</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {sentimentoMedio}%
          </div>
          <div className="kpi-sub">positivo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Posts (7d)</div>
          <div className="kpi-value">
            {ranking.reduce((s, r) => s + r.figure.posts7d, 0)}
          </div>
          <div className="kpi-sub">no recorte</div>
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Ranking — {netLabel}</div>
            <span className="card-badge badge-real">{ranking.length}</span>
          </div>
          <div className="fig-list">
            {ranking.map((r, i) => (
              <div className="fig-row" key={r.figure.id}>
                <span className="fig-pos">{i + 1}</span>
                <span
                  className="fig-avatar"
                  style={{ background: espectroColor(r.figure.espectro) }}
                >
                  <img
                    className="fig-avatar-img"
                    src={r.figure.avatarAsset}
                    alt={`Avatar estilizado de ${r.figure.nome}`}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                </span>
                <span className="fig-name">
                  {r.figure.nome}
                  <small>{r.figure.grupo}</small>
                </span>
                <span className="fig-foll">{fmtK(r.followers)}</span>
                <span
                  className="fig-growth"
                  style={{
                    color: r.figure.crescimento7d >= 1 ? "#22c55e" : "#8a8aaa",
                  }}
                >
                  ▲ {r.figure.crescimento7d}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Audiência por Espectro</div>
            <span className="card-badge badge-azul">milhões</span>
          </div>
          <EChart option={spectrumOpt} height={260} />
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top 8 — {netLabel}</div>
            <span className="card-badge badge-est">milhões de seguidores</span>
          </div>
          <EChart option={topBarOpt} height={300} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Menções Políticas por Estado</div>
            <span className="card-badge badge-real">buzz nacional</span>
          </div>
          <BrazilMap data={mentions} max={100} height={300} />
        </div>
      </div>
    </div>
  );
}
