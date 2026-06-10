// Métricas derivadas da dataset de regiões do RJ.
// Mesma fonte alimenta o HTML das dashboards e os gráficos Chart.js.
// Tudo determinístico (sem Math.random) para builds estáveis.

import type { Kpi, RegionId, Series } from "./types";
import {
  REGIONS,
  getRegion,
  intencaoMediaEstadual,
  regionEleitorado,
  totalEleitorado,
} from "./rj-regions";

export const COLORS = {
  verde: "#22c55e",
  azul: "#3b82f6",
  amarelo: "#f59e0b",
  roxo: "#8b5cf6",
  vermelho: "#ef4444",
  cinza: "#6b7280",
  rosa: "#f472b6",
  azulClaro: "#60a5fa",
  whatsapp: "#25d366",
  instagram: "#e1306c",
  facebook: "#1877f2",
  twitter: "#1da1f2",
};

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];

function nf(value: number): string {
  return value.toLocaleString("pt-BR");
}

/** Contexto resolvido a partir do id de região (com fallback estadual). */
function resolve(region: RegionId) {
  const r = getRegion(region);
  if (r) {
    return {
      nome: r.nome,
      intencao: r.intencaoVoto,
      posicao: r.posicao,
      cabos: r.cabos,
      cobertura: r.cobertura,
      eleitorado: regionEleitorado(r),
      sentimento: r.sentimento,
      escala: r.escala,
      municipios: r.municipios,
      bairros: r.bairrosDestaque,
    };
  }
  // Agregado estadual ("Todo o RJ").
  const cabos = REGIONS.reduce((s, x) => s + x.cabos, 0);
  const coberturaMedia = Math.round(
    REGIONS.reduce((s, x) => s + x.cobertura, 0) / REGIONS.length,
  );
  const sentPos = Math.round(
    REGIONS.reduce((s, x) => s + x.sentimento.positivo, 0) / REGIONS.length,
  );
  const sentNeg = Math.round(
    REGIONS.reduce((s, x) => s + x.sentimento.negativo, 0) / REGIONS.length,
  );
  return {
    nome: "Todo o RJ",
    intencao: intencaoMediaEstadual(),
    posicao: 4,
    cabos,
    cobertura: coberturaMedia,
    eleitorado: totalEleitorado(),
    sentimento: {
      positivo: sentPos,
      neutro: 100 - sentPos - sentNeg,
      negativo: sentNeg,
    },
    escala: 1,
    municipios: REGIONS.flatMap((x) => x.municipios),
    bairros: REGIONS.flatMap((x) => x.bairrosDestaque).slice(0, 12),
  };
}

// ---------------------------------------------------------------------------
// KPIs e séries por seção
// ---------------------------------------------------------------------------

export function getDashboardKpis(region: RegionId): Kpi[] {
  const ctx = resolve(region);
  const votosEstimados = Math.round((ctx.eleitorado * ctx.intencao) / 100);
  return [
    {
      label: "Intenção de Voto",
      valor: `${ctx.intencao.toFixed(1)}%`,
      delta: "+0.6 p.p.",
      trend: "up",
      icon: "trending-up",
    },
    {
      label: `Posição · ${ctx.nome}`,
      valor: `#${ctx.posicao}`,
      delta: "estável",
      trend: "flat",
      icon: "award",
    },
    {
      label: "Votos Estimados",
      valor: nf(votosEstimados),
      delta: "+4.2%",
      trend: "up",
      icon: "vote",
    },
    {
      label: "Aprovação Geral",
      valor: `${ctx.sentimento.positivo}%`,
      delta: "+3 p.p.",
      trend: "up",
      icon: "thumbs-up",
    },
  ];
}

/** Evolução da intenção de voto ao longo de 2026 (8 meses). */
export function getIntencaoEvolution(region: RegionId): Series {
  const ctx = resolve(region);
  const fim = ctx.intencao;
  const inicio = Number((fim * 0.47).toFixed(1));
  const passo = (fim - inicio) / (MESES.length - 1);
  const data = MESES.map((_, i) => Number((inicio + passo * i).toFixed(1)));
  return {
    labels: MESES,
    datasets: [{ label: "Intenção %", data, color: COLORS.verde }],
  };
}

export function getFaixaEtaria(region: RegionId): Series {
  const ctx = resolve(region);
  const base = [12, 18, 24, 22, 14];
  const data = base.map((v) => Math.round(v * ctx.escala));
  return {
    labels: ["16–24", "25–34", "35–44", "45–59", "60+"],
    datasets: [
      {
        label: "Eleitores (%)",
        data,
        color: COLORS.azul,
        palette: [
          COLORS.azul,
          COLORS.verde,
          COLORS.amarelo,
          COLORS.roxo,
          COLORS.cinza,
        ],
      },
    ],
  };
}

