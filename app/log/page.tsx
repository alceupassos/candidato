import { headers } from "next/headers";

import { appendAccessLog, summarizeAccessLogs } from "@/lib/access-log";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export default async function AccessLogPage() {
  await appendAccessLog(await headers(), {
    event: "log_page_view",
    path: "/log",
  });

  const summary = await summarizeAccessLogs();

  return (
    <main className="log-page">
      <section className="log-hero">
        <div>
          <p className="log-kicker">Auditoria de acesso</p>
          <h1>Log completo de acessos</h1>
          <p>
            Registro de quem acessou, IP detectado, cidade estimada por IP, quantidade de acessos e últimos eventos.
          </p>
        </div>
        <div className="log-stat-grid">
          <div className="log-stat">
            <span>Total</span>
            <strong>{summary.totalAccesses}</strong>
          </div>
          <div className="log-stat">
            <span>IPs únicos</span>
            <strong>{summary.uniqueIps}</strong>
          </div>
        </div>
      </section>

      <section className="log-panel">
        <h2>Resumo por IP</h2>
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr>
                <th>IP</th>
                <th>Cidade</th>
                <th>UF/Região</th>
                <th>País</th>
                <th>Acessos</th>
                <th>Último acesso</th>
                <th>Último evento</th>
                <th>Último caminho</th>
              </tr>
            </thead>
            <tbody>
              {summary.entries.map((entry) => (
                <tr key={`${entry.ip}-${entry.lastAccess}`}>
                  <td>{entry.ip}</td>
                  <td>{entry.city}</td>
                  <td>{entry.region}</td>
                  <td>{entry.country}</td>
                  <td>{entry.accessCount}</td>
                  <td>{formatDate(entry.lastAccess)}</td>
                  <td>{entry.event}</td>
                  <td>{entry.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="log-panel">
        <h2>Eventos recentes</h2>
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Evento</th>
                <th>IP</th>
                <th>Cidade</th>
                <th>Caminho</th>
                <th>User agent</th>
              </tr>
            </thead>
            <tbody>
              {summary.rawLogs.slice(0, 200).map((entry) => (
                <tr key={`${entry.at}-${entry.ip}-${entry.event}`}>
                  <td>{formatDate(entry.at)}</td>
                  <td>{entry.event}</td>
                  <td>{entry.ip}</td>
                  <td>{entry.city}</td>
                  <td>{entry.path}</td>
                  <td>{entry.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
