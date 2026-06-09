import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { appendAccessLog } from "@/lib/access-log";
import { appendRecord, readRecords } from "@/lib/store";
import { WHATSAPP_GROUPS } from "@/lib/mock/campaign-metrics";

const STORE = "messages";
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }
  const messages = await readRecords(STORE);
  return NextResponse.json({ messages }, { headers: noStore });
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
  const groupId = typeof body?.groupId === "string" ? body.groupId : "";
  const channel = typeof body?.channel === "string" ? body.channel : "WhatsApp";
  const templateId =
    typeof body?.templateId === "string" ? body.templateId : null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const scheduledFor =
    typeof body?.scheduledFor === "string" && body.scheduledFor
      ? body.scheduledFor
      : null;

  const group = WHATSAPP_GROUPS.find((g) => g.id === groupId);
  if (!group || !text) {
    return NextResponse.json(
      {
        error: "invalid_payload",
        reason: !group ? "unknown_group" : "empty_text",
      },
      { status: 400, headers: noStore },
    );
  }

  // Envio simulado: nenhum provedor externo é acionado.
  const status = scheduledFor ? "agendada" : "enviada";
  const entry = await appendRecord(STORE, "msg", {
    channel,
    templateId,
    groupId: group.id,
    groupName: group.nome,
    regiao: group.regiao,
    recipientCount: group.membros,
    text,
    status,
    scheduledFor,
    sentBy: session.sub ?? "operador",
  });

  await appendAccessLog(request.headers, {
    event: "message_dispatch",
    path: "/api/messages",
    metadata: {
      messageId: entry.id,
      groupId: group.id,
      recipientCount: group.membros,
      status,
    },
  });

  return NextResponse.json({ saved: true, entry }, { headers: noStore });
}
