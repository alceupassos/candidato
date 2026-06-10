import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { aiChat } from "@/lib/ai/client";

const noStore = { "Cache-Control": "no-store" };

// Insights determinísticos por seção (usados quando a IA não responde).
const HEURISTICAS: Record<string, string[]> = {
  dashboard: [
    "Concentre o esforço nas 3 regiões de maior voto esperado; cada ponto de cobertura ali rende mais que uma nova praça.",
    "A intenção sobe onde a cobertura passa de 70%. Priorize fechar a cobertura nas praças médias antes de abrir frentes novas.",
  ],
  noc: [
    "O líder presidencial puxa o discurso nacional, mas o voto local se decide no tema dominante da sua região. Alinhe os dois.",
    "Acompanhe a virada semanal: quem cresce em rejeição baixa é a real ameaça, não quem só tem intenção alta.",
  ],
  raiox: [
    "Fale do tema de maior oportunidade da região (alta demanda + baixa satisfação). É onde a mensagem converte voto mais rápido.",
    "Evite temas já saturados de satisfação alta — repetir o óbvio não move o eleitor indeciso.",
  ],
  meta: [
    "O gargalo está na conversão de cadastrado para engajado. Acione o QR nas comunidades para fechar o funil.",
    "Seu déficit de meta se concentra em poucas regiões. Realoque cabos para essas praças nas próximas duas semanas.",
  ],
  social: [
    "Engajamento positivo alto com crescimento indica espaço para amplificar. Replique os formatos que mais retêm.",
    "Onde o negativo cresce, responda com transparência rápida — silêncio vira narrativa do adversário.",
  ],
  territorios: [
    "Bairros com cobertura abaixo de 50% e eleitorado alto são o melhor retorno por real investido. Comece por eles.",
    "Use o mapa para cruzar cobertura baixa com tema sensível: ali a visita de campo vale por dez posts.",
  ],
  pesquisas: [
    "Dispare a próxima pesquisa para a base que menos respondeu — o dado que falta vale mais que confirmar o que já sabe.",
    "Compare ondas: variação dentro da margem não é tendência. Aja sobre movimentos consistentes em 2+ ondas.",
  ],
};

function heuristica(section: string, context: string): string {
  const arr = HEURISTICAS[section] ?? [
    "Priorize a ação com maior retorno por esforço e meça o resultado na próxima semana.",
  ];
  let h = 0;
  const s = section + context;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return arr[h % arr.length];
}

export async function POST(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }
  const body = await request.json().catch(() => ({}));
  const section = typeof body?.section === "string" ? body.section : "geral";
  const context = typeof body?.context === "string" ? body.context : "";

  let insight = "";
  try {
    const res = await aiChat(
      [
        {
          role: "system",
          content:
            "Você é um estrategista eleitoral sênior. Responda em português do Brasil, com 1 a 2 frases curtas, diretas e acionáveis. Sem saudações, sem rótulos, apenas o conselho.",
        },
        {
          role: "user",
          content: `Seção do painel: ${section}. Contexto: ${context}. Dê um insight estratégico específico para a campanha agora.`,
        },
      ],
      { temperature: 0.6, maxTokens: 120 },
    );
    if (res.ok && res.text.trim()) insight = res.text.trim();
  } catch {
    /* cai no fallback */
  }
  if (!insight) insight = heuristica(section, context);

  // Nunca expõe o provedor de IA.
  return NextResponse.json({ insight }, { headers: noStore });
}
