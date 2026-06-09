"use client";

import { useEffect, useMemo, useState } from "react";

import {
  MESSAGE_TEMPLATES,
  WHATSAPP_GROUPS,
} from "@/lib/mock/campaign-metrics";

type SentMessage = {
  id: string;
  at: string;
  channel: string;
  groupName: string;
  regiao: string;
  recipientCount: number;
  text: string;
  status: string;
  scheduledFor: string | null;
};

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} · ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function ComunicacaoSection() {
  const [groupId, setGroupId] = useState(WHATSAPP_GROUPS[0].id);
  const [templateId, setTemplateId] = useState(MESSAGE_TEMPLATES[0].id);
  const [textOverride, setTextOverride] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");
  const [history, setHistory] = useState<SentMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [statusMsg, setStatusMsg] = useState("");

  const group = useMemo(
    () => WHATSAPP_GROUPS.find((g) => g.id === groupId)!,
    [groupId],
  );
  const template = useMemo(
    () => MESSAGE_TEMPLATES.find((t) => t.id === templateId)!,
    [templateId],
  );

  // Texto derivado em render: parte do template (com {cidade} → região do
  // grupo) e usa a edição do operador quando houver. Sem efeito de sincronização.
  const defaultText = template.texto.replace(/\{cidade\}/g, group.regiao);
  const text = textOverride ?? defaultText;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/messages", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (active) setHistory(data.messages ?? []);
      } catch {
        /* silencioso */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const sent = history.filter((m) => m.status === "enviada");
  const scheduled = history.filter((m) => m.status === "agendada");
  const totalAlcance = sent.reduce((s, m) => s + m.recipientCount, 0);

  const handleSend = async () => {
    if (!text.trim()) {
      setStatus("error");
      setStatusMsg("Escreva a mensagem antes de enviar.");
      return;
    }
    setStatus("sending");
    setStatusMsg("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          templateId,
          channel: template.canal,
          text,
          scheduledFor: scheduledFor || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.saved) {
        throw new Error(data?.reason || "falha");
      }
      setHistory((prev) => [data.entry as SentMessage, ...prev]);
      setStatus("ok");
      setStatusMsg(
        scheduledFor
          ? `Mensagem agendada para ${group.membros} contatos de ${group.nome}.`
          : `Disparo simulado para ${group.membros} contatos de ${group.nome}.`,
      );
      setScheduledFor("");
      setTextOverride(null);
    } catch {
      setStatus("error");
      setStatusMsg("Não foi possível enviar. Tente novamente.");
    }
  };

  return (
    <div className="section active">
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Grupos WhatsApp</div>
          <div className="kpi-value" style={{ color: "#25d366" }}>
            {WHATSAPP_GROUPS.length}
          </div>
          <div className="kpi-sub up">
            ▲{" "}
            {WHATSAPP_GROUPS.reduce((s, g) => s + g.membros, 0).toLocaleString(
              "pt-BR",
            )}{" "}
            membros
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Disparos Enviados</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            {sent.length}
          </div>
          <div className="kpi-sub up">
            ▲ {totalAlcance.toLocaleString("pt-BR")} alcance
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Agendados</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {scheduled.length}
          </div>
          <div className="kpi-sub">próximos envios</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Engajamento Médio</div>
          <div className="kpi-value" style={{ color: "#60a5fa" }}>
            68%
          </div>
          <div className="kpi-sub up">▲ +6 p.p. no mês</div>
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Novo Disparo de Mensagem</div>
            <span className="card-badge badge-est">envio simulado</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <label className="field">
              <span className="field-label">Template</span>
              <select
                className="field-input"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {MESSAGE_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.canal} · {t.titulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Grupo / Segmento</span>
              <select
                className="field-input"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                {WHATSAPP_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome} ({g.membros})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field" style={{ marginBottom: 10 }}>
            <span className="field-label">Mensagem</span>
            <textarea
              className="field-input"
              rows={4}
              value={text}
              onChange={(e) => setTextOverride(e.target.value)}
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <label className="field" style={{ flex: 1, minWidth: 200 }}>
              <span className="field-label">Agendar (opcional)</span>
              <input
                className="field-input"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </label>
            <button
              className="btn-primary"
              type="button"
              onClick={handleSend}
              disabled={status === "sending"}
            >
              <i data-lucide="send" />
              <span>
                {status === "sending"
                  ? "Enviando…"
                  : scheduledFor
                    ? "Agendar"
                    : "Enviar agora"}
              </span>
            </button>
          </div>

          {status !== "idle" && statusMsg ? (
            <div className={`send-status ${status}`} role="status">
              {statusMsg}
            </div>
          ) : null}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Engajamento por Canal</div>
            <span className="card-badge badge-azul">5 semanas</span>
          </div>
          <div className="chart-wrap">
            <canvas id="cEngajamento" />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">Histórico de Envios</div>
          <span className="card-badge badge-real">
            {history.length} registros
          </span>
        </div>
        {history.length === 0 ? (
          <div className="empty-state">
            Nenhum disparo ainda. Envie a primeira mensagem acima.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Canal</th>
                  <th>Grupo</th>
                  <th>Região</th>
                  <th>Alcance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((m) => (
                  <tr key={m.id}>
                    <td>{fmtDateTime(m.scheduledFor || m.at)}</td>
                    <td>{m.channel}</td>
                    <td>{m.groupName}</td>
                    <td>{m.regiao}</td>
                    <td>{m.recipientCount.toLocaleString("pt-BR")}</td>
                    <td>
                      <span
                        className={`card-badge ${m.status === "enviada" ? "badge-real" : "badge-amarelo"}`}
                      >
                        {m.status}
                      </span>
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