export function getPesquisasInstitutos(region: RegionId): Series {
  const ctx = resolve(region);
  const base = [9.1, 12.8, 7.6, 8.9, 14.2];
  const fator = ctx.intencao / intencaoMediaEstadual();
  const data = base.map((v) => Number((v * fator).toFixed(1)));
  return {
    labels: ["Datafolha", "IBOPE", "Quaest", "Atlas", "Paraná"],
    datasets: [
      {
        label: "%",
        data,
        color: COLORS.verde,
        palette: [
          COLORS.verde,
          COLORS.azul,
          COLORS.amarelo,
          COLORS.roxo,
          COLORS.verde,
        ],
      },
    ],
  };
}

export function getPesquisasHistorico(region: RegionId): Series {
  const ctx = resolve(region);
  const f = ctx.intencao / intencaoMediaEstadual();
  const datafolha = [5.8, 6.4, 7.2, 8.1, 9.1].map((v) =>
    Number((v * f).toFixed(1)),
  );
  const ibope = [8.2, 9.1, 10.4, 11.8, 12.8].map((v) =>
    Number((v * f).toFixed(1)),
  );
  const quaest = [4.8, 5.5, 6.1, 7.0, 7.6].map((v) =>
    Number((v * f).toFixed(1)),
  );
  return {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      { label: "Datafolha", data: datafolha, color: COLORS.verde },
      { label: "IBOPE", data: ibope, color: COLORS.azul },
      { label: "Quaest", data: quaest, color: COLORS.amarelo },
    ],
  };
}

export function getTerritoriosIdade(region: RegionId): Series {
  const ctx = resolve(region);
  const base = [58, 63, 71, 68, 44];
  const data = base.map((v) =>
    Math.min(99, Math.round(v * (0.7 + ctx.escala * 0.3))),
  );
  return {
    labels: ["16–24", "25–34", "35–44", "45–59", "60+"],
    datasets: [
      {
        label: "Aprovação %",
        data,
        color: COLORS.verde,
        palette: data.map((v) =>
          v >= 60 ? COLORS.verde : v >= 50 ? COLORS.azul : COLORS.vermelho,
        ),
      },
    ],
  };
}

/** Flutuação de ranking por município (4 semanas), usando os municípios da região. */
export function getFlutuacao(region: RegionId): Series {
  const ctx = resolve(region);
  const top = ctx.municipios.slice(0, 4);
  const cores = [COLORS.verde, COLORS.azul, COLORS.amarelo, COLORS.vermelho];
  return {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    datasets: top.map((m, i) => {
      const base = m.cobertura;
      return {
        label: m.nome,
        color: cores[i % cores.length],
        data: [base - 4, base - 2, base - 1, base].map((v) => Math.max(0, v)),
      };
    }),
  };
}

export function getConcorrentes(region: RegionId): Series {
  const ctx = resolve(region);
  const top = ctx.municipios.slice(0, 5);
  return {
    labels: top.map((m) => m.nome.split(" ")[0]),
    datasets: [
      {
        label: "Renato",
        color: "rgba(34,197,94,0.85)",
        data: top.map((m) => m.cobertura),
      },
      {
        label: "Chico",
        color: "rgba(239,68,68,0.85)",
        data: top.map((m) => Math.max(5, 100 - m.cobertura - 8)),
      },
    ],
  };
}

export function getRedesCrescimento(region: RegionId): Series {
  const ctx = resolve(region);
  const f = ctx.escala;
  const grow = (base: number[]) => base.map((v) => Math.round(v * f));
  return {
    labels: ["01/04", "07/04", "14/04", "21/04", "28/04", "30/04"],
    datasets: [
      {
        label: "Instagram",
        color: COLORS.instagram,
        data: grow([31200, 31800, 32000, 32400, 32600, 32700]),
      },
      {
        label: "Facebook",
        color: COLORS.facebook,
        data: grow([46800, 47100, 47500, 47900, 48100, 48300]),
      },
      {
        label: "Twitter/X",
        color: COLORS.twitter,
        data: grow([17800, 17900, 18000, 18050, 18080, 18100]),
      },
    ],
  };
}

export function getSentimentoRedes(region: RegionId): Series {
  const s = resolve(region).sentimento;
  return {
    labels: ["Positivo", "Neutro", "Negativo"],
    datasets: [
      {
        label: "Sentimento",
        data: [s.positivo, s.neutro, s.negativo],
        color: COLORS.verde,
        palette: [COLORS.verde, COLORS.cinza, COLORS.vermelho],
      },
    ],
  };
}

