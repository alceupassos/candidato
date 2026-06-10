"use client";

import { useState } from "react";
import type { UltimoPost } from "@/lib/mock/types";

export type HoverItem = {
  titulo: string;
  subtitulo?: string;
  foto?: string;
  cor?: string;
  post: UltimoPost;
};

type HoverState = { item: HoverItem; x: number; y: number } | null;

/** Hook para controlar o popover de "último post" (hover no desktop, toque no mobile). */
export function useHoverPost() {
  const [hover, setHover] = useState<HoverState>(null);
  const show = (item: HoverItem, e: { clientX: number; clientY: number }) =>
    setHover({ item, x: e.clientX, y: e.clientY });
  const hide = () => setHover(null);
  return { hover, show, hide };
}

const nf = (n?: number) => (n == null ? "" : n.toLocaleString("pt-BR"));

export function HoverPost({ hover }: { hover: HoverState }) {
  if (!hover) return null;
  const { item, x, y } = hover;
  const W = 340;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 720;
  let left = x + 18;
  if (left + W > vw - 10) left = x - W - 18;
  if (left < 10) left = 10;
  let top = y - 30;
  if (top + 240 > vh) top = Math.max(10, vh - 250);
  if (top < 10) top = 10;
  const p = item.post;
  const cor = item.cor ?? "#22c55e";

  return (
    <div
      className="hp-card"
      style={{ left, top, width: W }}
      role="dialog"
      aria-label="Último post"
    >
      <div className="hp-head">
        {item.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hp-foto" src={item.foto} alt="" />
        ) : (
          <span
            className="hp-foto hp-foto-fallback"
            style={{ background: cor }}
          >
            {item.titulo.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="hp-id">
          <strong>{item.titulo}</strong>
          {item.subtitulo ? <small>{item.subtitulo}</small> : null}
        </div>
        <span className="hp-rede" style={{ color: cor }}>
          {p.rede}
        </span>
      </div>
      <div className="hp-texto">“{p.texto}”</div>
      <div className="hp-meta">
        <span>{p.data}</span>
        <span className="hp-stats">
          {p.curtidas != null && <span>❤ {nf(p.curtidas)}</span>}
          {p.comentarios != null && <span>💬 {nf(p.comentarios)}</span>}
          {p.compartilhamentos != null && (
            <span>🔁 {nf(p.compartilhamentos)}</span>
          )}
          {p.visualizacoes != null && <span>👁 {nf(p.visualizacoes)}</span>}
        </span>
      </div>
      <a
        className="hp-link"
        href={p.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir publicação →
      </a>
    </div>
  );
}
