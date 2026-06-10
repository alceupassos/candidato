import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { appendAccessLog } from "@/lib/access-log";
import { appendRecord, readRecords } from "@/lib/store";

const STORE = "surveys";
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }
  const surveys = await readRecords(STORE);
  return NextResponse.json({ surveys }, { headers: noStore });
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
  const templateId =
    typeof body?.templateId === "string" ? body.templateId : "";
  const templateNome =
    typeof body?.templateNome === "string" ? body.templateNome : templateId;
  const mode = typeof body?.mode === "string" ? body.mode : "todos";
  const baseId = typeof body?.baseId === "string" ? body.baseId : "";
  const baseNome = typeof body?.baseNome === "string" ? body.baseNome : "";
  const alcance = typeof body?.alcance === "number" ? body.alcance : 0;

  if (!templateId || !baseNome || alcance <= 0) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400, headers: noStore },
    );
  }

  const entry = await appendRecord(STORE, "srv", {
    templateId,
    templateNome,
    canal: "WhatsApp",
    mode,
    baseId,
    baseNome,
    alcance,
    status: "coletando",
    disparadoPor: session.sub ?? "operador",
  });

  await appendAccessLog(request.headers, {
    event: "survey_dispatch",
    path: "/api/surveys",
    metadata: { surveyId: entry.id, templateId, baseNome, alcance },
  });

  return NextResponse.json({ saved: true, entry }, { headers: noStore });
}
