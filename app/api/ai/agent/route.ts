import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { aiChat } from "@/lib/ai/client";

const noStore = { "Cache-Control": "no-store" };

const SYSTEM = `Você é o agente de relacionamento de uma campanha eleitoral no Rio de Janeiro.
Responda em português do Brasil, tom caloroso, respeitoso e objetivo (máx. 4 frases).
Foque em mobilizar, esclarecer e encaminhar o eleitor para cadastro, grupo de WhatsApp ou agenda.
Nunca invente dados oficiais; seja transparente que é um contato de campanha.`;

export async function POST(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }

  const body = await request.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const regiao = typeof body?.regiao === "string" ? body.regiao : "";
  const persona = typeof body?.persona === "string" ? body.persona : "";

  if (!prompt) {
    return NextResponse.json(
      { error: "empty_prompt" },
      { status: 400, headers: noStore },
    );
  }

  const context = [
    regiao && `Região: ${regiao}.`,
    persona && `Perfil do eleitor: ${persona}.`,
  ]
    .filter(Boolean)
    .join(" ");

  const result = await aiChat(
    [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: context ? `${context}\n\nMensagem: ${prompt}` : prompt,
      },
    ],
    { temperature: 0.7, maxTokens: 300 },
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, provider: result.provider },
      { status: 502, headers: noStore },
    );
  }

  return NextResponse.json(
    { ok: true, reply: result.text, provider: result.provider },
    { headers: noStore },
  );
}
