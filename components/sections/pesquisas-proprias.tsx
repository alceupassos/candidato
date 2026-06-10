"use client";

import { useEffect, useMemo, useState } from "react";

import { EChart } from "@/components/echart";
import {
  barOption,
  donutOption,
  funnelOption,
  gaugeOption,
  lineOption,
} from "@/components/echart-options";
import {
  SURVEY_CALENDAR,
  SURVEY_TEMPLATES,
  TARGET_MODES,
  buildLiveResult,
  getBases,
  getTemplate,
  type TargetMode,
} from "@/lib/mock/surveys";

const nf = (n: number) => n.toLocaleString("pt-BR");

type Active = {
  templateId: string;
  templateNome: string;
  baseNome: string;
  alcance: number;
} | null;
type SurveyRec = {
  id: string;
  at: string;
  templateNome: string;
  baseNome: string;
  alcance: number;
  status: string;
};

export function PesquisasProprias() {
  const [templateId, setTemplateId] = useState(SURVEY_TEMPLATES[0].id);
  const [mode, setMode] = useState<TargetMode>("tipo");
  const [baseId, setBaseId] = useState("");
  const [active, setActive] = useState<Active>(null);
  const [tick, setTick] = useState(0);
  const [historico, setHistorico] = useState<SurveyRec[]>([]);
  const [enviando, setEnviando] = useState(false);

  const template = getTemplate(templateId);
  const bases = useMemo(() => getBases(mode), [mode]);
  const baseSel = bases.find((b) => b.id === baseId) ?? bases[0];

  // Pulso ao vivo enquanto há pesquisa ativa.
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, [active]);

  // Carrega histórico.
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const r = await fetch("/api/surveys", { credentials: "include" });
        if (!r.ok) return;
        const d = await r.json();
        if (on) setHistorico(d.surveys ?? []);
      } catch {
        /* silencioso */
      }
    })();
    return () => {
      on = false;
    };
  }, [active]);

  const frac = Math.min(1, tick / 28);
  const live = active
    ? buildLiveResult(active.templateId, active.alcance, frac, tick)
    : null;

  const disparar = async () => {
    if (!baseSel) return;
    setEnviando(true);
    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          templateNome: template.nome,
          mode,
          baseId: baseSel.id,
          baseNome: baseSel.nome,
          alcance: baseSel.alcance,
        }),
      });
      if (res.ok) {
        setActive({
          templateId,
          templateNome: template.nome,
          baseNome: baseSel.nome,
          alcance: baseSel.alcance,
        });
        setTick(0);
      }
    } finally {
      setEnviando(false);
    }
  };

  // Opções dos gráficos (recriam por tick → atualizam ao vivo).
  const serieOpt =
    live &&
    lineOption(
      {
        labels: live.serieTempo.map((_, i) => `${i + 1}`),
        datasets: [
          { label: "Respostas", color: "#22c55e", data: live.serieTempo },
        ],
      },
      { area: true },
    );
  const opcaoOpt =
    live &&
    barOption({
      labels: live.porOpcao.map((o) => o.label),
      datasets: [
        {
          label: "%",
          color: "#22c55e",
          data: live.porOpcao.map((o) => o.pct),
          palette: live.porOpcao.map((o) => o.cor),
        },
      ],
    });
  const baseOpt =
    live &&
    barOption(
      {
        labels: live.porBase.map((b) => b.nome),
        datasets: [
          {
            label: "Respostas",
            color: "#60a5fa",
            data: live.porBase.map((b) => b.respostas),
          },
        ],
      },
      { horizontal: true },
    );
  const regiaoOpt =
    live &&
    barOption({
      labels: live.porRegiao.map((r) => r.nome.split(" ")[0]),
      datasets: [
        {
          label: "Respostas",
          color: "#f0c030",
          data: live.porRegiao.map((r) => r.value),
        },
      ],
    });
  const idadeOpt =
    live &&
    barOption({
      labels: ["16–24", "25–34", "35–44", "45–59", "60+"],
      datasets: [{ label: "%", color: "#8b5cf6", data: live.idade }],
    });
  const funnelOpt =
    live &&
    funnelOption([
      { name: "Disparados", value: live.disparados },
      { name: "Entregues", value: live.entregues },
      { name: "Abertos", value: live.abertos },
      { name: "Respondidos", value: live.respondidos },
    ]);
  const gaugeOpt = live && gaugeOption(live.taxaResposta, "taxa", "#22c55e");
  const sentOpt =
    live &&
    donutOption(
      ["Positivo", "Neutro", "Negativo"],
      [live.sentimento.pos, live.sentimento.neu, live.sentimento.neg],
      ["#22c55e", "#8a8aaa", "#ef4444"],
    );

  return (
    <div>
      {/* Calendário sugerido */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Calendário de Pesquisas Sugerido</div>
          <span className="card-badge badge-est">clique para preparar</span>
        </div>
        <div className="cal-grid">
          {SURVEY_CALENDAR.map((c) => (
            <button
              key={c.semana}
              type="button"
              className={`cal-card ${templateId === c.templateId ? "active" : ""}`}
              onClick={() => setTemplateId(c.templateId)}
            >
              <div className="cal-top">
                <strong>{c.semana}</strong>
                <span>{c.data}</span>
              </div>
              <div className="cal-tema">{c.tema}</div>
              <div className="cal-obj">{c.objetivo}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        {/* Montar pesquisa */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Pesquisa para Disparo</div>
            <span className="card-badge badge-azul">{template.publico}</span>
          </div>
          <div className="chip-row" style={{ marginBottom: 10 }}>
            {SURVEY_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`chip ${templateId === t.id ? "active" : ""}`}
                onClick={() => setTemplateId(t.id)}
              >
                {t.nome}
              </button>
            ))}
          </div>
          <div className="survey-q">“{template.pergunta}”</div>
          <div className="detail-list" style={{ marginTop: 8 }}>
            {template.opcoes.map((o) => (
              <div className="detail-row" key={o.label}>
                <span>
                  <span className="chip-dot" style={{ background: o.cor }} />{" "}
                  {o.label}
                </span>
                <span style={{ color: "var(--branco)", fontWeight: 700 }}>
                  {o.base}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Base-alvo + disparo */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Base-alvo (WhatsApp)</div>
            <span className="card-badge badge-est">selecione</span>
          </div>
          <div className="chip-row" style={{ marginBottom: 8 }}>
            {TARGET_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`chip ${mode === m.id ? "active" : ""}`}
                onClick={() => {
                  setMode(m.id);
                  setBaseId("");
                }}
              >
                {m.nome}
              </button>
            ))}
          </div>
          <div className="chip-row" style={{ marginBottom: 10 }}>
            {bases.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`chip ${baseSel?.id === b.id ? "active" : ""}`}
                onClick={() => setBaseId(b.id)}
              >
                {b.nome}
              </button>
            ))}
          </div>
          <div className="detail-row">
            <span>Alcance estimado</span>
            <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 18 }}>
              {nf(baseSel?.alcance ?? 0)}
            </span>
          </div>
          <button
            className="btn-primary"
            type="button"
            style={{ width: "100%", marginTop: 10 }}
            onClick={disparar}
            disabled={enviando || !baseSel}
          >
            <i data-lucide="send" />
            <span>{enviando ? "Disparando…" : "Disparar via WhatsApp"}</span>
          </button>
        </div>
      </div>

      {/* Painel VIVO */}
      {live && active && (
        <>
          <div className="region-banner" style={{ marginTop: 14 }}>
            <span className="dot-live" /> <strong>AO VIVO</strong> ·{" "}
            {active.templateNome} → {active.baseNome}
            <span className="card-badge badge-real" style={{ marginLeft: 8 }}>
              {nf(live.respondidos)} respostas
            </span>
          </div>

          <div className="kpi-row" style={{ marginTop: 10 }}>
            <div className="kpi-card">
              <div className="kpi-label">Respondidos</div>
              <div className="kpi-value" style={{ color: "#22c55e" }}>
                {nf(live.respondidos)}
              </div>
              <div className="kpi-sub up">▲ chegando…</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Taxa de resposta</div>
              <div className="kpi-value" style={{ color: "#60a5fa" }}>
                {live.taxaResposta}%
              </div>
              <div className="kpi-sub">sobre entregues</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Velocidade</div>
              <div className="kpi-value" style={{ color: "#f0c030" }}>
                {live.velocidade}
              </div>
              <div className="kpi-sub">respostas/min</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Alcance</div>
              <div className="kpi-value" style={{ color: "#8b5cf6" }}>
                {nf(live.alcance)}
              </div>
              <div className="kpi-sub">disparados</div>
            </div>
          </div>

          <div className="grid-7-5" style={{ marginTop: 12 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Respostas ao Longo do Tempo</div>
                <span className="card-badge badge-real">vivo</span>
              </div>
              <EChart option={serieOpt!} height={240} />
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Resultado por Opção</div>
                <span className="card-badge badge-azul">%</span>
              </div>
              <EChart option={opcaoOpt!} height={240} />
            </div>
          </div>

          <div className="grid3" style={{ marginTop: 12 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Funil de Entrega</div>
                <span className="card-badge badge-est">WhatsApp</span>
              </div>
              <EChart option={funnelOpt!} height={220} />
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Taxa de Resposta</div>
                <span className="card-badge badge-real">
                  {live.taxaResposta}%
                </span>
              </div>
              <EChart option={gaugeOpt!} height={220} />
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Sentimento das Respostas</div>
                <span className="card-badge badge-azul">tom</span>
              </div>
              <EChart option={sentOpt!} height={220} />
            </div>
          </div>

          <div className="grid3" style={{ marginTop: 12 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Respostas por Base</div>
                <span className="card-badge badge-est">segmento</span>
              </div>
              <EChart option={baseOpt!} height={220} />
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Respostas por Região</div>
                <span className="card-badge badge-azul">RJ</span>
              </div>
              <EChart option={regiaoOpt!} height={220} />
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Distribuição por Idade</div>
                <span className="card-badge badge-est">demografia</span>
              </div>
              <EChart option={idadeOpt!} height={220} />
            </div>
          </div>
        </>
      )}

      {/* Histórico */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Pesquisas Disparadas</div>
          <span className="card-badge badge-real">{historico.length}</span>
        </div>
        {historico.length === 0 ? (
          <div className="empty-state">
            Nenhuma pesquisa disparada ainda. Monte e dispare acima.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Pesquisa</th>
                  <th>Base</th>
                  <th>Alcance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((h) => (
                  <tr key={h.id}>
                    <td>{new Date(h.at).toLocaleString("pt-BR")}</td>
                    <td>{h.templateNome}</td>
                    <td>{h.baseNome}</td>
                    <td>{nf(h.alcance)}</td>
                    <td>
                      <span className="card-badge badge-real">{h.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
