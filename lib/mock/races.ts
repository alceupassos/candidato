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
      nome: "Lula",
      partido: "PT",
      intencao: 40,
      rejeicao: 43,
      cor: COLORS.azul,
    },
    {
      nome: "Flávio Bolsonaro",
      partido: "PL",
      intencao: 28,
      rejeicao: 38,
      cor: COLORS.azulClaro,
    },
    {
      nome: "Romeu Zema",
      partido: "Novo",
      intencao: 10,
      rejeicao: 24,
      cor: COLORS.amarelo,
    },
    {
      nome: "Ronaldo Caiado",
      partido: "União",
      intencao: 8,
      rejeicao: 26,
      cor: COLORS.verde,
    },
    {
      nome: "Renan Santos",
      partido: "MBL",
      intencao: 6,
      rejeicao: 30,
      cor: COLORS.roxo,
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
      intencao: 9.5,
      rejeicao: 19,
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
    {
      nome: "Daniel Silveira",
      partido: "PL",
      intencao: 3.1,
      rejeicao: 29,
      cor: COLORS.verde,
    },
    {
      nome: "Pastor Henrique Vieira",
      partido: "PSOL",
      intencao: 2.8,
      rejeicao: 24,
      cor: COLORS.vermelho,
    },
    {
      nome: "Gutemberg Reis",
      partido: "MDB",
      intencao: 2.5,
      rejeicao: 18,
      cor: COLORS.roxo,
    },
    {
      nome: "Marcelo Queiroz",
      partido: "PP",
      intencao: 2.2,
      rejeicao: 14,
      cor: COLORS.azul,
    },
    {
      nome: "Júnior Lourenço",
      partido: "PL",
      intencao: 1.9,
      rejeicao: 13,
      cor: COLORS.verde,
    },
    {
      nome: "Vinícius Cozzolino",
      partido: "PL",
      intencao: 1.6,
      rejeicao: 12,
      cor: COLORS.amarelo,
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

// Senadores / pré-candidatos ao Senado por estado (clique no mapa do NOC).
// RJ com dados reais; demais estados: titulares reais quando viável, senão demonstrativo.
export type Senador = { nome: string; partido: string; status: string };

const SENADORES: Record<string, Senador[]> = {
  RJ: [
    {
      nome: "Flávio Bolsonaro",
      partido: "PL",
      status: "titular · concorre 2026",
    },
    { nome: "Carlos Portinho", partido: "PL", status: "titular · vaga 2026" },
    { nome: "Romário", partido: "PL", status: "titular (até 2031)" },
    { nome: "Cláudio Castro", partido: "PL", status: "pré-candidato 2026" },
    {
      nome: "Marcelo Crivella",
      partido: "Republicanos",
      status: "pré-candidato 2026",
    },
    { nome: "Sóstenes Cavalcante", partido: "PL", status: "cogitado 2026" },
    { nome: "Lindbergh Farias", partido: "PT", status: "pré-candidato 2026" },
  ],
  SP: [
    { nome: "Marcos Pontes", partido: "PL", status: "titular" },
    { nome: "Mara Gabrilli", partido: "PSD", status: "titular · vaga 2026" },
    { nome: "Eduardo Suplicy", partido: "PT", status: "cogitado 2026" },
  ],
  MG: [
    { nome: "Rodrigo Pacheco", partido: "PSD", status: "titular · vaga 2026" },
    { nome: "Cleitinho", partido: "Republicanos", status: "titular" },
    { nome: "Carlos Viana", partido: "Podemos", status: "titular · vaga 2026" },
  ],
  RS: [
    { nome: "Paulo Paim", partido: "PT", status: "titular · vaga 2026" },
    { nome: "Hamilton Mourão", partido: "Republicanos", status: "titular" },
    {
      nome: "Luis Carlos Heinze",
      partido: "PP",
      status: "titular · vaga 2026",
    },
  ],
  BA: [
    { nome: "Jaques Wagner", partido: "PT", status: "titular" },
    { nome: "Otto Alencar", partido: "PSD", status: "titular · vaga 2026" },
    { nome: "Ângelo Coronel", partido: "PSD", status: "titular · vaga 2026" },
  ],
  PR: [
    { nome: "Sergio Moro", partido: "União", status: "titular" },
    { nome: "Flávio Arns", partido: "PSB", status: "titular · vaga 2026" },
    {
      nome: "Oriovisto Guimarães",
      partido: "Podemos",
      status: "titular · vaga 2026",
    },
  ],
};

const UF_NOME: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export function ufNome(uf: string): string {
  return UF_NOME[uf] ?? uf;
}

export function getSenatorsByState(uf: string): Senador[] {
  if (SENADORES[uf]) return SENADORES[uf];
  // Fallback demonstrativo determinístico.
  const partidos = ["PL", "PT", "PSD", "MDB", "União"];
  let h = 0;
  for (let i = 0; i < uf.length; i++) h = (h * 31 + uf.charCodeAt(i)) % 997;
  return [
    {
      nome: `Senador titular ${uf}-1`,
      partido: partidos[h % 5],
      status: "titular (demonstrativo)",
    },
    {
      nome: `Senador titular ${uf}-2`,
      partido: partidos[(h + 2) % 5],
      status: "vaga 2026 (demonstrativo)",
    },
    {
      nome: `Pré-candidato ${uf}`,
      partido: partidos[(h + 4) % 5],
      status: "pré-candidato 2026 (demonstrativo)",
    },
  ];
}

// Governadores por estado (atuais 2023–2026 + status 2026).
export type Governador = { nome: string; partido: string; status: string };

const GOVERNADORES: Record<string, Governador> = {
  RJ: {
    nome: "Cláudio Castro",
    partido: "PL",
    status: "governador · reeleição 2026",
  },
  SP: {
    nome: "Tarcísio de Freitas",
    partido: "Republicanos",
    status: "governador · pré-candidato a presidente",
  },
  MG: {
    nome: "Romeu Zema",
    partido: "Novo",
    status: "governador (2º mandato)",
  },
  RS: {
    nome: "Eduardo Leite",
    partido: "PSDB",
    status: "governador · reeleição 2026",
  },
  BA: {
    nome: "Jerônimo Rodrigues",
    partido: "PT",
    status: "governador · reeleição 2026",
  },
  PR: {
    nome: "Ratinho Jr.",
    partido: "PSD",
    status: "governador (2º mandato)",
  },
  PE: {
    nome: "Raquel Lyra",
    partido: "PSD",
    status: "governadora · reeleição 2026",
  },
  CE: {
    nome: "Elmano de Freitas",
    partido: "PT",
    status: "governador · reeleição 2026",
  },
  GO: {
    nome: "Ronaldo Caiado",
    partido: "União",
    status: "governador · pré-candidato a presidente",
  },
  DF: {
    nome: "Ibaneis Rocha",
    partido: "MDB",
    status: "governador (2º mandato)",
  },
  SC: {
    nome: "Jorginho Mello",
    partido: "PL",
    status: "governador · reeleição 2026",
  },
  ES: {
    nome: "Renato Casagrande",
    partido: "PSB",
    status: "governador (2º mandato)",
  },
};

export function getGovernorByState(uf: string): Governador {
  if (GOVERNADORES[uf]) return GOVERNADORES[uf];
  const partidos = ["PL", "PT", "PSD", "MDB", "União", "PSB"];
  let h = 0;
  for (let i = 0; i < uf.length; i++) h = (h * 31 + uf.charCodeAt(i)) % 991;
  return {
    nome: `Governador ${uf}`,
    partido: partidos[h % partidos.length],
    status: "atual · disputa 2026 (demonstrativo)",
  };
}
