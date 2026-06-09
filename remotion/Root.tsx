import { Composition } from "remotion";

import { WeeklyCampaignVideo } from "./WeeklyCampaignVideo";
import { MotionReport } from "./MotionReport";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="CampaignWeeklyVideo"
        component={WeeklyCampaignVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          candidate: "Renato Araujo",
          headline: "Resumo semanal da campanha",
          metric: "8.7%",
        }}
      />
      <Composition
        id="MotionReport"
        component={MotionReport}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          candidate: "Renato Araújo",
          regiao: "Todo o RJ",
          metrics: [
            { label: "Intenção", value: "8.7%", color: "#22c55e" },
            { label: "Engajados", value: "12.4k", color: "#8b5cf6" },
            { label: "Cabos", value: "312", color: "#60a5fa" },
            { label: "Oportunidade", value: "Saúde", color: "#f0c030" },
          ],
        }}
      />
    </>
  );
}
