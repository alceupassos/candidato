// Prioridades da população por região + índice Raio-X de oportunidade.
// "O que cada região precisa e o que dá mais votos." Determinístico.

import type { MatrixPoint, Priority, RegionId } from "./types";
import { REGIONS, getRegion } from "./rj-regions";

const TEMAS = [
  "Saúde",
  "Segurança",
  "Infraestrutura",
  "Emprego & Renda",
  "Educação",
  "Saneamento",
  "Transporte",
  "Turismo",
  "Moradia",
];

// Ênfase por região (multiplica demanda/potencial do tema). 1 = neutro.
const ENFASE: Record<string, Partial<Record<string, number>>> = {
  metropolitana: {
    Segurança: 1.4,
    Transporte: 1.35,
    Saúde: 1.2,
    Moradia: 1.25,
  },
  "costa-verde": {
    Turismo: 1.5,
    Saneamento: 1.4,
    "Emprego & Renda": 1.2,
    Infraestrutura: 1.15,
  },
  "baixadas-litoraneas": { Turismo: 1.45, Saneamento: 1.35, Segurança: 1.15 },
  serrana: { Infraestrutura: 1.4, Turismo: 1.25, Educação: 1.15 },
  "norte-fluminense": {
    "Emprego & Renda": 1.45,
    Saúde: 1.3,
    Infraestrutura: 1.2,
  },
  "noroeste-fluminense": { "Emprego & Renda": 1.4, Saúde: 1.35, Educação: 1.2 },
  "medio-paraiba": {
    "Emprego & Renda": 1.3,
    Infraestrutura: 1.25,
    Educação: 1.2,
  },
  "centro-sul": { Infraestrutura: 1.35, Saúde: 1.25, Educação: 1.2 },
};

// Seed determinístico simples a partir de strings.
function seed(a: string, b: string): number {
  let h = 0;
  const s = `${a}|${b}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
  return h / 1000; // 0–1
}

const clamp = (v: number) => Math.max(2, Math.min(99, Math.round(v)));

function priorityFor(regionId: string, tema: string): Priority {
  const enf = ENFASE[regionId]?.[tema] ?? 1;
  const s = seed(regionId, tema);
  const demanda = clamp(45 + enf * 28 + s * 18 - 9);
  const potencialVotos = clamp(40 + enf * 30 + (1 - s) * 16 - 8);
  // Quanto maior a demanda/ênfase, menor a satisfação atual (dor não resolvida).
  const satisfacaoAtual = clamp(70 - enf * 22 + s * 14);
  const urgencia = clamp(
    (demanda + (100 - satisfacaoAtual)) / 2 + (enf - 1) * 20,
  );
  return { tema, demanda, potencialVotos, satisfacaoAtual, urgencia };
}

/** Prioridades de uma região (ou média estadual em "all"). */
export function getPriorities(region: RegionId): Priority[] {
  const r = getRegion(region);
  if (r) return TEMAS.map((tema) => priorityFor(r.id, tema));
  // Agregado estadual: média por tema entre as regiões.
  return TEMAS.map((tema) => {
    const all = REGIONS.map((reg) => priorityFor(reg.id, tema));
    const avg = (k: keyof Priority) =>
      Math.round(all.reduce((s, p) => s + (p[k] as number), 0) / all.length);
    return {
      tema,
      demanda: avg("demanda"),
      potencialVotos: avg("potencialVotos"),
      satisfacaoAtual: avg("satisfacaoAtual"),
      urgencia: avg("urgencia"),
    };
  });
}

/** Índice de oportunidade Raio-X normalizado 0–100. */
export function oportunidade(p: Priority): number {
  const raw =
    (p.demanda * p.potencialVotos * (100 - p.satisfacaoAtual)) / 10000;
  return Math.round(raw); // máx ≈ 99
}

/** Matriz com o índice de oportunidade calculado por tema. */
export function getPriorityMatrix(region: RegionId): MatrixPoint[] {
  return getPriorities(region).map((p) => ({
    ...p,
    oportunidade: oportunidade(p),
  }));
}

/** Temas ordenados por maior oportunidade (o que mais converte voto). */
export function getOpportunityRanking(region: RegionId): MatrixPoint[] {
  return [...getPriorityMatrix(region)].sort(
    (a, b) => b.oportunidade - a.oportunidade,
  );
}

/** Para cada região, o tema de maior oportunidade (usado no mapa/NOC). */
export function getRegionTopOpportunity(): {
  id: string;
  nome: string;
  tema: string;
  indice: number;
}[] {
  return REGIONS.map((reg) => {
    const top = getOpportunityRanking(reg.id)[0];
    return {
      id: reg.id,
      nome: reg.nome,
      tema: top.tema,
      indice: top.oportunidade,
    };
  });
}
