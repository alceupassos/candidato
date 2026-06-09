"use client";

import { useEffect, useMemo, useState } from "react";

import { EChart } from "@/components/echart";
import { funnelOption, gaugeOption } from "@/components/echart-options";
import { getMetaBaseline } from "@/lib/mock/campaign-metrics";
import { getRegion } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

type Counts = { inscritos: number; cadastrados: number; engajados: number };

const PERGUNTAS = [
  "Qual o principal problema do seu bairro?",
  "Você confia na nossa proposta para a região?",
  "Quer receber novidades da campanha no WhatsApp?",
];

export function MetaSection({ region }: { region: RegionId }) {
  const baseline = useMemo(() => getMetaBaseline(region), [region]);
  const [real, setReal] = useState<Counts>({
    inscritos: 0,
    cadastrados: 0,
    engajados: 0,
  });
  const [resposta, setResposta] = useState("");
  const [contato, setContato] = useState("");
  const [perguntaIdx, setPerguntaIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [okMsg, setOkMsg] = useState("");

  const load = async () => {
    try {
      const [crm, msgs, leads, eng] = await Promise.all([
        fetch("/api/crm", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch("/api/messages", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch("/api/transparency-lead", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch("/api/engagement", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);
      setReal({
        inscritos: crm?.contacts?.length ?? 0,
        cadastrados: leads?.count ?? 0,
        engajados: (eng?.respondentes ?? 0) + (msgs?.messages?.length ?? 0),
      });
    } catch {
      /* silencioso */
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const results = await Promise.all([
          fetch("/api/crm", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch("/api/messages", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch("/api/transparency-lead", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch("/api/engagement", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);
        if (!active) return;
        const [crm, msgs, leads, eng] = results;
        setReal({
          inscritos: crm?.contacts?.length ?? 0,
          cadastrados: leads?.count ?? 0,
          engajados: (eng?.respondentes ?? 0) + (msgs?.messages?.length ?? 0),
        });
      } catch {
        /* silencioso */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const meta = baseline.meta;
  const inscritos = baseline.inscritos + real.inscritos;
  const cadastrados = baseline.cadastrados + real.cadastrados;
  const engajados = baseline.engajados + real.engajados;
  const pct = Math.min(100, Math.round((inscritos / meta) * 100));

  const stages = [
    { name: "Meta", value: meta },
    { name: "Inscritos", value: inscritos },
    { name: "Cadastrados", value: cadastrados },
    { name: "Engajados", value: engajados },
  ];

  const nomeRegiao = getRegion(region)?.nome ?? "Todo o RJ";

  const responder = async () => {
    if (!resposta.trim()) return;
    setSaving(true);
    setOkMsg("");
    try {
      const res = await fetch("/api/engagement", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: PERGUNTAS[perguntaIdx],
          resposta,
          contato,
          regiao: nomeRegiao,
        }),
      });
      if (res.ok) {
        setOkMsg("Resposta registrada — engajamento +1.");
        setResposta("");
        setContato("");
        setPerguntaIdx((i) => (i + 1) % PERGUNTAS.length);
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="target" /> <strong>Meta de Votos</strong> · {nomeRegiao}
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Meta de Votos</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {meta.toLocaleString("pt-BR")}
          </div>
          <div className="kpi-sub">alvo da campanha</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Inscritos</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            {inscritos.toLocaleString("pt-BR")}
          </div>
          <div className="kpi-sub up">▲ {pct}% da meta</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Cadastrados</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {cadastrados.toLocaleString("pt-BR")}
          </div>
          <div className="kpi-sub">leads captados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Engajados</div>
          <div className="kpi-value" style={{ color: "#8b5cf6" }}>
            {engajados.toLocaleString("pt-BR")}
          </div>
          <div className="kpi-sub up">trocando mensagens / respondendo</div>
        </div>
      </div>

      <div className="grid3" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Progresso da Meta</div>
            <span className="card-badge badge-est">{pct}%</span>
          </div>
          <EChart
            option={gaugeOption(pct, "da meta", "#22c55e")}
            height={210}
          />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Cadastros vs Meta</div>
            <span className="card-badge badge-azul">captação</span>
          </div>
          <EChart
            option={gaugeOption(cadastrados, "cadastrados", "#f59e0b", meta)}
            height={210}
          />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Engajados vs Meta</div>
            <span className="card-badge badge-real">ao vivo</span>
          </div>
          <EChart
            option={gaugeOption(engajados, "engajados", "#8b5cf6", meta)}
            height={210}
          />
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Funil de Conversão</div>
            <span className="card-badge badge-est">meta → engajados</span>
          </div>
          <EChart option={funnelOption(stages)} height={260} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Responder Pergunta (engaja)</div>
            <span className="card-badge badge-real">+1 engajado</span>
          </div>
          <div className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Pergunta</span>
            <div
              style={{ color: "var(--branco)", fontSize: 13, padding: "6px 0" }}
            >
              {PERGUNTAS[perguntaIdx]}
            </div>
          </div>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Resposta do eleitor</span>
            <input
              className="field-input"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite a resposta…"
            />
          </label>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Contato (opcional)</span>
            <input
              className="field-input"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              placeholder="WhatsApp / nome"
            />
          </label>
          <button
            className="btn-primary"
            type="button"
            onClick={responder}
            disabled={saving || !resposta.trim()}
          >
            <i data-lucide="check-circle" />
            <span>{saving ? "Registrando…" : "Registrar resposta"}</span>
          </button>
          {okMsg ? (
            <div className="send-status ok" style={{ marginTop: 10 }}>
              {okMsg}
            </div>
          ) : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Meta vs Confirmados por Região</div>
          <span className="card-badge badge-azul">8 regiões</span>
        </div>
        <div className="chart-wrap" style={{ height: 240 }}>
          <canvas id="cMetaRegiao" />
        </div>
      </div>
    </div>
  );
}
