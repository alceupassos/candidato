import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@remotion/renderer"],
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  // Não cachear o HTML das páginas do app (os chunks /_next/static seguem
  // imutáveis/hasheados). Garante que cada deploy chegue ao usuário no reload.
  async headers() {
    const noStore = [
      { key: "Cache-Control", value: "no-store, must-revalidate" },
    ];
    return [
      { source: "/", headers: noStore },
      { source: "/log", headers: noStore },
      { source: "/cadastrados", headers: noStore },
      { source: "/mapa", headers: noStore },
    ];
  },
};

export default nextConfig;
