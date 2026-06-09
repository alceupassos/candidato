// Cliente de IA (texto) — usa provedores reais via chaves do .env.
// OpenAI-compatível: DeepSeek, xAI/Grok e OpenAI. Server-only.

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type Provider = {
  name: string;
  url: string;
  key: string | undefined;
  model: string;
};

function providers(): Provider[] {
  return [
    {
      name: "deepseek",
      url: "https://api.deepseek.com/chat/completions",
      key: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL_CHAT || "deepseek-chat",
    },
    {
      name: "grok",
      url: "https://api.x.ai/v1/chat/completions",
      key: process.env.GROK_API_KEY || process.env.XAI_API_KEY,
      model: process.env.GROKAI_MODEL || "grok-2-latest",
    },
    {
      name: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      key: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
    },
  ];
}

/** Ordena os provedores com chave: AI_PROVIDER primeiro, depois o resto. */
function orderedProviders(): Provider[] {
  const list = providers().filter((p) => p.key);
  const preferred = process.env.AI_PROVIDER?.toLowerCase();
  if (!preferred) return list;
  return [
    ...list.filter((p) => p.name === preferred),
    ...list.filter((p) => p.name !== preferred),
  ];
}

export function aiAvailable(): boolean {
  return orderedProviders().length > 0;
}

export type ChatResult = {
  text: string;
  provider: string;
  ok: boolean;
  error?: string;
};

async function callOne(
  provider: Provider,
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number },
): Promise<ChatResult> {
  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.key}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages,
        temperature: opts.temperature ?? 0.6,
        max_tokens: opts.maxTokens ?? 600,
        stream: false,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        text: "",
        provider: provider.name,
        ok: false,
        error: `http_${res.status}:${detail.slice(0, 160)}`,
      };
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { text, provider: provider.name, ok: Boolean(text) };
  } catch (err) {
    return {
      text: "",
      provider: provider.name,
      ok: false,
      error: String(err).slice(0, 160),
    };
  }
}

/** Chat completion com fallback automático entre provedores. */
export async function aiChat(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {},
): Promise<ChatResult> {
  const list = orderedProviders();
  if (list.length === 0) {
    return { text: "", provider: "none", ok: false, error: "no_api_key" };
  }

  let last: ChatResult = {
    text: "",
    provider: "none",
    ok: false,
    error: "no_provider",
  };
  for (const provider of list) {
    last = await callOne(provider, messages, opts);
    if (last.ok) return last;
  }
  return last;
}