export function getDiarioAtividades(region: RegionId): Series {
  const ctx = resolve(region);
  const base = [8, 12, 9, 14, 11, 6];
  return {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    datasets: [
      {
        label: "Atividades",
        color: "rgba(34,197,94,0.8)",
        data: base.map((v) => Math.round(v * ctx.escala)),
      },
    ],
  };
}

export function getProjecaoIa(region: RegionId): Series {
  const ctx = resolve(region);
  const votos = Math.round((ctx.eleitorado * ctx.intencao) / 100);
  return {
    labels: ["Ago/26", "Set/26", "Out/26 (Eleição)"],
    datasets: [
      {
        label: "Otimista",
        color: COLORS.verde,
        data: [
          Math.round(votos * 0.92),
          Math.round(votos * 1.04),
          Math.round(votos * 1.18),
        ],
      },
      {
        label: "Base",
        color: COLORS.azul,
        data: [Math.round(votos * 0.9), Math.round(votos * 0.97), votos],
      },
      {
        label: "Pessimista",
        color: COLORS.vermelho,
        data: [
          Math.round(votos * 0.8),
          Math.round(votos * 0.85),
          Math.round(votos * 0.9),
        ],
      },
    ],
  };
}

export function getDemandas(region: RegionId): Series {
  const ctx = resolve(region);
  const base = [482, 341, 298, 261, 198, 176, 91];
  return {
    labels: [
      "Saúde",
      "Segurança",
      "Infraest.",
      "Emprego",
      "Educação",
      "Turismo",
      "Moradia",
    ],
    datasets: [
      {
        label: "Menções",
        data: base.map((v) => Math.round(v * ctx.escala)),
        color: COLORS.verde,
        palette: [
          COLORS.verde,
          COLORS.azul,
          COLORS.amarelo,
          COLORS.roxo,
          COLORS.verde,
          COLORS.azulClaro,
          COLORS.rosa,
        ],
      },
    ],
  };
}

export function getFinanceiroExecucao(): Series {
  return {
    labels: [
      "Sem 1",
      "Sem 2",
      "Sem 3",
      "Sem 4",
      "Sem 5",
      "Sem 6",
      "Sem 7",
      "Sem 8 (prev)",
      "Sem 9 (prev)",
      "Sem 10 (prev)",
    ],
    datasets: [
      {
        label: "Planejado",
        color: COLORS.azul,
        data: [200, 260, 310, 360, 410, 460, 510, 620, 720, 800],
      },
      {
        label: "Realizado",
        color: COLORS.verde,
        data: [180, 320, 440, 540, 650, 760, 850, null, null, null],
      },
      {
        label: "Projeção",
        color: COLORS.amarelo,
        data: [null, null, null, null, null, null, 850, 980, 1100, 1140],
      },
    ],
  };
}

export function getFinanceiroFontes(): Series {
  return {
    labels: ["Fundo Eleitoral", "Fundo Partidário", "Doações PF"],
    datasets: [
      {
        label: "Fontes",
        data: [80, 15, 5],
        color: COLORS.verde,
        palette: [COLORS.verde, COLORS.azul, "#fb923c"],
      },
    ],
  };
}

/** Meta vs comprometidos por município (CRM). */
export function getCrmMunicipio(region: RegionId): Series {
  const ctx = resolve(region);
  const top = ctx.municipios.slice(0, 4);
  const meta = top.map((m) => Math.round((m.eleitorado * 0.14) / 1000) * 1000);
  const comprometidos = top.map((m, i) =>
    Math.round(meta[i] * (m.cobertura / 100)),
  );
  return {
    labels: top.map((m) => m.nome),
    datasets: [
      { label: "Meta", color: "rgba(59,130,246,0.45)", data: meta },
      {
        label: "Comprometidos",
        color: COLORS.verde,
        data: comprometidos,
        palette: comprometidos.map((v, i) =>
          v / meta[i] >= 0.7
            ? COLORS.verde
            : v / meta[i] >= 0.45
              ? COLORS.amarelo
              : COLORS.vermelho,
        ),
      },
    ],
  };
}

export function getComunicacaoEngajamento(): Series {
  return {
    labels: ["Sem 14", "Sem 15", "Sem 16", "Sem 17", "Sem 18"],
    datasets: [
      { label: "WhatsApp", color: COLORS.whatsapp, data: [62, 65, 68, 71, 68] },
      {
        label: "Instagram",
        color: COLORS.instagram,
        data: [4.8, 5.2, 5.9, 6.4, 6.8],
      },
    ],
  };
}

