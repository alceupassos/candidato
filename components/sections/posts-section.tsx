"use client";

import { HoverPost, useHoverPost } from "@/components/hover-post";
import {
  CANDIDATE_POSTS,
  POST_NETWORKS,
  type PostNet,
} from "@/lib/mock/candidate-posts";

export function PostsSection() {
  const { hover, show, hide } = useHoverPost();

  return (
    <div className="section active">
      <div className="region-banner">
        <i data-lucide="newspaper" />{" "}
        <strong>Posts por Candidato & Rede</strong>
        <span className="card-badge badge-cinza" style={{ marginLeft: 8 }}>
          passe o mouse na rede para o último post
        </span>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div className="card-title">
            Top 20 — X · Instagram · YouTube · TikTok · Facebook
          </div>
          <span className="card-badge badge-real">
            {CANDIDATE_POSTS.length}
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl posts-tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Candidato</th>
                {POST_NETWORKS.map((n) => (
                  <th key={n.id} style={{ color: n.cor, textAlign: "center" }}>
                    {n.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CANDIDATE_POSTS.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>
                    <span className="post-cand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="post-foto"
                        src={row.foto}
                        alt={row.nome}
                        loading="lazy"
                      />
                      <span>
                        <strong>{row.nome}</strong>
                        <small>{row.partido}</small>
                      </span>
                    </span>
                  </td>
                  {POST_NETWORKS.map((n) => {
                    const p = row.posts[n.id as PostNet];
                    if (!p)
                      return (
                        <td
                          key={n.id}
                          style={{ textAlign: "center", color: "#555" }}
                        >
                          —
                        </td>
                      );
                    const hi = {
                      titulo: row.nome,
                      subtitulo: `${row.partido} · ${n.nome}`,
                      foto: row.foto,
                      cor: n.cor,
                      post: p,
                    };
                    return (
                      <td
                        key={n.id}
                        className="post-cell hoverable"
                        style={{ textAlign: "center" }}
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
                        <span
                          className="post-dot"
                          style={{ background: n.cor }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <HoverPost hover={hover} />
    </div>
  );
}
