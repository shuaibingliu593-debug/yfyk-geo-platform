import { geoServiceFlowSteps } from "@/lib/content/geo-service-flow";
import { GeoServiceFlowStage } from "@/components/ui/GeoServiceFlowStage";
import { GeoServiceFlowStack } from "@/components/ui/GeoServiceFlowStack";

export function GeoServiceFlow({ summary }: { summary: string }) {
  return (
    <div
      className="geo-service-flow-inner"
      data-ai-chunk="geo-service-flow"
      data-ai-summary={summary}
    >
      <GeoServiceFlowStage />

      <div className="shell">
        <GeoServiceFlowStack steps={geoServiceFlowSteps} />
      </div>
    </div>
  );
}
