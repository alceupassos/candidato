"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MapPoint = {
  accessCount: number;
  actor: string;
  city: string;
  country: string;
  ip: string;
  lastAccess: string;
  localCitado: string;
  localPorIp: string;
  mapped: boolean;
  region: string;
  x?: number;
  y?: number;
};

type AccessMapProps = {
  entries: MapPoint[];
  totalAccesses: number;
  uniqueIps: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function markerSize(accessCount: number, maxAccessCount: number) {
  const ratio = maxAccessCount <= 1 ? 0.4 : accessCount / maxAccessCount;
  return 14 + ratio * 26;
}

export function AccessMap({ entries, totalAccesses, uniqueIps }: AccessMapProps) {
  const [hoveredPointKey, setHoveredPointKey] = useState<string | null>(null);
  const points = useMemo(
    () => entries.filter((entry) => typeof entry.x === "number" && typeof entry.y === "number"),
    [entries],
  );

  const maxAccessCount = useMemo(
    () => points.reduce((max, point) => Math.max(max, point.accessCount), 1),
    [points],
  );

  const hoveredPoint = points.find((point) => `${point.city}-${point.ip}` === hoveredPointKey) || null;
  const listedPoints = entries
    .slice()
    .sort((a, b) => b.accessCount - a.accessCount || b.lastAccess.localeCompare(a.lastAccess));

  return (
    <main className="mapa-page">
      <section className="mapa-hero">
        <div>
          <p className="mapa-kicker">Monitor de acesso em tempo real</p>
          <h1>Mapa escuro do Brasil com acessos brilhando em verde</h1>
          <p>
            Passando o mouse sobre cada ponto, vemos a cidade, o IP, quem esta acessando e quantas vezes esse IP ja
            apareceu no sistema.
          </p>
        </div>
        <div className="mapa-stat-grid">
          <div className="mapa-stat-card">
            <span>Total de acessos</span>
            <strong>{totalAccesses}</strong>
          </div>
          <div className="mapa-stat-card">
            <span>IPs unicos</span>
            <strong>{uniqueIps}</strong>
          </div>
          <div className="mapa-stat-card">
            <span>Cidades mapeadas</span>
            <strong>{points.length}</strong>
          </div>
        </div>
      </section>

      <section className="mapa-layout">
        <div className="mapa-canvas-card">
          <div className="mapa-canvas">
            <div className="mapa-map-stage">
              <Image
                className="mapa-brazil"
                src="/brazil-map.svg"
                alt="Mapa do Brasil por estados"
                width={613}
                height={639}
                priority
              />

              {points.map((point) => {
                const size = markerSize(point.accessCount, maxAccessCount);
                const key = `${point.city}-${point.ip}`;

                return (
                  <button
                    key={key}
                    className={`mapa-marker ${hoveredPointKey === key ? "active" : ""}`}
                    type="button"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                    }}
                    onMouseEnter={() => setHoveredPointKey(key)}
                    onMouseLeave={() => setHoveredPointKey(null)}
                    onFocus={() => setHoveredPointKey(key)}
                    onBlur={() => setHoveredPointKey(null)}
                    aria-label={`${point.city}, ${point.actor}, ${point.accessCount} acessos`}
                  >
                    <span className="mapa-marker-core" />
                  </button>
                );
              })}
            </div>

            {hoveredPoint ? (
              <div
                className="mapa-tooltip"
                style={{
                  left: `calc(${hoveredPoint.x}% + 18px)`,
                  top: `calc(${hoveredPoint.y}% - 12px)`,
                }}
              >
                <strong>{hoveredPoint.city}</strong>
                <span>Quem: {hoveredPoint.actor}</span>
                <span>IP: {hoveredPoint.ip}</span>
                <span>Acessos: {hoveredPoint.accessCount}</span>
                <span>LOCALPORIP=&quot;{hoveredPoint.localPorIp}&quot;</span>
                <span>LOCALCITADO=&quot;{hoveredPoint.localCitado}&quot;</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mapa-side-card">
          <h2>Leitura de todos os IPs unicos</h2>
          <div className="mapa-side-list">
            {listedPoints.map((point) => (
              <article className="mapa-side-item" key={`${point.city}-${point.ip}`}>
                <div className="mapa-side-top">
                  <strong>{point.city}</strong>
                  <span>{point.accessCount} acessos</span>
                </div>
                <p>Quem: {point.actor}</p>
                <p>IP: {point.ip}</p>
                <p>Status no mapa: {point.mapped ? "marcado no Brasil" : "sem localizacao precisa"}</p>
                <p>LOCALPORIP=&quot;{point.localPorIp}&quot;</p>
                <p>LOCALCITADO=&quot;{point.localCitado}&quot;</p>
                <p>Ultimo acesso: {formatDate(point.lastAccess)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
