// Pesquisas Próprias — templates por público, calendário, bases-alvo (WhatsApp)
// e gerador de resultado parcial AO VIVO. Determinístico (jitter por tick).

import { REGIONS } from "./rj-regions";

export type SurveyOpcao = { label: string; base: number; cor: string };
export type SurveyTemplate = {
  id: string;
  nome: string;
  publico: string;
  icon: string;
  pergunta: string;
  opcoes: SurveyOpcao[];
};

const C = {
  verde: "#22c55e",
  azul: "#60a5fa",
  ouro: "#f0c030",
  roxo: "#8b5cf6",
  verm: "#ef4444",
  cinza: "#8a8aaa",
};

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
  {
    id: "aprovacao",
    nome: "Aprovação Geral",
    publico: "Todos os eleitores",
    icon: "thumbs-up",
    pergunta: "Como você avalia o trabalho do candidato?",
    opcoes: [
      { label: "Ótimo", base: 34, cor: C.verde },
      { label: "Bom", base: 29, cor: C.azul },
      { label: "Regular", base: 21, cor: C.ouro },
      { label: "Ruim", base: 16, cor: C.verm },
    ],
  },
  {
    id: "intencao",
    nome: "Intenção de Voto",
    publico: "Indecisos",
    icon: "vote",
    pergunta: "Em quem você votaria para Deputado Federal hoje?",
    opcoes: [
      { label: "Renato Araújo", base: 28, cor: C.verde },
      { label: "Outro candidato", base: 41, cor: C.azul },
      { label: "Indeciso", base: 22, cor: C.ouro },
      { label: "Branco/Nulo", base: 9, cor: C.cinza },
    ],
  },
  {
    id: "jovens",
    nome: "Pauta Jovem",
    publico: "Jovens 16–24",
    icon: "users",
    pergunta: "Qual sua principal preocupação?",
    opcoes: [
      { label: "Emprego", base: 38, cor: C.verde },
      { label: "Educação", base: 27, cor: C.azul },
      { label: "Segurança", base: 20, cor: C.ouro },
      { label: "Meio ambiente", base: 15, cor: C.roxo },
    ],
  },
  {
    id: "mulheres",
    nome: "Pauta das Mulheres",
    publico: "Mulheres",
    icon: "user",
    pergunta: "Qual tema deve ser prioridade?",
    opcoes: [
      { label: "Saúde", base: 36, cor: C.verde },
      { label: "Segurança", base: 28, cor: C.azul },
      { label: "Renda/Trabalho", base: 22, cor: C.ouro },
      { label: "Creche/Educação", base: 14, cor: C.roxo },
    ],
  },
  {
    id: "evangelicos",
    nome: "Base Evangélica",
    publico: "Evangélicos",
    icon: "church",
    pergunta: "Quais valores você considera mais importantes?",
    opcoes: [
      { label: "Família", base: 41, cor: C.verde },
      { label: "Liberdade religiosa", base: 30, cor: C.azul },
      { label: "Segurança", base: 18, cor: C.ouro },
      { label: "Assistência social", base: 11, cor: C.roxo },
    ],
  },
  {
    id: "empreendedores",
    nome: "Empreendedores",
    publico: "Comércio e serviços",
    icon: "briefcase",
    pergunta: "O que mais ajudaria seu negócio?",
    opcoes: [
      { label: "Menos impostos", base: 44, cor: C.verde },
      { label: "Crédito", base: 24, cor: C.azul },
      { label: "Capacitação", base: 18, cor: C.ouro },
      { label: "Infraestrutura", base: 14, cor: C.roxo },
    ],
  },
];

export type CalendarItem = {
  semana: string;
  data: string;
  tema: string;
  templateId: string;
  objetivo: string;
};

export const SURVEY_CALENDAR: CalendarItem[] = [
  {
    semana: "Semana 1",
    data: "02–08 jun",
    tema: "Aprovação geral",
    templateId: "aprovacao",
    objetivo: "Termômetro inicial da campanha",
  },
  {
    semana: "Semana 2",
    data: "09–15 jun",
    tema: "Pauta jovem",
    templateId: "jovens",
    objetivo: "Engajar 16–24 nas redes",
  },
  {
    semana: "Semana 3",
    data: "16–22 jun",
    tema: "Pauta das mulheres",
    templateId: "mulheres",
    objetivo: "Ampliar base feminina",
  },
  {
    semana: "Semana 4",
    data: "23–29 jun",
    tema: "Base evangélica",
    templateId: "evangelicos",
    objetivo: "Consolidar igrejas parceiras",
  },
  {
    semana: "Semana 5",
    data: "30 jun–06 jul",
    tema: "Empreendedores",
    templateId: "empreendedores",
    objetivo: "Mobilizar comércio local",
  },
  {
    semana: "Semana 6",
    data: "07–13 jul",
    tema: "Intenção de voto",
    templateId: "intencao",
    objetivo: "Medir conversão antes do horário eleitoral",
  },
];

