"use client";

import { useEffect, useRef } from "react";

type EChartProps = {
  /** Objeto `option` do ECharts. */
  option: Record<string, unknown>;
  /** Carrega echarts-gl (necessário para séries 3D). */
  use3D?: boolean;
  height?: number | string;
  className?: string;
  /** Callback quando o usuário clica numa série (ex.: tile do mapa). */
  onSelect?: (name: string) => void;
};

// Carregamento client-only via import dinâmico (evita SSR do echarts-gl).
export function EChart({
  option,
  use3D,
  height = 280,
  className,
  onSelect,
}: EChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Instância do ECharts (tipada como unknown para não acoplar tipos pesados).
  const chartRef = useRef<{
    setOption: (o: unknown, replace?: boolean) => void;
    resize: () => void;
    dispose: () => void;
    on: (e: string, cb: (p: { name?: string }) => void) => void;
  } | null>(null);
  // Mantém option/onSelect atuais sem escrever refs durante o render.
  const latest = useRef({ option, onSelect });
  useEffect(() => {
    latest.current = { option, onSelect };
  });

  useEffect(() => {
    let disposed = false;
    let ro: ResizeObserver | null = null;
    (async () => {
      const echarts = await import("echarts");
      if (use3D) await import("echarts-gl");
      if (disposed || !ref.current) return;
      const inst = echarts.init(ref.current, undefined, { renderer: "canvas" });
      chartRef.current = inst as unknown as typeof chartRef.current;
      inst.setOption(latest.current.option);
      inst.on("click", (params: { name?: string }) => {
        if (params?.name) latest.current.onSelect?.(params.name);
      });
      ro = new ResizeObserver(() => inst.resize());
      ro.observe(ref.current);
    })();
    return () => {
      disposed = true;
      ro?.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [use3D]);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return (
    <div ref={ref} className={className} style={{ width: "100%", height }} />
  );
}
