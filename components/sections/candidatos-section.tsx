"use client";

import { HoverPost, useHoverPost } from "@/components/hover-post";
import { candidateDetails } from "@/components/campaign-data";
import type { UltimoPost } from "@/lib/mock/types";

type CD = (typeof candidateDetails)[keyof typeof candidateDetails];

function fotoSrc(f: string): string {
  return f.startsWith("/") ? f : `/${f}`;
}

function getCandidatoPost(cd: CD): UltimoPost {
  const fonte = cd.fontes?.[0];
  const acao = cd.acoes?.[0];
  return {
    rede: "Perfil oficial",
    texto: acao
      ? `${acao[1]}${acao[2] ? ` — ${acao[2]}` : ""}`
      : `${cd.nome} em campanha.`,
    data: acao ? acao[0] : "recente",
    link: fonte ? fonte[1] : "#",
  };
}

export function CandidatosSection() {
  const { hover, show, hide } = useHoverPost();
  const entries = Object.entries(candidateDetails) as [string, CD][];

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="user-round-search" />{" "}
        <strong>Todos os Candidatos</strong> · Dep. Federal RJ 2026
        <span className="card-badge badge-cinza" style={{ marginLeft: 8 }}>
          clique para o dossiê
        </span>
      </div>

      <div className="cand-grid" style={{ marginTop: 12 }}>
        {entries.map(([key, cd]) => {
          const hi = {
            titulo: cd.nome,
            subtitulo: cd.partido,
            foto: fotoSrc(cd.foto),
            cor: "#22c55e",
            post: getCandidatoPost(cd),
          };
          return (
            <div
              className="cand-card hoverable"
              key={key}
              data-candidate-key={key}
              role="button"
              tabIndex={0}
              onMouseEnter={(e) => show(hi, e)}
              onMouseMove={(e) => show(hi, e)}
              onMouseLeave={hide}
              onTouchStart={(e) =>
                show(hi, {
                  clientX: e.touches[0].clientX,
                  clientY: e.touches[0].clientY,
                })
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="cand-photo"
                src={fotoSrc(cd.foto)}
                alt={cd.nome}
                loading="lazy"
              />
              <div className="cand-info">
                <div className="cand-nome">{cd.nome}</div>
                <div className="cand-part">{cd.partido}</div>
                <div className="cand-meta">
                  {cd.meta.slice(0, 2).map((m) => (
                    <span className="card-badge badge-cinza" key={m}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <HoverPost hover={hover} />
    </div>
  );
}
