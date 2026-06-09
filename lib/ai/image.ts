// Geração de imagens reais (server-only). Tenta Gemini (nano-banana) e cai
// para OpenAI gpt-image-1. Salva PNG em public/ai/ e cacheia por nome.

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "ai");

const GEMINI_MODELS = [
  "gemini-3-pro-image-preview",
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
];

export type ImageResult = {
  ok: boolean;
  path?: string;
  provider?: string;
  cached?: boolean;
  error?: string;
};

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function tryGemini(
  prompt: string,
): Promise<{ b64: string; model: string } | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["IMAGE"] },
          }),
        },
      );
      if (!res.ok) continue;
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const img = parts.find(
        (p: { inlineData?: { data?: string } }) => p?.inlineData?.data,
      );
      if (img?.inlineData?.data) return { b64: img.inlineData.data, model };
    } catch {
      /* tenta o próximo modelo */
    }
  }
  return null;
}

async function tryOpenAI(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        n: 1,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0]?.b64_json ?? null;
  } catch {
    return null;
  }
}

/** Gera (ou reaproveita) uma imagem PNG em public/ai/<name>.png. */
export async function generateImage(
  prompt: string,
  name: string,
): Promise<ImageResult> {
  const safe = name.replace(/[^a-z0-9-_]/gi, "-");
  const outPath = path.join(OUT_DIR, `${safe}.png`);
  const publicPath = `/ai/${safe}.png`;

  if (await fileExists(outPath)) {
    return { ok: true, path: publicPath, cached: true };
  }

  await mkdir(OUT_DIR, { recursive: true });

  const gem = await tryGemini(prompt);
  if (gem) {
    await writeFile(outPath, Buffer.from(gem.b64, "base64"));
    return { ok: true, path: publicPath, provider: `gemini:${gem.model}` };
  }

  const oai = await tryOpenAI(prompt);
  if (oai) {
    await writeFile(outPath, Buffer.from(oai, "base64"));
    return { ok: true, path: publicPath, provider: "openai:gpt-image-1" };
  }

  return { ok: false, error: "all_providers_failed" };
}
