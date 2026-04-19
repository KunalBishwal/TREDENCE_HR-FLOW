import React, { useCallback } from "react";
import {
  getBezierPath,
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
} from "reactflow";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { Trash2 } from "lucide-react";

export type EdgeStyleType = "default" | "dashed" | "dotted" | "thick";
export type EdgeArrowType = "arrow" | "arrowClosed" | "none" | "double";

export interface CustomEdgeData {
  edgeStyle?: EdgeStyleType;
  arrowType?: EdgeArrowType;
}

function getStrokeDasharray(style: EdgeStyleType): string | undefined {
  switch (style) {
    case "dashed": return "8 4";
    case "dotted": return "2 4";
    default: return undefined;
  }
}

function getStrokeWidth(style: EdgeStyleType): number {
  switch (style) {
    case "thick": return 3;
    default: return 2;
  }
}

export const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  selected,
}) => {
  const { setEdges } = useWorkflowStore();
  const edgeStyle = data?.edgeStyle || "default";
  const arrowType = data?.arrowType || "arrow";

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const onDeleteEdge = useCallback(() => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, [id, setEdges]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          stroke: selected ? "var(--theme-coral)" : "var(--theme-mist-dim)",
          opacity: selected ? 1 : 0.4,
          strokeWidth: getStrokeWidth(edgeStyle),
          strokeDasharray: getStrokeDasharray(edgeStyle),
          filter: selected ? "drop-shadow(0 0 5px var(--theme-coral-glow))" : undefined,
          transition: "stroke 0.2s, filter 0.2s, opacity 0.2s",
        }}
        markerEnd={arrowType !== "none" ? `url(#marker-${arrowType})` : undefined}
        markerStart={arrowType === "double" ? `url(#marker-arrow-start)` : undefined}
      />
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <button
              onClick={onDeleteEdge}
              className="p-1.5 rounded-full text-white shadow-lg transition-all hover:scale-110"
              style={{ background: "var(--color-accent-rose)" }}
              title="Delete Edge"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

/** SVG Marker definitions */
export const EdgeMarkerDefs: React.FC = () => (
  <svg style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0 }}>
    <defs>
      <marker id="marker-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 12 6 L 0 12" fill="none" stroke="var(--theme-mist-dim)" strokeWidth="1.5" strokeOpacity="0.5" />
      </marker>
      <marker id="marker-arrowClosed" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 12 6 L 0 12 Z" fill="var(--theme-mist-dim)" fillOpacity="0.5" />
      </marker>
      <marker id="marker-arrow-start" viewBox="0 0 12 12" refX="2" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 12 0 L 0 6 L 12 12" fill="none" stroke="var(--theme-mist-dim)" strokeWidth="1.5" strokeOpacity="0.5" />
      </marker>
    </defs>
  </svg>
);
