import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/api-auth";
import { generateImage } from "@/lib/ai/image";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: noStore },
    );
  }

  const body = await request.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!prompt || !name) {
    return NextResponse.json(
      { error: "missing_prompt_or_name" },
      { status: 400, headers: noStore },
    );
  }

  const result = await generateImage(prompt, name);
  const status = result.ok ? 200 : 502;
  return NextResponse.json(result, { status, headers: noStore });
}
