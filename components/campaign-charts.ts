import {
  Chart,
  type ChartConfiguration,
  type ChartType,
  type ScriptableContext,
} from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

import type { RegionId, Series } from "@/lib/mock/types";
import * as M from "@/lib/mock/campaign-metrics";

// Registramos o plugin de datalabels uma vez, porém desligado por padrão —
// cada gráfico habilita explicitamente onde agrega valor.
Chart.register(ChartDataLabels);
Chart.defaults.plugins.datalabels = { display: false } as never;
Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
Chart.defaults.color = "#8a8aaa";

const charts = new Map<string, Chart>();
const GRID = "rgba(255,255,255,0.06)";
const TICK = "#8a8aaa";

const baseAnimation = { duration: 850, easing: "easeOutQuart" as const };

const tooltipStyle = {
  backgroundColor: "rgba(16,16,24,0.95)",
  borderColor: "rgba(255,255,255,0.08)",
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  titleColor: "#f0f0f0",
  bodyColor: "#c9c9da",
  usePadding: true,
};

const legendStyle = {
  display: true,
  position: "bottom" as const,
  labels: {
    color: "#9a9ab2",
    usePointStyle: true,
    pointStyle: "circle" as const,
    boxWidth: 8,
    padding: 14,
    font: { size: 10 },
  },
};

function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith("rgba") || color.startsWith("rgb")) return color;
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function verticalGradient(ctx: ScriptableContext<"line">, color: string) {
  const { chart } = ctx;
  const { ctx: c, chartArea } = chart;
  if (!chartArea) return hexToRgba(color, 0.12);
  const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  grad.addColorStop(0, hexToRgba(color, 0.34));
  grad.addColorStop(1, hexToRgba(color, 0.01));
  return grad;
}

const cartesianScales = {
  x: {
    grid: { color: GRID, drawTicks: false },
    ticks: { color: TICK, font: { size: 10 } },
    border: { display: false },
  },
  y: {
    grid: { color: GRID, drawTicks: false },
    ticks: { color: TICK, font: { size: 10 } },
    border: { display: false },
  },
};

type LineOpts = { area?: boolean; legend?: boolean };

function lineConfig(series: Series, opts: LineOpts = {}): ChartConfiguration {
  const multi = series.datasets.length > 1;
  return {
    type: "line",
    data: {
      labels: series.labels,
      datasets: series.datasets.map((ds) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color,
        backgroundColor: opts.area
          ? (ctx: ScriptableContext<"line">) => verticalGradient(ctx, ds.color)
          : hexToRgba(ds.color, 0.1),
        fill: !!opts.area,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: ds.color,
        pointBorderColor: "rgba(0,0,0,0.25)",
        pointRadius: 0,
        pointHoverRadius: 5,
        spanGaps: true,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: baseAnimation,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: opts.legend || multi ? legendStyle : { display: false },
        tooltip: tooltipStyle,
        datalabels: { display: false },
      },
      scales: cartesianScales,
    },
  };
}

type BarOpts = {
  horizontal?: boolean;
  legend?: boolean;
  datalabels?: boolean;
  stacked?: boolean;
};

function barConfig(series: Series, opts: BarOpts = {}): ChartConfiguration {
  const multi = series.datasets.length > 1;
  return {
    type: "bar",
    data: {
      labels: series.labels,
      datasets: series.datasets.map((ds) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.palette ?? hexToRgba(ds.color, 0.85),
        borderRadius: 5,
        borderSkipped: false,
        maxBarThickness: 46,
      })),
    },
    options: {
      indexAxis: opts.horizontal ? "y" : "x",
      responsive: true,
      maintainAspectRatio: false,
      animation: baseAnimation,
      plugins: {
        legend: opts.legend || multi ? legendStyle : { display: false },
        tooltip: tooltipStyle,
        datalabels: opts.datalabels
          ? {
              display: true,
              anchor: "end",
              align: opts.horizontal ? "right" : "top",
              color: "#c9c9da",
              font: { size: 9, weight: 600 },
              formatter: (v: number) =>
                typeof v === "number" ? v.toLocaleString("pt-BR") : v,
            }
          : { display: false },
      },
      scales: opts.stacked
        ? {
            x: { ...cartesianScales.x, stacked: true },
            y: { ...cartesianScales.y, stacked: true },
          }
        : cartesianScales,
    },
  };
}

