// Pesquisas eleitorais mockadas para os quatro cargos (NOC).
// Números fictícios, porém plausíveis (RJ, outubro/2026). Determinístico.

import type { RaceCandidate, RaceId, RegionId, Series } from "./types";
import { getRegion } from "./rj-regions";
import { COLORS } from "./campaign-metrics";

export const RACES: { id: RaceId; nome: string; escopo: string }[] = [
  { id: "presidente", nome: "Presidente", escopo: "Nacional" },
  { id: "senador", nome: "Senador", escopo: "Rio de Janeiro" },
  { id: "dep-federal", nome: "Dep. Federal", escopo: "Rio de Janeiro" },
  { id: "dep-estadual", nome: "Dep. Estadual", escopo: "Rio de Janeiro" },
];

const BASE: Record<RaceId, RaceCandidate[]> = {
  presidente: [
    {
      nome: "Tarcísio de Freitas",
      partido: "Republicanos",
      intencao: 39,
      rejeicao: 41,
      cor: COLORS.azul,
    },
    {
      nome: "Lula",
      partido: "PT",
      intencao: 33,
      rejeicao: 44,
      cor: COLORS.vermelho,
    },
    {
      nome: "Simone Tebet",
      partido: "MDB",
      intencao: 11,
      rejeicao: 28,
      cor: COLORS.amarelo,
    },
    {
      nome: "Ratinho Jr.",
      partido: "PSD",
      intencao: 8,
      rejeicao: 31,
      cor: COLORS.verde,
    },
    {
      nome: "Brancos / Nulos",
      partido: "—",
      intencao: 9,
      rejeicao: 0,
      cor: COLORS.cinza,
    },
  ],
  senador: [
    {
      nome: "Flávio Bolsonaro",
      partido: "PL",
      intencao: 31,
      rejeicao: 26,
      cor: COLORS.azul,
    },
    {
      nome: "Eduardo Paes",
      partido: "PSD",
      intencao: 24,
      rejeicao: 30,
      cor: COLORS.verde,
    },
    {
      nome: "Lindbergh Farias",
      partido: "PT",
      intencao: 19,
      rejeicao: 33,
      cor: COLORS.vermelho,
    },
    {
      nome: "Clarissa Garotinho",
      partido: "PP",
      intencao: 12,
      rejeicao: 22,
      cor: COLORS.amarelo,
    },
    {
      nome: "Indecisos",
      partido: "—",
      intencao: 14,
      rejeicao: 0,
      cor: COLORS.cinza,
    },
  ],
  "dep-federal": [
    {
      nome: "Laura Carneiro",
      partido: "PSD",
      intencao: 10.5,
      rejeicao: 18,
      cor: COLORS.verde,
    },
    {
      nome: "Marcelo Crivella",
      partido: "Republicanos",
      intencao: 9.8,
      rejeicao: 35,
      cor: COLORS.amarelo,
    },
    {
      nome: "Dr. Luizinho",
      partido: "PSB",
      intencao: 9.1,
      rejeicao: 16,
      cor: COLORS.azulClaro,
    },
    {
      nome: "Renato Araújo",
      partido: "PL",
      intencao: 8.7,
      rejeicao: 14,
      cor: COLORS.verde,
    },
    {
      nome: "Jorginho Brum",
      partido: "MDB",
      intencao: 7.4,
      rejeicao: 19,
      cor: COLORS.roxo,
    },
    {
      nome: "Sóstenes Cavalcante",
      partido: "PL",
      intencao: 7.0,
      rejeicao: 22,
      cor: COLORS.verde,
    },
    {
      nome: "Carlos Jordy",
      partido: "PL",
      intencao: 6.5,
      rejeicao: 24,
      cor: COLORS.verde,
    },
    {
      nome: "Hugo Leal",
      partido: "PSD",
      intencao: 6.1,
      rejeicao: 15,
      cor: COLORS.azul,
    },
    {
      nome: "Chico Alencar",
      partido: "PSOL",
      intencao: 5.7,
      rejeicao: 28,
      cor: COLORS.vermelho,
    },
    {
      nome: "Áureo Ribeiro",
      partido: "Solidariedade",
      intencao: 5.3,
      rejeicao: 17,
      cor: COLORS.amarelo,
    },
    {
      nome: "Chris Tonietto",
      partido: "PL",
      intencao: 4.9,
      rejeicao: 26,
      cor: COLORS.verde,
    },
    {
      nome: "Delegado Ramagem",
      partido: "PL",
      intencao: 4.6,
      rejeicao: 23,
      cor: COLORS.verde,
    },
    {
      nome: "Pedro Paulo",
      partido: "PSD",
      intencao: 4.2,
      rejeicao: 16,
      cor: COLORS.azul,
    },
    {
      nome: "Benedita da Silva",
      partido: "PT",
      intencao: 3.8,
      rejeicao: 27,
      cor: COLORS.vermelho,
    },
    {
      nome: "Alessandro Molon",
      partido: "PSB",
      intencao: 3.4,
      rejeicao: 20,
      cor: COLORS.azulClaro,
    },
  ],
  "dep-estadual": [
    {
      nome: "Rodrigo Amorim",
      partido: "PL",
      intencao: 6.8,
      rejeicao: 12,
      cor: COLORS.verde,
    },
    {
      nome: "Tarcísio Motta",
      partido: "PSOL",
      intencao: 6.1,
      rejeicao: 15,
      cor: COLORS.azul,
    },
    {
      nome: "Dr. Serginho",
      partido: "PL",
      intencao: 5.4,
      rejeicao: 11,
      cor: COLORS.amarelo,
    },
    {
      nome: "Renata Souza",
      partido: "PSOL",
      intencao: 4.9,
      rejeicao: 21,
      cor: COLORS.vermelho,
    },
    {
      nome: "Indecisos",
      partido: "—",
      intencao: 9,
      rejeicao: 0,
      cor: COLORS.cinza,
    },
  ],
};

