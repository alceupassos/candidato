import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { appendRecord, readRecords, updateRecord } from "@/lib/store";

const STORE = "crm-contacts";
const noStore = { "Cache-Control": "no-store" };

export const STAGES = ["lead", "comprometido", "multiplicador"] as const;
type Stage = (typeof STAGES)[number];

export async function GET(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }
  const contacts = await readRecords(STORE);
  const counts = STAGES.reduce<Record<string, number>>((acc, stage) => {
    acc[stage] = contacts.filter((c) => c.stage === stage).length;
    return acc;
  }, {});
  return NextResponse.json({ contacts, counts }, { headers: noStore });
}

export async function POST(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }

  const body = await request.json().catch(() => ({}));
  const nome = typeof body?.nome === "string" ? body.nome.trim() : "";
  const cidade = typeof body?.cidade === "string" ? body.cidade.trim() : "";
  const whatsapp =
    typeof body?.whatsapp === "string" ? body.whatsapp.trim() : "";
  const stage: Stage = STAGES.includes(body?.stage) ? body.stage : "lead";

  if (!nome || !cidade) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400, headers: noStore },
    );
  }

  const entry = await appendRecord(STORE, "crm", {
    nome,
    cidade,
    whatsapp,
    stage,
  });
  return NextResponse.json({ saved: true, entry }, { headers: noStore });
}

export async function PATCH(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }

  const body = await request.json().catch(() => ({}));
  const id = typeof body?.id === "string" ? body.id : "";
  const stage = body?.stage;
  if (!id || !STAGES.includes(stage)) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400, headers: noStore },
    );
  }

  const updated = await updateRecord(STORE, id, { stage });
  if (!updated) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404, headers: noStore },
    );
  }
  return NextResponse.json({ updated }, { headers: noStore });
}