function doughnutConfig(series: Series): ChartConfiguration {
  const ds = series.datasets[0];
  return {
    type: "doughnut",
    data: {
      labels: series.labels,
      datasets: [
        {
          data: ds.data,
          backgroundColor: ds.palette ?? [ds.color],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: baseAnimation,
      plugins: {
        legend: legendStyle,
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            label: (item) => ` ${item.label}: ${item.parsed}%`,
          },
        },
        datalabels: { display: false },
      },
    },
  };
}

// Mapa: seção → [ {canvasId, config} ] construído a partir da camada de mock,
// já filtrado pela região ativa.
function buildConfigs(
  sectionId: string,
  region: RegionId,
): { id: string; config: ChartConfiguration }[] {
  switch (sectionId) {
    case "dashboard":
      return [
        {
          id: "cEvolucao",
          config: lineConfig(M.getIntencaoEvolution(region), { area: true }),
        },
        { id: "cFaixa", config: doughnutConfig(M.getFaixaEtaria(region)) },
      ];
    case "pesquisas":
      return [
        {
          id: "cInstitutos",
          config: barConfig(M.getPesquisasInstitutos(region), {
            datalabels: true,
          }),
        },
        {
          id: "cHistPeq",
          config: lineConfig(M.getPesquisasHistorico(region), { legend: true }),
        },
      ];
    case "territorios":
      return [
        {
          id: "cIdade",
          config: barConfig(M.getTerritoriosIdade(region), {
            datalabels: true,
          }),
        },
        {
          id: "cFlutuacao",
          config: lineConfig(M.getFlutuacao(region), { legend: true }),
        },
      ];
    case "concorrentes":
      return [
        {
          id: "cConcor",
          config: barConfig(M.getConcorrentes(region), { legend: true }),
        },
      ];
    case "redes":
      return [
        {
          id: "cRedes",
          config: lineConfig(M.getRedesCrescimento(region), { legend: true }),
        },
        {
          id: "cSentimento",
          config: doughnutConfig(M.getSentimentoRedes(region)),
        },
      ];
    case "diario":
      return [
        { id: "cDiario", config: barConfig(M.getDiarioAtividades(region)) },
      ];
    case "ia":
      return [
        {
          id: "cProjecao",
          config: lineConfig(M.getProjecaoIa(region), { legend: true }),
        },
      ];
    case "demandas":
      return [
        {
          id: "cDemandas",
          config: barConfig(M.getDemandas(region), {
            horizontal: true,
            datalabels: true,
          }),
        },
      ];
    case "financeiro":
      return [
        {
          id: "cExecucao",
          config: lineConfig(M.getFinanceiroExecucao(), {
            area: true,
            legend: true,
          }),
        },
        { id: "cFontes", config: doughnutConfig(M.getFinanceiroFontes()) },
      ];
    case "crm":
      return [
        {
          id: "cCrmMunicipio",
          config: barConfig(M.getCrmMunicipio(region), { legend: true }),
        },
      ];
    case "comunicacao":
      return [
        {
          id: "cEngajamento",
          config: lineConfig(M.getComunicacaoEngajamento(), { legend: true }),
        },
      ];
    case "meta":
      return [
        {
          id: "cMetaRegiao",
          config: barConfig(M.getMetaPorRegiao(), { legend: true }),
        },
      ];
    default:
      return [];
  }
}

export function destroyCharts() {
  charts.forEach((chart) => chart.destroy());
  charts.clear();
}

export function renderSectionCharts(
  sectionId: string,
  region: RegionId = "all",
) {
  destroyCharts();
  const specs = buildConfigs(sectionId, region);
  specs.forEach(({ id, config }) => {
    const element = document.getElementById(id) as HTMLCanvasElement | null;
    if (!element) return;
    charts.set(id, new Chart(element, config as ChartConfiguration<ChartType>));
  });
}
