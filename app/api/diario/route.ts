import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { appendRecord, readRecords } from "@/lib/store";

const STORE = "diario";
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }
  const entries = await readRecords(STORE);
  return NextResponse.json({ entries }, { headers: noStore });
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
  const texto = typeof body?.texto === "string" ? body.texto.trim() : "";
  const local = typeof body?.local === "string" ? body.local.trim() : "";
  const categoria =
    typeof body?.categoria === "string" ? body.categoria : "Campo";

  if (!texto) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400, headers: noStore },
    );
  }

  const entry = await appendRecord(STORE, "log", {
    texto,
    local,
    categoria,
    autor: session.sub ?? "operador",
  });
  return NextResponse.json({ saved: true, entry }, { headers: noStore });
}
