"use client";

import { useEffect, useState } from "react";

import { REGIONS } from "@/lib/mock/rj-regions";

type EventItem = {
  id: string;
  at: string;
  titulo: string;
  data: string;
  local: string;
  tipo: string;
};

const TIPOS = ["Comício", "Caminhada", "Reunião", "Live", "Debate", "Visita"];
const LOCAIS = REGIONS.flatMap((r) => r.municipios.map((m) => m.nome));

function fmt(dataISO: string) {
  const d = new Date(dataISO);
  if (Number.isNaN(d.getTime())) return dataISO;
  return `${d.toLocaleDateString("pt-BR")} · ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function AgendaSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [local, setLocal] = useState(LOCAIS[0]);
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/agenda", { credentials: "include" });
        if (!res.ok) return;
        const json = await res.json();
        if (active) setEvents(json.events ?? []);
      } catch {
        /* silencioso */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleAdd = async () => {
    if (!titulo.trim() || !data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, data, local, tipo }),
      });
      const json = await res.json();
      if (json.saved) {
        setEvents((prev) => [json.entry as EventItem, ...prev]);
        setTitulo("");
        setData("");
      }
    } finally {
      setSaving(false);
    }
  };

  const sorted = [...events].sort((a, b) => a.data.localeCompare(b.data));

  return (
    <div className="section active">
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Eventos Agendados</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            {events.length}
          </div>
          <div className="kpi-sub">na agenda</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Próximos 7 dias</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {
              sorted.filter((e) => {
                const diff =
                  (new Date(e.data).getTime() - new Date().getTime()) /
                  86_400_000;
                return diff >= 0 && diff <= 7;
              }).length
            }
          </div>
          <div className="kpi-sub">na semana</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Municípios</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {new Set(events.map((e) => e.local)).size}
          </div>
          <div className="kpi-sub">cobertos pela agenda</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Comícios</div>
          <div className="kpi-value">
            {events.filter((e) => e.tipo === "Comício").length}
          </div>
          <div className="kpi-sub">grandes atos</div>
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Agenda da Campanha</div>
            <span className="card-badge badge-real">
              {events.length} eventos
            </span>
          </div>
          {sorted.length === 0 ? (
            <div className="empty-state">
              Nenhum evento. Crie o primeiro ao lado.
            </div>
          ) : (
            <div className="timeline">
              {sorted.map((e) => (
                <div className="timeline-item" key={e.id}>
                  <div className="timeline-dot" />
                  <div className="timeline-body">
                    <div className="timeline-top">
                      <strong>{e.titulo}</strong>
                      <span className="card-badge badge-azul">{e.tipo}</span>
                    </div>
                    <div className="timeline-meta">
                      {fmt(e.data)} · {e.local}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Novo Evento</div>
            <span className="card-badge badge-est">agenda</span>
          </div>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Título</span>
            <input
              className="field-input"
              value={titulo}
              onChange={(ev) => setTitulo(ev.target.value)}
              placeholder="Ex.: Caminhada no Centro"
            />
          </label>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Data e hora</span>
            <input
              className="field-input"
              type="datetime-local"
              value={data}
              onChange={(ev) => setData(ev.target.value)}
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
              <select
                className="field-input"
                value={local}
                onChange={(ev) => setLocal(ev.target.value)}
              >
                {LOCAIS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Tipo</span>
              <select
                className="field-input"
                value={tipo}
                onChange={(ev) => setTipo(ev.target.value)}
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            className="btn-primary"
            type="button"
            onClick={handleAdd}
            disabled={saving || !titulo.trim() || !data}
          >
            <i data-lucide="calendar-plus" />
            <span>{saving ? "Salvando…" : "Adicionar evento"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
