import React, { useState } from "react";
import type { EdgeStyleType, EdgeArrowType } from "./CustomEdge";
import {
  Minus,
  MoreHorizontal,
  ArrowRight,
  ArrowLeftRight,
  ChevronsRight,
  Circle,
} from "lucide-react";

export const EDGE_STYLES: { type: EdgeStyleType; label: string; icon: React.ReactNode }[] = [
  { type: "default", label: "Solid", icon: <Minus size={13} /> },
  { type: "dashed", label: "Dashed", icon: <MoreHorizontal size={13} /> },
  { type: "dotted", label: "Dotted", icon: <MoreHorizontal size={13} className="opacity-50" /> },
  { type: "thick", label: "Thick", icon: <Minus size={13} strokeWidth={4} /> },
];

export const ARROW_TYPES: { type: EdgeArrowType; label: string; icon: React.ReactNode }[] = [
  { type: "arrow", label: "Arrow", icon: <ArrowRight size={13} /> },
  { type: "arrowClosed", label: "Filled", icon: <ChevronsRight size={13} /> },
  { type: "double", label: "Double", icon: <ArrowLeftRight size={13} /> },
  { type: "none", label: "None", icon: <Circle size={13} /> },
];

interface EdgeToolbarProps {
  selectedEdgeStyle: EdgeStyleType;
  selectedArrowType: EdgeArrowType;
  onEdgeStyleChange: (style: EdgeStyleType) => void;
  onArrowTypeChange: (arrow: EdgeArrowType) => void;
}

export const EdgeToolbar: React.FC<EdgeToolbarProps> = ({
  selectedEdgeStyle,
  selectedArrowType,
  onEdgeStyleChange,
  onArrowTypeChange,
}) => {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-lg text-mist-dim hover:text-mist hover:bg-mist/10 transition-all border shadow-sm bg-theme-transition"
        style={{ borderColor: showPanel ? "var(--theme-coral)" : "var(--theme-glass-border)", background: showPanel ? "var(--theme-glass-light)" : "var(--theme-space-card)" }}
        title="Edge Style"
      >
        <Minus size={14} />
        Edge Style
      </button>

      {showPanel && (
        <div
          className="absolute top-full left-0 mt-2 rounded-xl p-3 min-w-[200px] z-50 animate-fade-in-up bg-space-card border border-glass-border shadow-xl bg-theme-transition"
        >
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-mist-dim font-bold mb-2">Line Style</p>
              <div className="grid grid-cols-2 gap-1.5">
                {EDGE_STYLES.map((s) => (
                  <button
                    key={s.type}
                    onClick={() => onEdgeStyleChange(s.type)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      selectedEdgeStyle === s.type
                        ? "bg-coral/20 text-coral border border-coral"
                        : "text-mist-dim hover:bg-mist/10 hover:text-mist border border-transparent"
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-mist-dim font-bold mb-2">Arrow</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ARROW_TYPES.map((a) => (
                  <button
                    key={a.type}
                    onClick={() => onArrowTypeChange(a.type)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      selectedArrowType === a.type
                        ? "bg-coral/20 text-coral border border-coral"
                        : "text-mist-dim hover:bg-mist/10 hover:text-mist border border-transparent"
                    }`}
                  >
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
