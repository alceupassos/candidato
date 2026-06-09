// Tipos compartilhados da camada de mock por região do Rio de Janeiro.
// Fonte única de verdade que alimenta tanto o HTML das seções (dashboards)
// quanto os gráficos (Chart.js) e os MVPs interativos.

export type RegionId =
  | "all"
  | "metropolitana"
  | "costa-verde"
  | "baixadas-litoraneas"
  | "serrana"
  | "norte-fluminense"
  | "noroeste-fluminense"
  | "medio-paraiba"
  | "centro-sul";

export type Municipio = {
  nome: string;
  /** Eleitorado aproximado (mock). */
  eleitorado: number;
  /** Cobertura de campanha 0–100. */
  cobertura: number;
};

export type Bairro = {
  nome: string;
  /** Desempenho/penetração 0–100. */
  valor: number;
};

export type Sentimento = {
  positivo: number;
  neutro: number;
  negativo: number;
};

export type Region = {
  id: Exclude<RegionId, "all">;
  nome: string;
  apelido: string;
  municipios: Municipio[];
  /** Intenção de voto média na região (%). */
  intencaoVoto: number;
  /** Posição no ranking regional (1 = líder). */
  posicao: number;
  /** Cabos eleitorais ativos. */
  cabos: number;
  /** Cobertura média 0–100. */
  cobertura: number;
  sentimento: Sentimento;
  /** Bairros/localidades de destaque para a aba Territórios. */
  bairrosDestaque: Bairro[];
  /**
   * Fator de escala usado para derivar séries temporais por região
   * de forma determinística (sem aleatoriedade).
   */
  escala: number;
};

export type Kpi = {
  label: string;
  valor: string;
  delta?: string;
  /** "up" | "down" | "flat" — controla cor do delta. */
  trend?: "up" | "down" | "flat";
  icon?: string;
};

export type Dataset = {
  label: string;
  data: (number | null)[];
  color: string;
  /** Para gráficos com paleta por barra. */
  palette?: string[];
};

export type Series = {
  labels: string[];
  datasets: Dataset[];
};

// ── Eleições multi-cargo (NOC) ──
export type RaceId = "presidente" | "senador" | "dep-federal" | "dep-estadual";

export type RaceCandidate = {
  nome: string;
  partido: string;
  intencao: number;
  rejeicao: number;
  cor: string;
};

// ── Prioridades da população / Raio-X ──
export type Priority = {
  tema: string;
  /** Quanto a população demanda o tema (0–100). */
  demanda: number;
  /** Quanto endereçar o tema converte em voto (0–100). */
  potencialVotos: number;
  /** Satisfação atual da população com o tema (0–100). */
  satisfacaoAtual: number;
  /** Urgência percebida (0–100) — usada como tamanho de bolha. */
  urgencia: number;
};

/** Ponto da matriz Raio-X já com o índice de oportunidade calculado. */
export type MatrixPoint = Priority & {
  /** demanda × potencialVotos × (100 − satisfação), normalizado 0–100. */
  oportunidade: number;
};

/** Valor que oscila "ao vivo" na NOC. */
export type LiveTick = {
  label: string;
  valor: number;
  unidade: string;
  cor: string;
};