export type TargetMode = "gestor" | "regiao" | "tipo" | "todos";
export const TARGET_MODES: { id: TargetMode; nome: string; icon: string }[] = [
  { id: "gestor", nome: "Por Gestor", icon: "user-cog" },
  { id: "regiao", nome: "Por Região", icon: "map-pin" },
  { id: "tipo", nome: "Por Tipo de Base", icon: "layers" },
  { id: "todos", nome: "Todos", icon: "globe" },
];

export type BaseOpcao = { id: string; nome: string; alcance: number };

const GESTORES = [
  { id: "g-aldair", nome: "Pr. Aldair Souza (Igreja)", alcance: 4200 },
  { id: "g-marcos", nome: "Marcos Vieira (Regional)", alcance: 6800 },
  { id: "g-carla", nome: "Dep. Carla Freitas (Estadual)", alcance: 9400 },
  { id: "g-patricia", nome: "Patrícia Nunes (Regional)", alcance: 5100 },
];
const TIPOS = [
  { id: "t-igreja", nome: "Líderes de Igreja", alcance: 18400 },
  { id: "t-regional", nome: "Gerentes Regionais", alcance: 26200 },
  { id: "t-deputado", nome: "Deputados Estaduais", alcance: 31000 },
  { id: "t-cabos", nome: "Cabos Eleitorais", alcance: 42800 },
  { id: "t-comunidade", nome: "Comunidades WhatsApp", alcance: 22600 },
];

export function getBases(mode: TargetMode): BaseOpcao[] {
  if (mode === "gestor") return GESTORES;
  if (mode === "tipo") return TIPOS;
  if (mode === "regiao")
    return REGIONS.map((r) => ({
      id: r.id,
      nome: r.nome,
      alcance: Math.round(
        r.municipios.reduce((s, m) => s + m.eleitorado, 0) * 0.018,
      ),
    }));
  return [{ id: "todos", nome: "Toda a base mobilizada", alcance: 141000 }];
}

export function getTemplate(id: string): SurveyTemplate {
  return SURVEY_TEMPLATES.find((t) => t.id === id) ?? SURVEY_TEMPLATES[0];
}

// ── Resultado parcial AO VIVO ──
export type LiveResult = {
  alcance: number;
  disparados: number;
  entregues: number;
  abertos: number;
  respondidos: number;
  taxaResposta: number;
  velocidade: number;
  porOpcao: { label: string; cor: string; pct: number; votos: number }[];
  porBase: { nome: string; respostas: number }[];
  serieTempo: number[];
  porRegiao: { nome: string; value: number }[];
  sentimento: { pos: number; neu: number; neg: number };
  idade: number[];
};

