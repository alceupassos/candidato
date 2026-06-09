// Hierarquia de organizadores de eleitores + metas (lista / cadastro / engajado).
// Níveis: Líder de Igreja, Gerente Regional, Deputado Estadual → Cabo → Eleitor.
// Determinístico. Engajado = clicou no QR do grupo/comunidade e participa de
// pesquisas/mensageria.

import type { RegionId, Series } from "./types";
import { REGIONS, getRegion, regionEleitorado } from "./rj-regions";

/** Avatar (imagem gerada) por nível. */
export const LEVEL_AVATAR: Record<OrganizerLevel, string> = {
  "church-leader": "/ai/avatar-lider-igreja.png",
  "regional-manager": "/ai/avatar-gerente-regional.png",
  "state-deputy": "/ai/avatar-deputado.png",
  cabo: "/ai/avatar-cabo.png",
  eleitor: "/ai/avatar-eleitor.png",
};

export type OrganizerLevel =
  | "church-leader"
  | "regional-manager"
  | "state-deputy"
  | "cabo"
  | "eleitor";

export const LEVELS: {
  id: OrganizerLevel;
  nome: string;
  plural: string;
  cor: string;
  icon: string;
}[] = [
  {
    id: "church-leader",
    nome: "Líder de Igreja",
    plural: "Líderes de Igreja",
    cor: "#8b5cf6",
    icon: "church",
  },
  {
    id: "regional-manager",
    nome: "Gerente Regional",
    plural: "Gerentes Regionais",
    cor: "#3b82f6",
    icon: "briefcase",
  },
  {
    id: "state-deputy",
    nome: "Deputado Estadual",
    plural: "Deputados Estaduais",
    cor: "#f0c030",
    icon: "landmark",
  },
  {
    id: "cabo",
    nome: "Cabo Eleitoral",
    plural: "Cabos Eleitorais",
    cor: "#22c55e",
    icon: "users",
  },
  {
    id: "eleitor",
    nome: "Eleitor",
    plural: "Eleitores",
    cor: "#60a5fa",
    icon: "user",
  },
];

export type Metas = { lista: number; cadastro: number; engajado: number };

export type Organizer = {
  id: string;
  nome: string;
  nivel: OrganizerLevel;
  regiao: string;
  parentId?: string;
  cabos: number;
  eleitores: number;
  meta: Metas;
  atual: Metas;
  status: "ativo" | "atencao" | "inativo";
};

const NOMES_LIDER = [
  "Pr. Aldair Souza",
  "Bispa Marta Lima",
  "Pr. Edson Rocha",
  "Pra. Cláudia Reis",
  "Pr. Job Tavares",
  "Pr. Silas Moura",
];
const NOMES_GERENTE = [
  "Marcos Vieira",
  "Patrícia Nunes",
  "Rogério Alves",
  "Sandra Coelho",
  "Diego Martins",
  "Helena Borges",
];
const NOMES_DEPUTADO = [
  "Dep. Carla Freitas",
  "Dep. Válter Pinho",
  "Dep. Iara Mendes",
  "Dep. Bruno Sales",
  "Dep. Otávio Lara",
  "Dep. Núbia Castro",
];

// Quantos líderes de cada tipo por "escala" de região.
function leadersCount(escala: number, base: number): number {
  return Math.max(1, Math.round(base * escala));
}

function seed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
  return h / 1000;
}

