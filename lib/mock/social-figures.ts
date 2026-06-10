// Monitoramento de figuras públicas e colunistas nas redes (X/IG/YT/FB).
// DADOS DEMONSTRATIVOS (mock) para o produto de inteligência de campanha.
// Avatares são estilizados (iniciais + cor), nunca fotos reais.

import type { UltimoPost } from "./types";

export type Network = "x" | "instagram" | "youtube" | "facebook";
export type Espectro = "direita" | "esquerda" | "centro" | "colunista";

export const NETWORKS: {
  id: Network;
  nome: string;
  cor: string;
  icon: string;
}[] = [
  { id: "x", nome: "X.com", cor: "#e7e9ea", icon: "twitter" },
  { id: "instagram", nome: "Instagram", cor: "#e1306c", icon: "instagram" },
  { id: "youtube", nome: "YouTube", cor: "#ff0000", icon: "youtube" },
  { id: "facebook", nome: "Facebook", cor: "#1877f2", icon: "facebook" },
];

export const ESPECTROS: { id: Espectro; nome: string; cor: string }[] = [
  { id: "direita", nome: "Direita", cor: "#3b82f6" },
  { id: "esquerda", nome: "Esquerda", cor: "#ef4444" },
  { id: "centro", nome: "Centro", cor: "#f0c030" },
  { id: "colunista", nome: "Colunistas", cor: "#8b5cf6" },
];

export type Figure = {
  id: string;
  nome: string;
  avatarAsset: string;
  grupo: string;
  espectro: Espectro;
  /** Seguidores por rede, em milhares. */
  redes: Record<Network, number>;
  engajamento: number; // %
  sentimento: number; // % positivo
  posts7d: number;
  crescimento7d: number; // %
};

