import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { appendRecord, readRecords } from "@/lib/store";

const STORE = "respostas";
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }
  const respostas = await readRecords(STORE);
  const respondentes = new Set(respostas.map((r) => String(r.contato || r.id)))
    .size;
  return NextResponse.json(
    { respostas, total: respostas.length, respondentes },
    { headers: noStore },
  );
}

export async function POST(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }

  const body = await request.json().catch(() => ({}));
  const pergunta = typeof body?.pergunta === "string" ? body.pergunta : "";
  const resposta =
    typeof body?.resposta === "string" ? body.resposta.trim() : "";
  const contato = typeof body?.contato === "string" ? body.contato.trim() : "";
  const regiao = typeof body?.regiao === "string" ? body.regiao : "";

  if (!pergunta || !resposta) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400, headers: noStore },
    );
  }

  const entry = await appendRecord(STORE, "resp", {
    pergunta,
    resposta,
    contato,
    regiao,
    por: session.sub ?? "operador",
  });
  return NextResponse.json({ saved: true, entry }, { headers: noStore });
}
