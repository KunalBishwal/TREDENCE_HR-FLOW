import React from "react";
import { Handle, Position } from "reactflow";
import { cn } from "../utils/cn";
import { AlertCircle } from "lucide-react";

interface BaseNodeProps {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  glowColor?: string;
  isStart?: boolean;
  isEnd?: boolean;
  error?: string;
  selected?: boolean;
  children?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  title,
  icon,
  accentColor,
  glowColor,
  isStart = false,
  isEnd = false,
  error,
  selected,
  children,
}) => {
  return (
    <div
      className={cn(
        "workflow-node relative flex flex-col min-w-[220px] rounded-xl overflow-visible",
        "border transition-all duration-200 bg-space-card"
      )}
      style={{
        borderColor: selected
          ? accentColor
          : error
          ? "#EF5350"
          : "var(--theme-glass-border)",
        boxShadow: selected
          ? `0 0 20px color-mix(in srgb, ${accentColor} 40%, transparent), 0 8px 24px rgba(0,0,0,0.15)`
          : error
          ? "0 0 16px rgba(239, 83, 80, 0.25), 0 4px 16px rgba(0,0,0,0.1)"
          : "0 4px 16px rgba(0,0,0,0.05)",
      }}
    >
      {/* Error Badge */}
      {error && (
        <div className="absolute -top-2.5 -right-2.5 bg-red-500 text-white rounded-full p-1 shadow-lg group z-10 animate-bounce">
          <AlertCircle size={14} />
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-max max-w-xs bg-red-50 border border-red-200 text-red-600 font-medium text-xs rounded-lg py-1.5 px-3 z-50 shadow-xl">
            {error}
          </div>
        </div>
      )}

      {/* Input Handle */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !border-2 !rounded-full shadow-sm"
          style={{ borderColor: accentColor, background: "var(--theme-space-card)" }}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 font-semibold rounded-t-xl"
        style={{
          background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}dd)`,
        }}
      >
        <span
          className="flex items-center justify-center w-6 h-6 rounded-md text-white shadow-sm"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          {icon}
        </span>
        <span className="text-sm text-white font-bold tracking-wide">{title}</span>
      </div>

      {/* Body */}
      <div className="px-3.5 py-3 flex flex-col gap-1.5 bg-theme-transition">
        {children}
      </div>

      {/* Output Handle */}
      {!isEnd && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !border-2 !rounded-full shadow-sm"
          style={{ borderColor: accentColor, background: "var(--theme-space-card)" }}
        />
      )}
    </div>
  );
};
