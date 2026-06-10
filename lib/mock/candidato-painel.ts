// Painel do Candidato: "vou me eleger?" (quociente × projeção), momentum e head-to-head.
// Reusa dados existentes. Determinístico. Quociente é ESTIMATIVA (não oficial).

import { getIntencaoEvolution } from "./campaign-metrics";
import { totalEleitorado } from "./rj-regions";
import { getRaceRanking } from "./races";
import type { RegionId } from "./types";

const ALVO = "Sóstenes Cavalcante";
const VAGAS_FEDERAIS_RJ = 46;

export type HeadToHead = {
  nome: string;
  partido: string;
  intencao: number;
  cor: string;
  alvo: boolean;
};

export type CandidatoPainel = {
  votosProjetados: number;
  votosParaEleger: number;
  dentro: boolean;
  faltam: number;
  folga: number;
  pctVaga: number;
  momentum: { delta: number; dir: "up" | "down" | "flat"; spark: number[] };
  headToHead: HeadToHead[];
  posicao: number;
};

export function getCandidatoPainel(region: RegionId): CandidatoPainel {
  // Quociente eleitoral estimado: válidos / vagas, com fator de coligação.
  const comparecimento = 0.8;
  const validade = 0.9;
  const validos = totalEleitorado() * comparecimento * validade;
  const votosParaEleger = Math.round((validos / VAGAS_FEDERAIS_RJ) * 0.62);

  // Ranking da vaga (federal) — base para projeção e head-to-head.
  const ranking = getRaceRanking("dep-federal", region);
  const idxAlvo = ranking.findIndex((c) => c.nome === ALVO);
  const posicao = idxAlvo >= 0 ? idxAlvo + 1 : ranking.length;

  // Projeção do candidato: intenção do alvo vs. a intenção que garante a vaga.
  // (o líder ~ corresponde ao quociente). Gera tensão realista "faltam X".
  const alvoIntencao = (idxAlvo >= 0 ? ranking[idxAlvo].intencao : 8) || 8;
  const refIntencao = (ranking[0]?.intencao ?? 11) * 0.96;
  const fatorVaga = Math.max(0.55, Math.min(1.2, alvoIntencao / refIntencao));
  const votosProjetados = Math.round(votosParaEleger * fatorVaga);

  const dentro = votosProjetados >= votosParaEleger;
  const faltam = Math.max(0, votosParaEleger - votosProjetados);
  const folga = Math.max(0, votosProjetados - votosParaEleger);
  const pctVaga = Math.round((votosProjetados / votosParaEleger) * 100);

  // Momentum da intenção.
  const serie = getIntencaoEvolution(region).datasets[0].data as number[];
  const last = serie[serie.length - 1] ?? 0;
  const prev = serie[serie.length - 2] ?? last;
  const delta = Number((last - prev).toFixed(1));
  const dir = delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat";

  // Head-to-head: alvo + vizinhos diretos (acima e abaixo) e o líder.
  const set = new Set<number>([0, 1]);
  if (idxAlvo >= 0) {
    set.add(idxAlvo);
    if (idxAlvo - 1 >= 0) set.add(idxAlvo - 1);
    if (idxAlvo + 1 < ranking.length) set.add(idxAlvo + 1);
  }
  const headToHead: HeadToHead[] = [...set]
    .sort((a, b) => a - b)
    .map((i) => ranking[i])
    .filter(Boolean)
    .map((c) => ({
      nome: c.nome,
      partido: c.partido,
      intencao: c.intencao,
      cor: c.cor,
      alvo: c.nome === ALVO,
    }));

  return {
    votosProjetados,
    votosParaEleger,
    dentro,
    faltam,
    folga,
    pctVaga,
    momentum: { delta, dir, spark: serie },
    headToHead,
    posicao,
  };
}