/** frac 0..1 = progresso da coleta; tick adiciona jitter determinístico. */
export function buildLiveResult(
  templateId: string,
  alcance: number,
  frac: number,
  tick: number,
): LiveResult {
  const t = getTemplate(templateId);
  const taxaFinal = 0.36;
  const respondidos = Math.min(
    alcance,
    Math.round(alcance * taxaFinal * Math.min(1, frac)),
  );
  const disparados = alcance;
  const entregues = Math.round(alcance * 0.96);
  const abertos = Math.round(alcance * 0.62 * Math.min(1, frac + 0.15));
  const taxaResposta =
    entregues > 0 ? Math.round((respondidos / entregues) * 100) : 0;
  const velocidade = Math.max(
    0,
    Math.round((alcance * taxaFinal) / 60 + Math.sin(tick) * 6),
  );

  const jitter = (i: number) => Math.sin(tick / 2 + i) * 1.4;
  const porOpcao = t.opcoes.map((o, i) => {
    const pct = Math.max(1, o.base + jitter(i));
    return {
      label: o.label,
      cor: o.cor,
      pct: Math.round(pct),
      votos: Math.round((respondidos * pct) / 100),
    };
  });

  const serieTempo = Array.from({ length: 12 }, (_, i) =>
    Math.round(respondidos * Math.min(1, (i + 1) / 12)),
  );

  const bases = ["Igreja", "Regional", "Deputados", "Cabos", "Comunidade"];
  const porBase = bases.map((nome, i) => ({
    nome,
    respostas: Math.round(
      (respondidos / bases.length) *
        (0.7 + Math.abs(Math.sin(tick / 3 + i)) * 0.7),
    ),
  }));

  const porRegiao = REGIONS.map((r, i) => ({
    nome: r.nome,
    value: Math.round(
      (respondidos / REGIONS.length) *
        (0.6 + Math.abs(Math.cos(tick / 4 + i)) * 0.8),
    ),
  }));

  return {
    alcance,
    disparados,
    entregues,
    abertos,
    respondidos,
    taxaResposta,
    velocidade,
    porOpcao,
    porBase,
    serieTempo,
    porRegiao,
    sentimento: {
      pos: 58 + Math.round(jitter(0)),
      neu: 27,
      neg: 15 - Math.round(jitter(1)),
    },
    idade: [16, 24, 28, 20, 12].map((v) => Math.round(v + jitter(v))),
  };
}

// Histórico de pesquisas próprias já realizadas (demonstrativo).
export type SurveyHistoryItem = {
  id: string;
  at: string;
  templateNome: string;
  baseNome: string;
  alcance: number;
  respostas: number;
  resultadoLider: string;
  resultadoPct: number;
  status: string;
};

export const SURVEY_HISTORY: SurveyHistoryItem[] = [
  { id: "h10", at: "2026-06-02T09:00:00", templateNome: "Aprovação Geral", baseNome: "Toda a base mobilizada", alcance: 141000, respostas: 49200, resultadoLider: "Ótimo+Bom 63%", resultadoPct: 63, status: "concluída" },
  { id: "h09", at: "2026-05-26T09:00:00", templateNome: "Intenção de Voto", baseNome: "Indecisos", alcance: 38000, respostas: 12800, resultadoLider: "Renato 28%", resultadoPct: 28, status: "concluída" },
  { id: "h08", at: "2026-05-19T09:00:00", templateNome: "Pauta Jovem", baseNome: "Cabos Eleitorais", alcance: 42800, respostas: 15600, resultadoLider: "Emprego 38%", resultadoPct: 38, status: "concluída" },
  { id: "h07", at: "2026-05-12T09:00:00", templateNome: "Pauta das Mulheres", baseNome: "Gerentes Regionais", alcance: 26200, respostas: 9100, resultadoLider: "Saúde 36%", resultadoPct: 36, status: "concluída" },
  { id: "h06", at: "2026-05-05T09:00:00", templateNome: "Base Evangélica", baseNome: "Líderes de Igreja", alcance: 18400, respostas: 8700, resultadoLider: "Família 41%", resultadoPct: 41, status: "concluída" },
  { id: "h05", at: "2026-04-28T09:00:00", templateNome: "Empreendedores", baseNome: "Comunidades WhatsApp", alcance: 22600, respostas: 6900, resultadoLider: "Menos impostos 44%", resultadoPct: 44, status: "concluída" },
  { id: "h04", at: "2026-04-21T09:00:00", templateNome: "Aprovação Geral", baseNome: "Costa Verde", alcance: 31000, respostas: 11200, resultadoLider: "Ótimo+Bom 66%", resultadoPct: 66, status: "concluída" },
  { id: "h03", at: "2026-04-14T09:00:00", templateNome: "Intenção de Voto", baseNome: "Metropolitana", alcance: 52000, respostas: 14300, resultadoLider: "Renato 24%", resultadoPct: 24, status: "concluída" },
  { id: "h02", at: "2026-04-07T09:00:00", templateNome: "Pauta Jovem", baseNome: "Toda a base mobilizada", alcance: 141000, respostas: 38400, resultadoLider: "Emprego 40%", resultadoPct: 40, status: "concluída" },
  { id: "h01", at: "2026-03-31T09:00:00", templateNome: "Aprovação Geral", baseNome: "Deputados Estaduais", alcance: 31000, respostas: 10100, resultadoLider: "Ótimo+Bom 59%", resultadoPct: 59, status: "concluída" },
];
