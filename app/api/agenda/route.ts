import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { appendRecord, readRecords } from "@/lib/store";

const STORE = "agenda-events";
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }
  const events = await readRecords(STORE);
  return NextResponse.json({ events }, { headers: noStore });
}

export async function POST(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }

  const body = await request.json().catch(() => ({}));
  const titulo = typeof body?.titulo === "string" ? body.titulo.trim() : "";
  const data = typeof body?.data === "string" ? body.data : "";
  const local = typeof body?.local === "string" ? body.local.trim() : "";
  const tipo = typeof body?.tipo === "string" ? body.tipo : "Comício";

  if (!titulo || !data) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400, headers: noStore },
    );
  }

  const entry = await appendRecord(STORE, "evt", { titulo, data, local, tipo });
  return NextResponse.json({ saved: true, entry }, { headers: noStore });
}
