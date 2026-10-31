import { useCallback, useMemo } from "react";
import { networkRoutes } from "../../data/heatNetwork";
import type {
  NetworkMode,
  RouteMetrics,
  SelectionTarget,
  SimulationMetrics,
} from "../../types/digitalTwin";
import { DigitalTwinLabels } from "./DigitalTwinLabels";
import { Environment } from "./Environment";
import { HeatNetwork } from "./HeatNetwork";
import { NetworkNodes } from "./NetworkNodes";
import { RailSiding } from "./RailSiding";
import { RoadNetwork } from "./RoadNetwork";
import { SecondaryFacilities } from "./SecondaryFacilities";
import { Vehicles } from "./Vehicles";
import { Workers } from "./Workers";

interface IndustrialComplexProps {
  metrics: SimulationMetrics;
  routeMetrics: RouteMetrics[];
  /** Routes live in the current mode. */
  activeRouteIds: Set<string>;
  /** Routes the user is pointing at; when set, everything else is dimmed. */
  highlightedRouteIds: Set<string> | null;
  mode: NetworkMode;
  running: boolean;
  speedMultiplier: number;
  hovered: SelectionTarget | null;
  selected: SelectionTarget | null;
  onHover: (target: SelectionTarget | null) => void;
  onSelect: (target: SelectionTarget | null) => void;
}

interface PointerEventLike {
  stopPropagation: () => void;
}

/**
 * The whole estate: ground and planting, the road grid, the supporting tenants, and the
 * HYTERA thermal network laid over the top of it.
 */
export function IndustrialComplex({
  metrics,
  routeMetrics,
  activeRouteIds,
  highlightedRouteIds,
  mode,
  running,
  speedMultiplier,
  hovered,
  selected,
  onHover,
  onSelect,
}: IndustrialComplexProps) {
  const flowSpeed = (metrics.flowRateKgS / 12.5) * speedMultiplier;

  // A route is drawn live when its mode allows it and nothing narrower is highlighted.
  // Pointing at a plant that is idle in the current mode must not blank the whole network,
  // so an empty intersection falls back to whatever the mode already had running.
  const liveRouteIds = useMemo(() => {
    if (!highlightedRouteIds || highlightedRouteIds.size === 0)
      return activeRouteIds;
    const intersection = new Set(
      [...highlightedRouteIds].filter((id) => activeRouteIds.has(id)),
    );
    return intersection.size > 0 ? intersection : activeRouteIds;
  }, [activeRouteIds, highlightedRouteIds]);

  const activeConnectionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const route of networkRoutes) {
      if (!liveRouteIds.has(route.id)) continue;
      route.connectionIds.forEach((id) => ids.add(id));
    }
    return ids;
  }, [liveRouteIds]);

  const activeNodeIds = useMemo(() => {
    const ids = new Set<string>();
    for (const route of networkRoutes) {
      if (!liveRouteIds.has(route.id)) continue;
      ids.add(route.sourceId);
      ids.add(route.receiverId);
    }
    // pump stations and the hub serve the backbone whenever anything is flowing
    if (liveRouteIds.size > 0) {
      ids.add("pump-north");
      ids.add("pump-mid");
      ids.add("pump-south");
      ids.add("hera-hub");
    }
    return ids;
  }, [liveRouteIds]);

  const bind = useCallback(
    (target: SelectionTarget) => ({
      onPointerOver: (e: PointerEventLike) => {
        e.stopPropagation();
        onHover(target);
      },
      onPointerOut: (e: PointerEventLike) => {
        e.stopPropagation();
        onHover(null);
      },
      onClick: (e: PointerEventLike) => {
        e.stopPropagation();
        onSelect(target);
      },
    }),
    [onHover, onSelect],
  );

  return (
    <>
      <Environment />
      <RoadNetwork />

      <Vehicles running={running} speedMultiplier={speedMultiplier} />
      <Workers />
      <RailSiding running={running} speedMultiplier={speedMultiplier} />

      <SecondaryFacilities hovered={hovered} selected={selected} bind={bind} />

      <NetworkNodes
        activeNodeIds={activeNodeIds}
        hovered={hovered}
        selected={selected}
        running={running}
        bind={bind}
      />

      <HeatNetwork
        running={running}
        flowSpeed={flowSpeed}
        activeConnectionIds={activeConnectionIds}
        hovered={hovered}
        selected={selected}
        bind={bind}
      />

      <DigitalTwinLabels
        metrics={metrics}
        routeMetrics={routeMetrics}
        activeRouteIds={activeRouteIds}
        mode={mode}
      />
    </>
  );
}
