// Notícias regionais (veículos reais do RJ) + discurso recomendado por região.
// Manchetes demonstrativas ancoradas no tema de maior oportunidade da região;
// links apontam para os veículos reais (home), monitoramento contínuo.

import { getOpportunityRanking } from "./priorities";
import { getRegion } from "./rj-regions";
import type { RegionId } from "./types";

const VEICULOS = [
  { nome: "O Dia", link: "https://odia.ig.com.br/" },
  { nome: "Correio da Manhã", link: "https://www.correiodamanha.com.br/" },
  { nome: "Diário do Rio", link: "https://diariodorio.com/" },
  { nome: "A Voz da Cidade", link: "https://avozdacidade.com/" },
  { nome: "Band News RJ", link: "https://www.band.uol.com.br/rio-de-janeiro" },
  {
    nome: "G1 Região dos Lagos",
    link: "https://g1.globo.com/rj/regiao-dos-lagos/",
  },
];

const MANCHETE: Record<string, string[]> = {
  Saúde: [
    "Fila por consultas pressiona postos em {reg}",
    "Moradores cobram UPA 24h em {reg}",
  ],
  Segurança: [
    "Comércio de {reg} pede mais policiamento",
    "Operação reforça segurança em {reg}",
  ],
  Infraestrutura: [
    "Buracos e obras paradas revoltam {reg}",
    "Prefeitura promete recapeamento em {reg}",
  ],
  "Emprego & Renda": [
    "Desemprego ainda preocupa em {reg}",
    "Curso de qualificação chega a {reg}",
  ],
  Educação: [
    "Pais cobram vagas em creche em {reg}",
    "Escolas de {reg} recebem reforma",
  ],
  Saneamento: [
    "Falta d'água atinge bairros de {reg}",
    "Esgoto a céu aberto incomoda em {reg}",
  ],
  Transporte: [
    "Tarifa e lotação geram protesto em {reg}",
    "Nova linha de ônibus atende {reg}",
  ],
  Turismo: [
    "Alta temporada movimenta {reg}",
    "Setor de turismo cobra investimento em {reg}",
  ],
  Moradia: [
    "Regularização fundiária avança em {reg}",
    "Famílias cobram moradia em {reg}",
  ],
};

export type RegionalNews = {
  titulo: string;
  veiculo: string;
  link: string;
  tema: string;
};

export function getRegionalNews(region: RegionId): RegionalNews[] {
  const r = getRegion(region);
  const reg = r?.nome ?? "Rio de Janeiro";
  const tops = getOpportunityRanking(region).slice(0, 3);
  return tops.map((t, i) => {
    const pool = MANCHETE[t.tema] ?? [`{reg}: pauta de ${t.tema} em destaque`];
    const v = VEICULOS[(i + reg.length) % VEICULOS.length];
    return {
      titulo: pool[(i + reg.length) % pool.length].replace("{reg}", reg),
      veiculo: v.nome,
      link: v.link,
      tema: t.tema,
    };
  });
}

const DISCURSO: Record<string, string> = {
  Saúde:
    "Assumir compromisso público com mais postos, médicos e remédio na ponta — saúde que chega rápido.",
  Segurança:
    "Defender policiamento de proximidade e iluminação; segurança sentida no dia a dia do comércio e das famílias.",
  Infraestrutura:
    "Prometer cronograma transparente de obras e fim dos buracos — cobrança de resultado, não promessa.",
  "Emprego & Renda":
    "Conectar qualificação, crédito ao pequeno negócio e atração de investimento que gera emprego local.",
  Educação:
    "Priorizar creche e escola integral; educação como porta de saída para as famílias da região.",
  Saneamento:
    "Tratar água e esgoto como urgência de saúde pública — dignidade básica que ainda falta.",
  Transporte:
    "Brigar por tarifa justa, frota nova e integração — tempo de vida de volta para o trabalhador.",
  Turismo:
    "Transformar o turismo em emprego e renda o ano todo, com infraestrutura e divulgação.",
  Moradia:
    "Acelerar regularização fundiária e moradia popular — segurança de ter o próprio teto.",
};

export function getDiscursoRecomendado(
  region: RegionId,
): { tema: string; texto: string }[] {
  return getOpportunityRanking(region)
    .slice(0, 3)
    .map((t) => ({
      tema: t.tema,
      texto:
        DISCURSO[t.tema] ??
        `Falar de ${t.tema} com proposta concreta e cobrança de resultado.`,
    }));
}