// Números fictícios, plausíveis. Em milhares de seguidores.
export const SOCIAL_FIGURES: Figure[] = [
  {
    id: "lula",
    nome: "Lula",
    avatarAsset: "/ai/fig-lula.png",
    grupo: "PT",
    espectro: "esquerda",
    redes: { x: 7600, instagram: 9200, youtube: 1200, facebook: 5400 },
    engajamento: 3.1,
    sentimento: 49,
    posts7d: 38,
    crescimento7d: 0.6,
  },
  {
    id: "flavio-bolsonaro",
    nome: "Flávio Bolsonaro",
    avatarAsset: "/ai/fig-flavio-bolsonaro.png",
    grupo: "PL",
    espectro: "direita",
    redes: { x: 3100, instagram: 4200, youtube: 380, facebook: 2600 },
    engajamento: 4.2,
    sentimento: 53,
    posts7d: 44,
    crescimento7d: 0.9,
  },
  {
    id: "nikolas-ferreira",
    nome: "Nikolas Ferreira",
    avatarAsset: "/ai/fig-nikolas-ferreira.png",
    grupo: "PL",
    espectro: "direita",
    redes: { x: 4800, instagram: 11800, youtube: 3400, facebook: 2100 },
    engajamento: 8.4,
    sentimento: 57,
    posts7d: 52,
    crescimento7d: 1.8,
  },
  {
    id: "gustavo-gayer",
    nome: "Gustavo Gayer",
    avatarAsset: "/ai/fig-gustavo-gayer.png",
    grupo: "PL",
    espectro: "direita",
    redes: { x: 2200, instagram: 3100, youtube: 1900, facebook: 980 },
    engajamento: 6.1,
    sentimento: 51,
    posts7d: 47,
    crescimento7d: 1.3,
  },
  {
    id: "renan-santos",
    nome: "Renan Santos",
    avatarAsset: "/ai/fig-renan-santos.png",
    grupo: "MBL",
    espectro: "direita",
    redes: { x: 1400, instagram: 1100, youtube: 720, facebook: 540 },
    engajamento: 5.0,
    sentimento: 48,
    posts7d: 33,
    crescimento7d: 1.0,
  },
  {
    id: "carla-zambelli",
    nome: "Carla Zambelli",
    avatarAsset: "/ai/fig-carla-zambelli.png",
    grupo: "PL",
    espectro: "direita",
    redes: { x: 2600, instagram: 2900, youtube: 410, facebook: 1500 },
    engajamento: 4.6,
    sentimento: 44,
    posts7d: 40,
    crescimento7d: 0.4,
  },
  {
    id: "eduardo-bolsonaro",
    nome: "Eduardo Bolsonaro",
    avatarAsset: "/ai/fig-eduardo-bolsonaro.png",
    grupo: "PL",
    espectro: "direita",
    redes: { x: 3300, instagram: 3000, youtube: 300, facebook: 2200 },
    engajamento: 4.0,
    sentimento: 50,
    posts7d: 36,
    crescimento7d: 0.7,
  },
  {
    id: "boulos",
    nome: "Guilherme Boulos",
    avatarAsset: "/ai/fig-guilherme-boulos.png",
    grupo: "PSOL",
    espectro: "esquerda",
    redes: { x: 2100, instagram: 2400, youtube: 240, facebook: 980 },
    engajamento: 4.4,
    sentimento: 47,
    posts7d: 41,
    crescimento7d: 0.8,
  },
  {
    id: "erika-hilton",
    nome: "Erika Hilton",
    avatarAsset: "/ai/fig-erika-hilton.png",
    grupo: "PSOL",
    espectro: "esquerda",
    redes: { x: 1900, instagram: 2700, youtube: 180, facebook: 620 },
    engajamento: 5.3,
    sentimento: 46,
    posts7d: 35,
    crescimento7d: 1.1,
  },
  {
    id: "lindbergh",
    nome: "Lindbergh Farias",
    avatarAsset: "/ai/fig-lindbergh-farias.png",
    grupo: "PT",
    espectro: "esquerda",
    redes: { x: 1600, instagram: 980, youtube: 120, facebook: 540 },
    engajamento: 3.6,
    sentimento: 43,
    posts7d: 39,
    crescimento7d: 0.5,
  },
  {
    id: "gleisi",
    nome: "Gleisi Hoffmann",
    avatarAsset: "/ai/fig-gleisi-hoffmann.png",
    grupo: "PT",
    espectro: "esquerda",
    redes: { x: 2400, instagram: 1500, youtube: 140, facebook: 1100 },
    engajamento: 3.2,
    sentimento: 42,
    posts7d: 37,
    crescimento7d: 0.3,
  },
  {
    id: "tabata",
    nome: "Tábata Amaral",
    avatarAsset: "/ai/fig-tabata-amaral.png",
    grupo: "PSB",
    espectro: "centro",
    redes: { x: 1300, instagram: 1900, youtube: 210, facebook: 480 },
    engajamento: 4.1,
    sentimento: 55,
    posts7d: 28,
    crescimento7d: 0.9,
  },
  {
    id: "reinaldo",
    nome: "Reinaldo Azevedo",
    avatarAsset: "/ai/fig-reinaldo-azevedo.png",
    grupo: "Colunista",
    espectro: "colunista",
    redes: { x: 2300, instagram: 760, youtube: 320, facebook: 410 },
    engajamento: 3.0,
    sentimento: 45,
    posts7d: 58,
    crescimento7d: 0.4,
  },
  {
    id: "augusto-nunes",
    nome: "Augusto Nunes",
    avatarAsset: "/ai/fig-augusto-nunes.png",
    grupo: "Colunista",
    espectro: "colunista",
    redes: { x: 980, instagram: 220, youtube: 140, facebook: 260 },
    engajamento: 2.4,
    sentimento: 47,
    posts7d: 31,
    crescimento7d: 0.2,
  },
];

export function espectroColor(e: Espectro): string {
  return ESPECTROS.find((x) => x.id === e)?.cor ?? "#8a8aaa";
}

/** Ranking por rede (seguidores desc). */
export function getRankingByNetwork(
  network: Network,
  espectro?: Espectro,
): { figure: Figure; followers: number }[] {
  return SOCIAL_FIGURES.filter((f) => !espectro || f.espectro === espectro)
    .map((f) => ({ figure: f, followers: f.redes[network] }))
    .sort((a, b) => b.followers - a.followers);
}

/** Total de seguidores (todas as redes) por figura. */
export function totalFollowers(f: Figure): number {
  return f.redes.x + f.redes.instagram + f.redes.youtube + f.redes.facebook;
}

/** Divisão de audiência por espectro (para donut). */
export function getSpectrumSplit(): {
  labels: string[];
  data: number[];
  palette: string[];
} {
  const labels: string[] = [];
  const data: number[] = [];
  const palette: string[] = [];
  for (const e of ESPECTROS) {
    const total = SOCIAL_FIGURES.filter((f) => f.espectro === e.id).reduce(
      (s, f) => s + totalFollowers(f),
      0,
    );
    labels.push(e.nome);
    data.push(Math.round(total / 1000)); // milhões
    palette.push(e.cor);
  }
  return { labels, data, palette };
}

const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

