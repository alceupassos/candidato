import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

export type MotionReportProps = {
  candidate: string;
  regiao: string;
  metrics: { label: string; value: string; color: string }[];
};

function Metric({
  label,
  value,
  color,
  index,
}: {
  label: string;
  value: string;
  color: string;
  index: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - index * 6,
    fps,
    config: { damping: 16 },
  });
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: "28px 26px",
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
        opacity: enter,
      }}
    >
      <div
        style={{
          fontSize: 22,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 70, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

export function MotionReport({
  candidate,
  regiao,
  metrics,
}: MotionReportProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const glow = interpolate(frame % 90, [0, 45, 90], [0.25, 0.55, 0.25]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1200px 500px at 20% -10%, rgba(34,197,94,0.22), transparent), linear-gradient(150deg, rgba(7,20,12,0.86) 0%, rgba(12,12,22,0.9) 55%, rgba(5,17,31,0.92) 100%), url(/ai/motion-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#f8fafc",
        fontFamily: "Inter, Arial, sans-serif",
        padding: 56,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: "#22c55e",
            boxShadow: `0 0 ${20 * glow * 4}px #22c55e`,
          }}
        />
        <div
          style={{
            fontSize: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#22c55e",
          }}
        >
          NOC ao Vivo · 2026
        </div>
      </div>

      <div
        style={{
          marginTop: 30,
          transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
          opacity: enter,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1 }}>
          {candidate}
        </div>
        <div style={{ marginTop: 12, fontSize: 34, color: "#cbd5e1" }}>
          Raio-X da campanha · {regiao}
        </div>
      </div>

      <Sequence from={12}>
        <div style={{ display: "flex", gap: 20, marginTop: 54 }}>
          {metrics.slice(0, 4).map((m, i) => (
            <Metric key={m.label} {...m} index={i} />
          ))}
        </div>
      </Sequence>

      <div style={{ marginTop: "auto", fontSize: 24, color: "#94a3b8" }}>
        Dados demonstrativos · atualização contínua
      </div>
    </AbsoluteFill>
  );
}
