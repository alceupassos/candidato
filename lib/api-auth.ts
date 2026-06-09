// Guarda de sessão reutilizável para as rotas de API dos MVPs.
// Mesma lógica do app/api/auth/session/route.ts (JWT + checagem de IP
// para credenciais provisórias), num único helper.

import type { NextRequest } from "next/server";

import { getAuthCookieName, getClientIp, verifyJwt } from "@/lib/auth";

export type SessionPayload = NonNullable<ReturnType<typeof verifyJwt>>;

/** Retorna o payload do JWT se a sessão for válida, senão null. */
export function getSession(request: NextRequest): SessionPayload | null {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return null;

  const payload = verifyJwt(token);
  if (!payload) return null;

  const requiresSameIp = payload.credentialType !== "main";
  if (requiresSameIp && payload.ip !== getClientIp(request.headers)) {
    return null;
  }
  return payload;
}
