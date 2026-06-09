"use client";

import { useEffect, useState } from "react";

type DiaryEntry = {
  id: string;
  at: string;
  texto: string;
  local: string;
  categoria: string;
  autor: string;
};

const CATEGORIAS = ["Campo", "Mídia", "Reunião", "Articulação", "Imprensa"];

function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} · ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function DiarioSection() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [texto, setTexto] = useState("");
  const [local, setLocal] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/diario", { credentials: "include" });
        if (!res.ok) return;
        const json = await res.json();
        if (active) setEntries(json.entries ?? []);
      } catch {
        /* silencioso */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleAdd = async () => {
    if (!texto.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/diario", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, local, categoria }),
      });
      const json = await res.json();
      if (json.saved) {
        setEntries((prev) => [json.entry as DiaryEntry, ...prev]);
        setTexto("");
        setLocal("");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section active">
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Registros</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            {entries.length}
          </div>
          <div className="kpi-sub">no diário</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Hoje</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {
              entries.filter(
                (e) =>
                  new Date(e.at).toDateString() === new Date().toDateString(),
              ).length
            }
          </div>
          <div className="kpi-sub">atividades de hoje</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Locais</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {new Set(entries.map((e) => e.local).filter(Boolean)).size}
          </div>
          <div className="kpi-sub">percorridos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Atividades / Semana</div>
          <div className="kpi-value">—</div>
          <div className="kpi-sub">ver gráfico</div>
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Diário de Campanha</div>
            <span className="card-badge badge-real">
              {entries.length} entradas
            </span>
          </div>
          {entries.length === 0 ? (
            <div className="empty-state">
              Sem registros ainda. Anote a primeira atividade ao lado.
            </div>
          ) : (
            <div className="timeline">
              {entries.map((e) => (
                <div className="timeline-item" key={e.id}>
                  <div className="timeline-dot" />
                  <div className="timeline-body">
                    <div className="timeline-top">
                      <strong>{e.categoria}</strong>
                      {e.local ? (
                        <span className="card-badge badge-cinza">
                          {e.local}
                        </span>
                      ) : null}
                    </div>
                    <div
                      style={{ color: "var(--branco)", margin: "2px 0 4px" }}
                    >
                      {e.texto}
                    </div>
                    <div className="timeline-meta">
                      {fmt(e.at)} · {e.autor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Nova Entrada</div>
            <span className="card-badge badge-est">registro rápido</span>
          </div>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">O que aconteceu</span>
            <textarea
              className="field-input"
              rows={3}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Descreva a atividade…"
            />
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <label className="field">
              <span className="field-label">Local</span>
              <input
                className="field-input"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Cidade / bairro"
              />
            </label>
            <label className="field">
              <span className="field-label">Categoria</span>
              <select
                className="field-input"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            className="btn-primary"
            type="button"
            onClick={handleAdd}
            disabled={saving || !texto.trim()}
          >
            <i data-lucide="plus" />
            <span>{saving ? "Salvando…" : "Registrar"}</span>
          </button>

          <div className="card-header" style={{ marginTop: 18 }}>
            <div className="card-title">Atividades na Semana</div>
          </div>
          <div className="chart-wrap small">
            <canvas id="cDiario" />
          </div>
        </div>
      </div>
    </div>
  );
}
