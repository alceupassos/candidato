// Posts por candidato/figura e por rede (X / Instagram / YouTube / TikTok / Facebook).
// Reaproveita SOCIAL_FIGURES (links de perfil reais) + candidatos RJ.

import type { UltimoPost } from "./types";
import {
  SOCIAL_FIGURES,
  getUltimoPost,
  type Espectro,
  type Figure,
} from "./social-figures";

export type PostNet = "x" | "instagram" | "youtube" | "tiktok" | "facebook";
export const POST_NETWORKS: { id: PostNet; nome: string; cor: string }[] = [
  { id: "x", nome: "X", cor: "#e7e9ea" },
  { id: "instagram", nome: "Instagram", cor: "#e1306c" },
  { id: "youtube", nome: "YouTube", cor: "#ff0000" },
  { id: "tiktok", nome: "TikTok", cor: "#25f4ee" },
  { id: "facebook", nome: "Facebook", cor: "#1877f2" },
];

export type PostsRow = {
  id: string;
  nome: string;
  partido: string;
  foto: string;
  espectro: Espectro | "candidato";
  posts: Partial<Record<PostNet, UltimoPost>>;
};

const TXT: Record<string, string[]> = {
  x: [
    "Acompanhem o que defendo para o nosso estado. 👇",
    "Fato relevante de hoje na política. Comentem!",
  ],
  instagram: [
    "Bastidores da agenda de hoje. 📸",
    "Com o povo, onde a gente faz a diferença.",
  ],
  youtube: [
    "Novo vídeo no ar: minhas propostas em detalhe. ▶️",
    "Live de hoje: respondi as principais dúvidas.",
  ],
  tiktok: [
    "Resumo rápido do dia em 30s. 🎬",
    "Você sabia disso? Salva e compartilha!",
  ],
  facebook: [
    "Publicação completa com a agenda da semana.",
    "Obrigado pelo apoio de sempre, família!",
  ],
};

function postFor(f: Figure, net: PostNet, idx: number): UltimoPost {
  const base =
    (net === "tiktok" ? f.redes.instagram * 0.4 : (f.redes[net] ?? 200)) * 1000;
  const curtidas = Math.round(((base * f.engajamento) / 100) * 0.6);
  const arr = TXT[net];
  return {
    rede: POST_NETWORKS.find((n) => n.id === net)!.nome,
    texto: arr[(idx + net.length) % arr.length],
    data: `há ${1 + ((idx + net.length) % 11)}h`,
    curtidas,
    comentarios: Math.round(curtidas * 0.07),
    visualizacoes:
      net === "youtube" || net === "tiktok" ? Math.round(base) : undefined,
    link: getUltimoPost(f).link,
  };
}

const figureRows: PostsRow[] = SOCIAL_FIGURES.map((f, i) => ({
  id: f.id,
  nome: f.nome,
  partido: f.grupo,
  foto: f.avatarAsset,
  espectro: f.espectro,
  posts: {
    x: postFor(f, "x", i),
    instagram: postFor(f, "instagram", i),
    youtube: postFor(f, "youtube", i),
    tiktok: postFor(f, "tiktok", i),
    facebook: postFor(f, "facebook", i),
  },
}));

// Candidatos RJ (fotos locais) — posts demonstrativos linkando ao perfil.
const RJ = [
  {
    id: "renato_araujo",
    nome: "Renato Araújo",
    partido: "PL",
    foto: "/candidatos/renato_araujo_PL.png",
    link: "https://www.instagram.com/renatoaraujorj/",
  },
  {
    id: "laura_carneiro",
    nome: "Laura Carneiro",
    partido: "PSD",
    foto: "/candidatos/laura_carneiro_psd.png",
    link: "https://www.instagram.com/lauracarneiro/",
  },
  {
    id: "marcelo_crivella",
    nome: "Marcelo Crivella",
    partido: "Republicanos",
    foto: "/candidatos/marcelo_crivela_republicanos.png",
    link: "https://www.instagram.com/marcelocrivella/",
  },
  {
    id: "dr_luizinho",
    nome: "Dr. Luizinho",
    partido: "PSB",
    foto: "/candidatos/dr_luizinho_psb.png",
    link: "https://www.instagram.com/drluizinho/",
  },
  {
    id: "jorginho_brum",
    nome: "Jorginho Brum",
    partido: "MDB",
    foto: "/candidatos/jorginho_brum.png",
    link: "https://www.instagram.com/",
  },
  {
    id: "carlos_jordy",
    nome: "Carlos Jordy",
    partido: "PL",
    foto: "/candidatos/carlos_jordy_PL.png",
    link: "https://www.instagram.com/carlosjordy/",
  },
];

const rjRows: PostsRow[] = RJ.map((c, i) => {
  const mk = (net: PostNet): UltimoPost => ({
    rede: POST_NETWORKS.find((n) => n.id === net)!.nome,
    texto: TXT[net][(i + net.length) % TXT[net].length],
    data: `há ${1 + ((i + net.length) % 11)}h`,
    curtidas: 800 + ((i * 137 + net.length * 53) % 9000),
    comentarios: 40 + ((i * 17) % 300),
    link: c.link,
  });
  return {
    id: c.id,
    nome: c.nome,
    partido: c.partido,
    foto: c.foto,
    espectro: "candidato",
    posts: {
      x: mk("x"),
      instagram: mk("instagram"),
      youtube: mk("youtube"),
      tiktok: mk("tiktok"),
      facebook: mk("facebook"),
    },
  };
});

export const CANDIDATE_POSTS: PostsRow[] = [...rjRows, ...figureRows].slice(
  0,
  20,
);
