// Influenciadores locais (Angra/Costa Verde) — handles e dados reais.
// DADOS DEMONSTRATIVOS de alcance; @handles e links são reais.

import type { UltimoPost } from "./types";

export type Influencer = {
  handle: string;
  /** Seguidores em milhares. */
  seguidores: number;
  engajamento: number; // %
  regiao: string;
  nicho: string;
  link: string;
};

export const INFLUENCERS: Influencer[] = [
  {
    handle: "@viniatlantida",
    seguidores: 560.3,
    engajamento: 1.75,
    regiao: "Angra / Ilha Grande",
    nicho: "oceano, natureza, preservação",
    link: "https://www.instagram.com/viniatlantida/",
  },
  {
    handle: "@duarte_greg",
    seguidores: 24.4,
    engajamento: 5.23,
    regiao: "Angra / Japuíba",
    nicho: "política, segurança, denúncias",
    link: "https://www.instagram.com/duarte_greg/",
  },
  {
    handle: "@anayadofrade",
    seguidores: 24.2,
    engajamento: 1.32,
    regiao: "Frade",
    nicho: "humor local, transporte, cotidiano",
    link: "https://www.instagram.com/anayadofrade/",
  },
  {
    handle: "@jotacutzz_",
    seguidores: 17.6,
    engajamento: 4.21,
    regiao: "Angra / público jovem",
    nicho: "barbearia, estética masculina",
    link: "https://www.instagram.com/jotacutzz_/",
  },
  {
    handle: "@oii_sou_a_fran",
    seguidores: 13.0,
    engajamento: 1.9,
    regiao: "Angra",
    nicho: "moda, humor de casal, cristão",
    link: "https://www.instagram.com/oii_sou_a_fran/",
  },
  {
    handle: "@marcelogermanota",
    seguidores: 13.6,
    engajamento: 1.11,
    regiao: "Angra / Centro",
    nicho: "beleza, sobrancelhas, negócios",
    link: "https://www.instagram.com/marcelogermanota/",
  },
  {
    handle: "@rafaovp",
    seguidores: 10.5,
    engajamento: 2.9,
    regiao: "Angra / gamer",
    nicho: "streaming, entretenimento",
    link: "https://www.instagram.com/rafaovp/",
  },
  {
    handle: "@alberto.doblerneto",
    seguidores: 9.8,
    engajamento: 4.27,
    regiao: "Angra",
    nicho: "segurança pública, polícia, família",
    link: "https://www.instagram.com/alberto.doblerneto/",
  },
  {
    handle: "@titi_brasil",
    seguidores: 9.1,
    engajamento: 1.5,
    regiao: "Angra",
    nicho: "política municipal, câmara",
    link: "https://www.instagram.com/titi_brasil/",
  },
  {
    handle: "@stee__nascimento_",
    seguidores: 8.3,
    engajamento: 1.07,
    regiao: "Angra",
    nicho: "loja, lifestyle, comércio local",
    link: "https://www.instagram.com/stee__nascimento_/",
  },
  {
    handle: "@dududoturismo",
    seguidores: 8.0,
    engajamento: 1.75,
    regiao: "Angra / turismo",
    nicho: "mandato, turismo, inclusão",
    link: "https://www.instagram.com/dududoturismo/",
  },
];

export const ATIVACAO: {
  territorio: string;
  handle: string;
  risco: "baixo" | "médio" | "alto";
}[] = [
  { territorio: "Frade", handle: "@anayadofrade", risco: "baixo" },
  { territorio: "Japuíba", handle: "@duarte_greg", risco: "médio" },
  { territorio: "Ilha Grande", handle: "@viniatlantida", risco: "baixo" },
  { territorio: "Centro", handle: "@marcelogermanota", risco: "médio" },
  { territorio: "Angra (geral)", handle: "@titi_brasil", risco: "médio" },
  { territorio: "Turismo", handle: "@dududoturismo", risco: "baixo" },
];

const POSTS = [
  "Bom dia, Angra! Hoje tem novidade boa pra nossa região. 🌊",
  "Vamos cobrar mais atenção para o nosso bairro. Compartilha!",
  "Apoiando quem faz pela Costa Verde. Conta comigo!",
  "Conteúdo novo no ar — passa lá e deixa seu comentário!",
];

export function getInfluencerPost(inf: Influencer): UltimoPost {
  const base = inf.seguidores * 1000;
  const curtidas = Math.round(((base * inf.engajamento) / 100) * 0.7);
  const s = inf.handle.length;
  return {
    rede: "Instagram",
    texto: POSTS[s % POSTS.length],
    data: `há ${1 + (s % 12)}h`,
    curtidas,
    comentarios: Math.round(curtidas * 0.06),
    visualizacoes: Math.round(base * 0.4),
    link: inf.link,
  };
}