/** Ranking de um cargo, ajustado pela região (oscila levemente em torno da base). */
export function getRaceRanking(
  race: RaceId,
  region: RegionId,
): RaceCandidate[] {
  const r = getRegion(region);
  const factor = r ? 0.85 + (r.escala - 0.69) * 0.6 : 1;
  return BASE[race]
    .map((c) => {
      // "Renato Araújo" e candidatos do PL na Costa Verde sobem na base.
      const boost = c.partido === "PL" && r?.id === "costa-verde" ? 1.5 : 1;
      const intencao =
        c.nome === "Indecisos" || c.nome === "Outros / Brancos"
          ? c.intencao
          : Number((c.intencao * factor * boost).toFixed(1));
      return { ...c, intencao };
    })
    .sort((a, b) => b.intencao - a.intencao);
}

/** Evolução temporal das 3 maiores candidaturas do cargo (6 ondas de pesquisa). */
export function getRaceTimeline(race: RaceId, region: RegionId): Series {
  const ranking = getRaceRanking(race, region).filter(
    (c) => c.nome !== "Indecisos" && c.nome !== "Outros / Brancos",
  );
  const top = ranking.slice(0, 3);
  const labels = ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];
  return {
    labels,
    datasets: top.map((c) => {
      const fim = c.intencao;
      const inicio = Number((fim * 0.78).toFixed(1));
      const passo = (fim - inicio) / (labels.length - 1);
      return {
        label: c.nome,
        color: c.cor,
        data: labels.map((_, i) => Number((inicio + passo * i).toFixed(1))),
      };
    }),
  };
}

/** Comparativo entre institutos para o líder do cargo. */
export function getRaceInstitutos(race: RaceId, region: RegionId): Series {
  const lider = getRaceRanking(race, region)[0];
  const base = lider.intencao;
  const variacoes = [0.96, 1.05, 0.92, 1.02, 1.08];
  return {
    labels: ["Datafolha", "Quaest", "IBOPE", "Atlas", "Paraná"],
    datasets: [
      {
        label: `${lider.nome} (%)`,
        data: variacoes.map((v) => Number((base * v).toFixed(1))),
        color: lider.cor,
        palette: [
          COLORS.verde,
          COLORS.azul,
          COLORS.amarelo,
          COLORS.roxo,
          COLORS.azulClaro,
        ],
      },
    ],
  };
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

/** Intenção do líder da corrida presidencial por estado (mock determinístico). */
export function getPresidentialByState(): { sigla: string; value: number }[] {
  const lider = BASE.presidente[0];
  return UFS.map((uf) => {
    let h = 0;
    for (let i = 0; i < uf.length; i++) h = (h * 31 + uf.charCodeAt(i)) % 100;
    const value = Math.round(lider.intencao + (h / 100) * 24 - 10); // ~29–53
    return { sigla: uf, value: Math.max(18, Math.min(58, value)) };
  });
}

export type Recorte = "idade" | "renda" | "genero" | "escolaridade";

const SEGMENTOS: Record<Recorte, string[]> = {
  idade: ["16–24", "25–34", "35–44", "45–59", "60+"],
  renda: ["até 2 SM", "2–5 SM", "5–10 SM", "10+ SM"],
  genero: ["Mulheres", "Homens"],
  escolaridade: ["Fundamental", "Médio", "Superior"],
};

export const RECORTES: { id: Recorte; nome: string }[] = [
  { id: "idade", nome: "Idade" },
  { id: "renda", nome: "Renda" },
  { id: "genero", nome: "Gênero" },
  { id: "escolaridade", nome: "Escolaridade" },
];

/** Recorte demográfico da intenção do líder do cargo na região. */
export function getDemographicCut(
  race: RaceId,
  region: RegionId,
  recorte: Recorte,
): Series {
  const lider = getRaceRanking(race, region)[0];
  const base = lider.intencao;
  const segs = SEGMENTOS[recorte];
  return {
    labels: segs,
    datasets: [
      {
        label: `${lider.nome} (%)`,
        color: lider.cor,
        data: segs.map((seg, i) => {
          const s = ((seg.length * 7 + i * 13) % 100) / 100; // 0–1 determinístico
          return Number((base * (0.78 + s * 0.5)).toFixed(1));
        }),
        palette: segs.map(
          (_, i) =>
            ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#60a5fa"][i % 5],
        ),
      },
    ],
  };
}

/** Intenção × rejeição do cargo (para gráfico de dispersão/colunas). */
export function getRaceIntencaoRejeicao(
  race: RaceId,
  region: RegionId,
): Series {
  const ranking = getRaceRanking(race, region).filter(
    (c) => c.nome !== "Indecisos" && c.nome !== "Outros / Brancos",
  );
  return {
    labels: ranking.map((c) => c.nome.split(" ")[0]),
    datasets: [
      {
        label: "Intenção",
        color: COLORS.verde,
        data: ranking.map((c) => c.intencao),
      },
      {
        label: "Rejeição",
        color: COLORS.vermelho,
        data: ranking.map((c) => c.rejeicao),
      },
    ],
  };
}