/** Buzz/menções políticas por estado (mock) para o mapa do Brasil. */
export function getMentionsByState(): { sigla: string; value: number }[] {
  return UFS.map((uf) => {
    let h = 0;
    for (let i = 0; i < uf.length; i++) h = (h * 37 + uf.charCodeAt(i)) % 100;
    const big = uf === "SP" || uf === "RJ" || uf === "MG" || uf === "DF";
    return { sigla: uf, value: Math.round((big ? 70 : 30) + (h / 100) * 28) };
  });
}

// ── Último post (link real do perfil; texto plausível) ──────────────
const PERFIL: Record<string, string> = {
  lula: "https://x.com/LulaOficial",
  "flavio-bolsonaro": "https://x.com/FlavioBolsonaro",
  "nikolas-ferreira": "https://www.instagram.com/nikolasferreiradm/",
  "gustavo-gayer": "https://www.instagram.com/gustavogayer/",
  "renan-santos": "https://x.com/renansantosmbl",
  "carla-zambelli": "https://x.com/CarlaZambelli38",
  "eduardo-bolsonaro": "https://x.com/BolsonaroSP",
  boulos: "https://www.instagram.com/guilhermeboulos.oficial/",
  "erika-hilton": "https://www.instagram.com/erikahilton/",
  lindbergh: "https://x.com/lindberghfarias",
  gleisi: "https://x.com/gleisi",
  tabata: "https://www.instagram.com/tabataamaralsp/",
  reinaldo: "https://x.com/reinaldoazevedo",
  "augusto-nunes": "https://x.com/AugustoNunes",
};

const POST_TXT: Record<Espectro, string[]> = {
  direita: [
    "Liberdade, família e segurança. Vamos pra cima! 🇧🇷",
    "O povo brasileiro não aceita mais retrocesso. Conto com vocês!",
    "Trabalho, fé e patriotismo. Nosso compromisso é com você.",
  ],
  esquerda: [
    "Pelo povo trabalhador e por mais direitos. Juntos somos mais fortes! ✊",
    "Investir em saúde e educação é cuidar de quem mais precisa.",
    "Democracia, justiça social e oportunidade para todos.",
  ],
  centro: [
    "Diálogo e propostas concretas para o Brasil avançar.",
    "Menos polarização, mais soluções. É disso que o país precisa.",
    "Educação de qualidade é o caminho para o futuro.",
  ],
  colunista: [
    "Minha análise sobre o cenário político desta semana.",
    "Os bastidores que explicam o jogo eleitoral de 2026.",
    "O que os números das pesquisas realmente dizem.",
  ],
};

export function getUltimoPost(f: Figure): UltimoPost {
  const order: Network[] = ["instagram", "x", "youtube", "facebook"];
  const topNet = order.sort((a, b) => f.redes[b] - f.redes[a])[0];
  const redeNome = NETWORKS.find((n) => n.id === topNet)?.nome ?? "Rede";
  const sN = f.id.length + f.nome.length;
  const txts = POST_TXT[f.espectro];
  const base = totalFollowers(f) * 1000;
  const curtidas = Math.round((base * f.engajamento) / 100 * 0.6);
  return {
    rede: redeNome,
    texto: txts[sN % txts.length],
    data: `há ${1 + (sN % 9)}h`,
    curtidas,
    comentarios: Math.round(curtidas * 0.08),
    compartilhamentos: Math.round(curtidas * 0.05),
    link: PERFIL[f.id] ?? `https://www.google.com/search?q=${encodeURIComponent(f.nome)}`,
  };
}

// Resumo explicativo da figura para o hover (o que é + como está).
export type FiguraResumo = {
  descricao: string;
  pos: number; // engajamento positivo %
  neg: number; // engajamento negativo %
  tendencia: string;
};

export function getFiguraResumo(f: Figure): FiguraResumo {
  const pos = f.sentimento;
  const neg = Math.max(0, 100 - f.sentimento - 8);
  const espectroNome =
    f.espectro === "direita"
      ? "campo da direita"
      : f.espectro === "esquerda"
        ? "campo da esquerda"
        : f.espectro === "centro"
          ? "centro"
          : "colunismo/imprensa";
  const forca =
    f.engajamento >= 6
      ? "engajamento muito alto"
      : f.engajamento >= 4
        ? "bom engajamento"
        : "engajamento moderado";
  const tend =
    f.crescimento7d >= 1.2
      ? "em forte ascensão"
      : f.crescimento7d >= 0.6
        ? "crescendo"
        : "estável";
  return {
    descricao: `${f.nome} (${f.grupo}) — ${espectroNome}. ${forca}, ${tend} nos últimos 7 dias.`,
    pos,
    neg,
    tendencia: tend,
  };
}