function buildLeaders(
  regionId: string,
  escala: number,
  eleitoradoRegiao: number,
): Organizer[] {
  const out: Organizer[] = [];
  const tipos: {
    nivel: OrganizerLevel;
    nomes: string[];
    base: number;
    cabosBase: number;
  }[] = [
    { nivel: "church-leader", nomes: NOMES_LIDER, base: 4, cabosBase: 9 },
    { nivel: "regional-manager", nomes: NOMES_GERENTE, base: 3, cabosBase: 14 },
    { nivel: "state-deputy", nomes: NOMES_DEPUTADO, base: 2, cabosBase: 20 },
  ];

  for (const t of tipos) {
    const n = leadersCount(escala, t.base);
    for (let i = 0; i < n; i++) {
      const id = `${regionId}-${t.nivel}-${i}`;
      const s = seed(id);
      const cabos = Math.round(t.cabosBase * (0.7 + s * 0.7));
      const eleitores = cabos * Math.round(35 + s * 55);
      const metaLista = eleitores;
      const metaCadastro = Math.round(eleitores * 0.7);
      const metaEngajado = Math.round(eleitores * 0.45);
      // Progresso depende da região (cobertura) e de um seed.
      const prog = 0.45 + (escala - 0.69) * 0.5 + s * 0.25;
      const atualLista = Math.min(
        metaLista,
        Math.round(metaLista * Math.min(1, prog + 0.15)),
      );
      const atualCadastro = Math.min(
        metaCadastro,
        Math.round(metaCadastro * Math.min(1, prog)),
      );
      const atualEngajado = Math.min(
        metaEngajado,
        Math.round(metaEngajado * Math.min(1, prog - 0.1)),
      );
      const ratio = atualCadastro / metaCadastro;
      out.push({
        id,
        nome: t.nomes[i % t.nomes.length],
        nivel: t.nivel,
        regiao: regionId,
        cabos,
        eleitores,
        meta: {
          lista: metaLista,
          cadastro: metaCadastro,
          engajado: metaEngajado,
        },
        atual: {
          lista: atualLista,
          cadastro: atualCadastro,
          engajado: atualEngajado,
        },
        status: ratio >= 0.66 ? "ativo" : ratio >= 0.4 ? "atencao" : "inativo",
      });
    }
  }
  // referência ao eleitorado para escala futura
  void eleitoradoRegiao;
  return out;
}

/** Organizadores (líderes dos 3 tipos) de uma região ou de todo o RJ. */
export function getOrganizers(region: RegionId): Organizer[] {
  const r = getRegion(region);
  if (r) return buildLeaders(r.id, r.escala, regionEleitorado(r));
  return REGIONS.flatMap((reg) =>
    buildLeaders(reg.id, reg.escala, regionEleitorado(reg)),
  );
}

export type OrgAggregates = {
  porNivel: {
    nivel: OrganizerLevel;
    nome: string;
    plural: string;
    cor: string;
    total: number;
  }[];
  cabos: number;
  eleitores: number;
  metas: { lista: Metas; atual: Metas };
};

/** Agregados por nível + metas consolidadas. */
export function getOrgAggregates(region: RegionId): OrgAggregates {
  const leaders = getOrganizers(region);
  const byLevel = (nivel: OrganizerLevel) =>
    leaders.filter((l) => l.nivel === nivel);

  const cabos = leaders.reduce((s, l) => s + l.cabos, 0);
  const eleitores = leaders.reduce((s, l) => s + l.eleitores, 0);

  const sum = (sel: (l: Organizer) => number) =>
    leaders.reduce((s, l) => s + sel(l), 0);
  const metas = {
    lista: {
      lista: sum((l) => l.meta.lista),
      cadastro: sum((l) => l.meta.cadastro),
      engajado: sum((l) => l.meta.engajado),
    },
    atual: {
      lista: sum((l) => l.atual.lista),
      cadastro: sum((l) => l.atual.cadastro),
      engajado: sum((l) => l.atual.engajado),
    },
  };

  const porNivel = LEVELS.slice(0, 3).map((lv) => ({
    nivel: lv.id,
    nome: lv.nome,
    plural: lv.plural,
    cor: lv.cor,
    total: byLevel(lv.id).length,
  }));
  porNivel.push({
    nivel: "cabo",
    nome: "Cabo Eleitoral",
    plural: "Cabos Eleitorais",
    cor: "#22c55e",
    total: cabos,
  });
  porNivel.push({
    nivel: "eleitor",
    nome: "Eleitor",
    plural: "Eleitores",
    cor: "#60a5fa",
    total: eleitores,
  });

  return { porNivel, cabos, eleitores, metas };
}

type TreeNode = {
  name: string;
  value?: number;
  itemStyle?: { color: string };
  children?: TreeNode[];
};

/** Organograma para ECharts (tree): Candidato → 3 tipos → líderes → cabos/eleitores. */
export function getOrgTree(region: RegionId): TreeNode {
  const leaders = getOrganizers(region);
  const tipos = LEVELS.slice(0, 3);
  return {
    name: "Renato Araújo",
    itemStyle: { color: "#f0c030" },
    children: tipos.map((t) => ({
      name: t.plural,
      itemStyle: { color: t.cor },
      children: leaders
        .filter((l) => l.nivel === t.id)
        .map((l) => ({
          name: l.nome,
          itemStyle: { color: t.cor },
          children: [
            {
              name: `${l.cabos} cabos`,
              value: l.cabos,
              itemStyle: { color: "#22c55e" },
            },
            {
              name: `${l.eleitores.toLocaleString("pt-BR")} eleitores`,
              value: l.eleitores,
              itemStyle: { color: "#60a5fa" },
            },
          ],
        })),
    })),
  };
}

