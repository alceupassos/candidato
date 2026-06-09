// Dataset mockado das 8 regiões de governo do Estado do Rio de Janeiro.
// Recorte da campanha federal de Renato Araújo (PL) — base na Costa Verde.
// Números são fictícios, porém plausíveis (eleição de outubro/2026).

import type { Region, RegionId } from "./types";

export const REGIONS: Region[] = [
  {
    id: "metropolitana",
    nome: "Metropolitana",
    apelido: "Capital + Grande Rio",
    intencaoVoto: 3.4,
    posicao: 9,
    cabos: 86,
    cobertura: 41,
    sentimento: { positivo: 58, neutro: 27, negativo: 15 },
    escala: 1,
    municipios: [
      { nome: "Rio de Janeiro", eleitorado: 4_960_000, cobertura: 38 },
      { nome: "São Gonçalo", eleitorado: 780_000, cobertura: 44 },
      { nome: "Duque de Caxias", eleitorado: 640_000, cobertura: 47 },
      { nome: "Nova Iguaçu", eleitorado: 590_000, cobertura: 42 },
      { nome: "Niterói", eleitorado: 400_000, cobertura: 51 },
      { nome: "Belford Roxo", eleitorado: 360_000, cobertura: 39 },
    ],
    bairrosDestaque: [
      { nome: "Campo Grande", valor: 49 },
      { nome: "Bangu", valor: 44 },
      { nome: "Santa Cruz", valor: 41 },
      { nome: "Centro (Niterói)", valor: 55 },
      { nome: "Alcântara (SG)", valor: 47 },
      { nome: "Jardim Primavera", valor: 38 },
    ],
  },
  {
    id: "costa-verde",
    nome: "Costa Verde",
    apelido: "Base — Angra & litoral sul",
    intencaoVoto: 21.6,
    posicao: 1,
    cabos: 96,
    cobertura: 84,
    sentimento: { positivo: 78, neutro: 14, negativo: 8 },
    escala: 1.18,
    municipios: [
      { nome: "Angra dos Reis", eleitorado: 158_000, cobertura: 88 },
      { nome: "Itaguaí", eleitorado: 96_000, cobertura: 52 },
      { nome: "Mangaratiba", eleitorado: 38_000, cobertura: 63 },
      { nome: "Paraty", eleitorado: 34_000, cobertura: 71 },
      { nome: "Rio Claro", eleitorado: 14_000, cobertura: 58 },
      { nome: "Seropédica", eleitorado: 62_000, cobertura: 49 },
    ],
    bairrosDestaque: [
      { nome: "Centro", valor: 91 },
      { nome: "Perequê", valor: 86 },
      { nome: "Mambucaba", valor: 82 },
      { nome: "Frade", valor: 78 },
      { nome: "Japuíba", valor: 69 },
      { nome: "Cunhambebe", valor: 61 },
      { nome: "Balneário", valor: 55 },
      { nome: "Monte Verde", valor: 48 },
      { nome: "Bracuí", valor: 38 },
    ],
  },
  {
    id: "baixadas-litoraneas",
    nome: "Baixadas Litorâneas",
    apelido: "Região dos Lagos",
    intencaoVoto: 6.2,
    posicao: 5,
    cabos: 38,
    cobertura: 49,
    sentimento: { positivo: 64, neutro: 24, negativo: 12 },
    escala: 0.86,
    municipios: [
      { nome: "Cabo Frio", eleitorado: 180_000, cobertura: 54 },
      { nome: "Maricá", eleitorado: 130_000, cobertura: 47 },
      { nome: "Araruama", eleitorado: 100_000, cobertura: 51 },
      { nome: "Saquarema", eleitorado: 78_000, cobertura: 44 },
      { nome: "Rio das Ostras", eleitorado: 100_000, cobertura: 46 },
      { nome: "Búzios", eleitorado: 26_000, cobertura: 58 },
    ],
    bairrosDestaque: [
      { nome: "Centro (Cabo Frio)", valor: 58 },
      { nome: "Tamoios", valor: 51 },
      { nome: "Itaipuaçu", valor: 47 },
      { nome: "Bacaxá", valor: 44 },
      { nome: "Praia Seca", valor: 42 },
      { nome: "Manguinhos", valor: 49 },
    ],
  },
  {
    id: "serrana",
    nome: "Serrana",
    apelido: "Região Serrana",
    intencaoVoto: 5.1,
    posicao: 6,
    cabos: 31,
    cobertura: 44,
    sentimento: { positivo: 61, neutro: 27, negativo: 12 },
    escala: 0.78,
    municipios: [
      { nome: "Petrópolis", eleitorado: 240_000, cobertura: 48 },
      { nome: "Teresópolis", eleitorado: 140_000, cobertura: 45 },
      { nome: "Nova Friburgo", eleitorado: 150_000, cobertura: 43 },
      { nome: "Três Rios", eleitorado: 64_000, cobertura: 41 },
      { nome: "Guapimirim", eleitorado: 44_000, cobertura: 39 },
    ],
    bairrosDestaque: [
      { nome: "Centro (Petrópolis)", valor: 52 },
      { nome: "Itaipava", valor: 49 },
      { nome: "Alto", valor: 46 },
      { nome: "Várzea", valor: 44 },
      { nome: "Olaria", valor: 41 },
      { nome: "Conselheiro Paulino", valor: 43 },
    ],
  },
  {
    id: "norte-fluminense",
    nome: "Norte Fluminense",
    apelido: "Campos & Macaé",
    intencaoVoto: 4.7,
    posicao: 7,
    cabos: 28,
    cobertura: 42,
    sentimento: { positivo: 59, neutro: 28, negativo: 13 },
    escala: 0.74,
    municipios: [
      { nome: "Campos dos Goytacazes", eleitorado: 360_000, cobertura: 45 },
      { nome: "Macaé", eleitorado: 180_000, cobertura: 47 },
      { nome: "São João da Barra", eleitorado: 30_000, cobertura: 40 },
      { nome: "Quissamã", eleitorado: 18_000, cobertura: 38 },
      { nome: "Carapebus", eleitorado: 12_000, cobertura: 36 },
    ],
    bairrosDestaque: [
      { nome: "Centro (Campos)", valor: 48 },
      { nome: "Pelinca", valor: 51 },
      { nome: "Parque Tamandaré", valor: 44 },
      { nome: "Imbetiba (Macaé)", valor: 47 },
      { nome: "Cavaleiros", valor: 45 },
      { nome: "Guarus", valor: 41 },
    ],
  },
  {
    id: "noroeste-fluminense",
    nome: "Noroeste Fluminense",
    apelido: "Itaperuna & região",
    intencaoVoto: 4.2,
    posicao: 8,
    cabos: 22,
    cobertura: 39,
    sentimento: { positivo: 57, neutro: 29, negativo: 14 },
    escala: 0.69,
    municipios: [
      { nome: "Itaperuna", eleitorado: 84_000, cobertura: 43 },
      { nome: "Santo Antônio de Pádua", eleitorado: 34_000, cobertura: 40 },
      { nome: "Bom Jesus do Itabapoana", eleitorado: 30_000, cobertura: 39 },
      { nome: "Miracema", eleitorado: 22_000, cobertura: 37 },
      { nome: "Porciúncula", eleitorado: 15_000, cobertura: 36 },
    ],
    bairrosDestaque: [
      { nome: "Centro (Itaperuna)", valor: 45 },
      { nome: "Cidade Nova", valor: 41 },
      { nome: "Niterói (bairro)", valor: 39 },
      { nome: "Aeroporto", valor: 38 },
      { nome: "Presidente Costa e Silva", valor: 37 },
      { nome: "Vinhosa", valor: 36 },
    ],
  },
  {
    id: "medio-paraiba",
    nome: "Médio Paraíba",
    apelido: "Volta Redonda & Resende",
    intencaoVoto: 5.6,
    posicao: 4,
    cabos: 34,
    cobertura: 46,
    sentimento: { positivo: 62, neutro: 26, negativo: 12 },
    escala: 0.82,
    municipios: [
      { nome: "Volta Redonda", eleitorado: 210_000, cobertura: 49 },
      { nome: "Barra Mansa", eleitorado: 140_000, cobertura: 47 },
      { nome: "Resende", eleitorado: 100_000, cobertura: 48 },
      { nome: "Barra do Piraí", eleitorado: 70_000, cobertura: 43 },
      { nome: "Pinheiral", eleitorado: 18_000, cobertura: 41 },
    ],
    bairrosDestaque: [
      { nome: "Aterrado (VR)", valor: 51 },
      { nome: "Vila Santa Cecília", valor: 49 },
      { nome: "Centro (Barra Mansa)", valor: 47 },
      { nome: "Comércio (Resende)", valor: 48 },
      { nome: "Retiro", valor: 44 },
      { nome: "Jardim Amália", valor: 43 },
    ],
  },
  {
    id: "centro-sul",
    nome: "Centro-Sul Fluminense",
    apelido: "Vassouras & Três Rios",
    intencaoVoto: 4.4,
    posicao: 7,
    cabos: 19,
    cobertura: 40,
    sentimento: { positivo: 58, neutro: 28, negativo: 14 },
    escala: 0.71,
    municipios: [
      { nome: "Vassouras", eleitorado: 28_000, cobertura: 44 },
      { nome: "Paraíba do Sul", eleitorado: 34_000, cobertura: 41 },
      { nome: "Paty do Alferes", eleitorado: 22_000, cobertura: 39 },
      {
        nome: "Engenheiro Paulo de Frontin",
        eleitorado: 11_000,
        cobertura: 38,
      },
      { nome: "Miguel Pereira", eleitorado: 21_000, cobertura: 40 },
    ],
    bairrosDestaque: [
      { nome: "Centro (Vassouras)", valor: 46 },
      { nome: "Sebastião Lacerda", valor: 41 },
      { nome: "Werneck", valor: 40 },
      { nome: "Avelar", valor: 39 },
      { nome: "Arcozelo", valor: 38 },
      { nome: "Governador Portela", valor: 37 },
    ],
  },
];

export function getRegion(id: RegionId): Region | null {
  if (id === "all") return null;
  return REGIONS.find((region) => region.id === id) ?? null;
}

export function regionEleitorado(region: Region): number {
  return region.municipios.reduce((sum, m) => sum + m.eleitorado, 0);
}

/** Eleitorado total mapeado no estado (todas as regiões). */
export function totalEleitorado(): number {
  return REGIONS.reduce((sum, region) => sum + regionEleitorado(region), 0);
}

/** Intenção de voto média ponderada pelo eleitorado (visão "todo o RJ"). */
export function intencaoMediaEstadual(): number {
  const totalVotos = REGIONS.reduce(
    (sum, region) => sum + region.intencaoVoto * regionEleitorado(region),
    0,
  );
  return Number((totalVotos / totalEleitorado()).toFixed(1));
}

/** Lista de regiões para o seletor (inclui a opção "Todo o RJ"). */
export const REGION_OPTIONS: { id: RegionId; nome: string; apelido: string }[] =
  [
    { id: "all", nome: "Todo o RJ", apelido: "Estado consolidado" },
    ...REGIONS.map((r) => ({
      id: r.id as RegionId,
      nome: r.nome,
      apelido: r.apelido,
    })),
  ];
