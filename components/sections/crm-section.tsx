"use client";

import { useEffect, useMemo, useState } from "react";

import { REGIONS } from "@/lib/mock/rj-regions";

type Contact = {
  id: string;
  at: string;
  nome: string;
  cidade: string;
  whatsapp?: string;
  stage: "lead" | "comprometido" | "multiplicador";
};

const STAGES: { id: Contact["stage"]; label: string; color: string }[] = [
  { id: "lead", label: "Leads", color: "#60a5fa" },
  { id: "comprometido", label: "Comprometidos", color: "#22c55e" },
  { id: "multiplicador", label: "Multiplicadores", color: "#f59e0b" },
];

const CIDADES = REGIONS.flatMap((r) => r.municipios.map((m) => m.nome));

export function CrmSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState(CIDADES[0]);
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/crm", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setContacts(data.contacts ?? []);
    } catch {
      /* silencioso */
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/crm", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (active) setContacts(data.contacts ?? []);
      } catch {
        /* silencioso */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    return STAGES.reduce<Record<string, number>>((acc, s) => {
      acc[s.id] = contacts.filter((c) => c.stage === s.id).length;
      return acc;
    }, {});
  }, [contacts]);

  const META = 45000;
  const confirmados = (counts.comprometido ?? 0) + (counts.multiplicador ?? 0);

  const handleAdd = async () => {
    if (!nome.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/crm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, whatsapp, stage: "lead" }),
      });
      const data = await res.json();
      if (data.saved) {
        setContacts((prev) => [data.entry as Contact, ...prev]);
        setNome("");
        setWhatsapp("");
      }
    } finally {
      setSaving(false);
    }
  };

  const moveStage = async (contact: Contact, dir: 1 | -1) => {
    const order = STAGES.map((s) => s.id);
    const idx = order.indexOf(contact.stage);
    const next = order[idx + dir];
    if (!next) return;
    // Atualização otimista.
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, stage: next } : c)),
    );
    try {
      await fetch("/api/crm", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contact.id, stage: next }),
      });
    } catch {
      void load();
    }
  };

  return (
    <div className="section active">
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Meta de Votos</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            {META.toLocaleString("pt-BR")}
          </div>
          <div className="kpi-sub">objetivo da campanha</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Confirmados</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            {confirmados}
          </div>
          <div className="kpi-sub up">▲ comprometidos + multiplicadores</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Leads em Aberto</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {counts.lead ?? 0}
          </div>
          <div className="kpi-sub">a converter</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Base Total</div>
          <div className="kpi-value">{contacts.length}</div>
          <div className="kpi-sub">contatos no funil</div>
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Funil de Votos por Estágio</div>
            <span className="card-badge badge-est">CRM eleitoral</span>
          </div>
          <div className="funnel">
            {STAGES.map((s) => (
              <div className="funnel-col" key={s.id}>
                <div className="funnel-head" style={{ borderColor: s.color }}>
                  <span style={{ color: s.color }}>●</span> {s.label}
                  <span className="funnel-count">{counts[s.id] ?? 0}</span>
                </div>
                <div className="funnel-body">
                  {contacts.filter((c) => c.stage === s.id).length === 0 ? (
                    <div className="empty-state small">vazio</div>
                  ) : (
                    contacts
                      .filter((c) => c.stage === s.id)
                      .map((c) => (
                        <div className="funnel-card" key={c.id}>
                          <div>
                            <strong>{c.nome}</strong>
                            <div className="funnel-meta">{c.cidade}</div>
                          </div>
                          <div className="funnel-actions">
                            <button
                              type="button"
                              title="Voltar"
                              onClick={() => moveStage(c, -1)}
                              disabled={s.id === "lead"}
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              title="Avançar"
                              onClick={() => moveStage(c, 1)}
                              disabled={s.id === "multiplicador"}
                            >
                              ›
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Adicionar Eleitor</div>
            <span className="card-badge badge-azul">entrada manual</span>
          </div>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Nome</span>
            <input
              className="field-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
            />
          </label>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Cidade</span>
            <select
              className="field-input"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            >
              {CIDADES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">WhatsApp (opcional)</span>
            <input
              className="field-input"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(21) 9....."
            />
          </label>
          <button
            className="btn-primary"
            type="button"
            onClick={handleAdd}
            disabled={saving || !nome.trim()}
          >
            <i data-lucide="user-plus" />
            <span>{saving ? "Salvando…" : "Adicionar ao funil"}</span>
          </button>

          <div className="card-header" style={{ marginTop: 18 }}>
            <div className="card-title">Meta por Município</div>
          </div>
          <div className="chart-wrap small">
            <canvas id="cCrmMunicipio" />
          </div>
        </div>
      </div>
    </div>
  );
}
