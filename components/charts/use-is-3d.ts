"use client";

import { useEffect, useState } from "react";

/**
 * True só quando vale a pena renderizar gráficos 3D (echarts-gl):
 * tela larga + WebGL disponível. Começa em `false` (SSR/mobile) e faz
 * upgrade no desktop — celulares ficam com o equivalente 2D.
 */
export function useIs3D(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => {
      const wide = window.innerWidth >= 820;
      let webgl = false;
      try {
        const c = document.createElement("canvas");
        webgl = !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
      } catch {
        webgl = false;
      }
      setOk(wide && webgl);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return ok;
}
