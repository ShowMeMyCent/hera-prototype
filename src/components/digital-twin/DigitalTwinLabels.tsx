import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import {
  EXCHANGER_ANCHOR,
  networkNodes,
  networkRoutes,
} from "../../data/heatNetwork";
import type {
  NetworkMode,
  RouteMetrics,
  SimulationMetrics,
} from "../../types/digitalTwin";
import { FloatingDataLabel } from "./FloatingDataLabel";

interface DigitalTwinLabelsProps {
  metrics: SimulationMetrics;
  routeMetrics: RouteMetrics[];
  activeRouteIds: Set<string>;
  mode: NetworkMode;
}

/** Label height above a node, scaled roughly with how large the facility is. */
const LABEL_HEIGHT: Record<string, number> = {
  source: 7.4,
  receiver: 6.4,
  hub: 5.4,
};

/**
 * Persistent labels for the network's facilities. In Single Pair mode only the primary
 * pair and the exchange station are labelled; Network Overview labels every source and
 * receiver so the whole backbone can be read at a glance. Pumps and the supporting
 * tenants stay unlabelled — their figures live in the hover/click inspector.
 */
export function DigitalTwinLabels({
  metrics,
  routeMetrics,
  activeRouteIds,
  mode,
}: DigitalTwinLabelsProps) {
  // Mounting an Html portal while GLBs are still streaming in (or during the Canvas's very
  // first commit) races drei's Html and silently drops the mount, so hold them back until
  // loading has settled and a couple of frames have passed.
  const { active, progress } = useProgress();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (active || progress < 100) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [active, progress]);

  if (!ready) return null;

  const labelled = networkNodes.filter((node) => {
    if (node.kind === "hub") return true;
    if (node.kind !== "source" && node.kind !== "receiver") return false;
    const route = networkRoutes.find(
      (r) => r.sourceId === node.id || r.receiverId === node.id,
    );
    return route ? activeRouteIds.has(route.id) : false;
  });

  return (
    <>
      {labelled.map((node) => {
        if (node.kind === "hub") {
          return (
            <FloatingDataLabel
              key={node.id}
              position={[
                node.position[0] + 1,
                LABEL_HEIGHT.hub,
                node.position[2] + 1.4,
              ]}
              title="HERA Control Hub"
              subtitle="Digital Twin Control Center"
              tone="neutral"
            />
          );
        }

        const route = networkRoutes.find(
          (r) => r.sourceId === node.id || r.receiverId === node.id,
        );
        const routeMetric = routeMetrics.find((r) => r.routeId === route?.id);
        const m = routeMetric?.metrics ?? metrics;
        const isSource = node.kind === "source";

        return (
          <FloatingDataLabel
            key={node.id}
            position={[
              node.position[0],
              LABEL_HEIGHT[node.kind],
              node.position[2],
            ]}
            title={isSource ? "Heat Source" : "Heat Receiver"}
            value={`${(isSource ? m.sourceTemperatureC : m.receiverTemperatureC).toFixed(1)}°C`}
            subtitle={node.name}
            tone={isSource ? "hot" : "cold"}
          />
        );
      })}

      <FloatingDataLabel
        position={[EXCHANGER_ANCHOR[0] - 1.6, 4.8, EXCHANGER_ANCHOR[2] - 1.4]}
        title="HERA Heat Exchange"
        value={`${metrics.heatTransferredMW.toFixed(2)} MW`}
        subtitle={
          mode === "single"
            ? `${metrics.flowRateKgS.toFixed(1)} kg/s · ${(metrics.efficiency * 100).toFixed(1)}%`
            : `${activeRouteIds.size} rute aktif`
        }
        tone="default"
      />
    </>
  );
}