/**
 * Baseline mockado do funil de meta de votos por região.
 * O painel soma a estes números as contagens reais das rotas (CRM, leads,
 * mensagens, perguntas) para um total "vivo".
 */
export function getMetaBaseline(region: RegionId): {
  meta: number;
  inscritos: number;
  cadastrados: number;
  engajados: number;
} {
  const ctx = resolve(region);
  const meta = Math.round((ctx.eleitorado * 0.012) / 100) * 100 || 45000;
  const inscritos = Math.round(meta * 0.62);
  const cadastrados = Math.round(meta * 0.41);
  const engajados = Math.round(meta * 0.27);
  return { meta, inscritos, cadastrados, engajados };
}

/** Meta vs realizado por região (para gráfico do painel de meta). */
export function getMetaPorRegiao(): Series {
  const regs = REGIONS;
  return {
    labels: regs.map((r) => r.nome.split(" ")[0]),
    datasets: [
      {
        label: "Meta",
        color: "rgba(59,130,246,0.45)",
        data: regs.map(
          (r) => Math.round((regionEleitorado(r) * 0.012) / 100) * 100,
        ),
      },
      {
        label: "Confirmados",
        color: COLORS.verde,
        data: regs.map((r) =>
          Math.round(
            ((regionEleitorado(r) * 0.012) / 100) * 100 * (r.cobertura / 100),
          ),
        ),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Dados de apoio para os MVPs interativos (Comunicação / CRM)
// ---------------------------------------------------------------------------

export type WhatsappGroup = {
  id: string;
  nome: string;
  regiao: string;
  membros: number;
};

export const WHATSAPP_GROUPS: WhatsappGroup[] = [
  {
    id: "grp-angra-centro",
    nome: "Angra Centro — Mobilização",
    regiao: "Costa Verde",
    membros: 412,
  },
  {
    id: "grp-cabos-cv",
    nome: "Cabos Eleitorais · Costa Verde",
    regiao: "Costa Verde",
    membros: 96,
  },
  {
    id: "grp-mulheres-rj",
    nome: "Mulheres pela Mudança RJ",
    regiao: "Metropolitana",
    membros: 638,
  },
  {
    id: "grp-lagos",
    nome: "Apoiadores Região dos Lagos",
    regiao: "Baixadas Litorâneas",
    membros: 274,
  },
  {
    id: "grp-serra",
    nome: "Voluntários Serra",
    regiao: "Serrana",
    membros: 188,
  },
  {
    id: "grp-medio-paraiba",
    nome: "Médio Paraíba Forte",
    regiao: "Médio Paraíba",
    membros: 221,
  },
];

export type MessageTemplate = {
  id: string;
  canal: "WhatsApp" | "Instagram" | "Email" | "SMS";
  titulo: string;
  texto: string;
};

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "tpl-agenda",
    canal: "WhatsApp",
    titulo: "Convite para agenda local",
    texto:
      "Olá! Renato Araújo estará em {cidade} nesta semana. Conto com você para construir essa mudança. 💚 Confirme presença!",
  },
  {
    id: "tpl-mobiliza",
    canal: "WhatsApp",
    titulo: "Mobilização de cabos",
    texto:
      "Equipe, foco total no porta a porta de {cidade} esta semana. Metas atualizadas no cockpit. Vamos juntos! 🚀",
  },
  {
    id: "tpl-pesquisa",
    canal: "Instagram",
    titulo: "Card de pesquisa",
    texto:
      "Subimos nas pesquisas em {cidade}! Obrigado pela confiança. Compartilhe e bora pra cima! 📈",
  },
  {
    id: "tpl-newsletter",
    canal: "Email",
    titulo: "Boletim semanal",
    texto:
      "Resumo da semana da campanha em {cidade}: agenda, conquistas e próximos passos.",
  },
];

// Votos esperados para o candidato por região = eleitorado × intenção × cobertura.
export type ExpectedVotes = {
  id: RegionId;
  nome: string;
  votos: number;
  intencao: number;
  cobertura: number;
  eleitorado: number;
};

export function getExpectedVotesByRegion(): {
  regioes: ExpectedVotes[];
  total: number;
} {
  const regioes = REGIONS.map((r) => {
    const eleitorado = regionEleitorado(r);
    const votos = Math.round(
      eleitorado * (r.intencaoVoto / 100) * (r.cobertura / 100),
    );
    return {
      id: r.id as RegionId,
      nome: r.nome,
      votos,
      intencao: r.intencaoVoto,
      cobertura: r.cobertura,
      eleitorado,
    };
  }).sort((a, b) => b.votos - a.votos);
  const total = regioes.reduce((s, r) => s + r.votos, 0);
  return { regioes, total };
}