// ── Painel em tempo real ──────────────────────────────────────────────

export type TierSummary = {
  nivel: OrganizerLevel;
  nome: string;
  plural: string;
  cor: string;
  avatar: string;
  lideres: number;
  cabos: number;
  eleitores: number;
  cadastroPct: number;
  engajadoPct: number;
  contatosHoje: number;
  conversao: number;
  topPerformer: string;
};

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

/** Resumo por tier (3 níveis de liderança) para os cards. */
export function getTierSummary(region: RegionId): TierSummary[] {
  const leaders = getOrganizers(region);
  return LEVELS.slice(0, 3).map((lv) => {
    const grp = leaders.filter((l) => l.nivel === lv.id);
    const cabos = grp.reduce((s, l) => s + l.cabos, 0);
    const eleitores = grp.reduce((s, l) => s + l.eleitores, 0);
    const metaCad = grp.reduce((s, l) => s + l.meta.cadastro, 0);
    const atualCad = grp.reduce((s, l) => s + l.atual.cadastro, 0);
    const metaEng = grp.reduce((s, l) => s + l.meta.engajado, 0);
    const atualEng = grp.reduce((s, l) => s + l.atual.engajado, 0);
    const top = [...grp].sort(
      (a, b) => b.atual.cadastro / b.meta.cadastro - a.atual.cadastro / a.meta.cadastro,
    )[0];
    return {
      nivel: lv.id,
      nome: lv.nome,
      plural: lv.plural,
      cor: lv.cor,
      avatar: LEVEL_AVATAR[lv.id],
      lideres: grp.length,
      cabos,
      eleitores,
      cadastroPct: pct(atualCad, metaCad),
      engajadoPct: pct(atualEng, metaEng),
      contatosHoje: Math.round(cabos * (3 + seed(lv.id) * 4)),
      conversao: 38 + Math.round(seed(lv.id + region) * 22),
      topPerformer: top?.nome ?? "—",
    };
  });
}

const ACOES = [
  "cadastrou um novo eleitor",
  "enviou mensagem para o grupo",
  "registrou engajamento via QR",
  "atualizou a lista de contatos",
  "respondeu uma pesquisa",
  "agendou visita de campo",
  "confirmou presença em comício",
  "bateu a meta semanal",
];

export type FeedItem = { nome: string; acao: string; cor: string; minutosAtras: number };

/** Feed de atividade (determinístico). Em render, a coluna "tempo" é estática. */
export function getActivityFeed(region: RegionId): FeedItem[] {
  const leaders = getOrganizers(region);
  const cor = (n: OrganizerLevel) => LEVELS.find((l) => l.id === n)?.cor ?? "#8a8aaa";
  const items: FeedItem[] = [];
  leaders.slice(0, 12).forEach((l, i) => {
    const s = seed(l.id + i);
    items.push({
      nome: l.nome,
      acao: ACOES[Math.floor(s * ACOES.length) % ACOES.length],
      cor: cor(l.nivel),
      minutosAtras: 1 + Math.floor(s * 90),
    });
  });
  return items.sort((a, b) => a.minutosAtras - b.minutosAtras);
}

/** Cadastro (%) por tier — barra. */
export function getTierPerformanceSeries(region: RegionId): Series {
  const tiers = getTierSummary(region);
  return {
    labels: tiers.map((t) => t.nome),
    datasets: [
      {
        label: "Cadastro (%)",
        color: "#22c55e",
        data: tiers.map((t) => t.cadastroPct),
        palette: tiers.map((t) => t.cor),
      },
    ],
  };
}

/** Evolução de cadastros (8 semanas) — linha viva. */
export function getCadastroEvolution(region: RegionId): Series {
  const total = getOrgAggregates(region).metas.atual.cadastro;
  const labels = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const inicio = Math.round(total * 0.42);
  const passo = (total - inicio) / (labels.length - 1);
  return {
    labels,
    datasets: [
      {
        label: "Cadastros acumulados",
        color: "#22c55e",
        data: labels.map((_, i) => Math.round(inicio + passo * i)),
      },
    ],
  };
}
