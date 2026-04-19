import React from "react";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { nodeRegistry } from "../../nodes/registry";
import { Undo2, Redo2, Play, CheckSquare, UserCheck, Zap, Flag, GripVertical } from "lucide-react";

const NODE_ICONS: Record<string, React.ReactNode> = {
  start: <Play size={13} />,
  task: <CheckSquare size={13} />,
  approval: <UserCheck size={13} />,
  automated: <Zap size={13} />,
  end: <Flag size={13} />,
};

const NODE_COLORS: Record<string, string> = {
  start: "var(--color-accent-teal)",
  task: "var(--color-accent-blue)",
  approval: "var(--color-accent-amber)",
  automated: "var(--color-accent-purple)",
  end: "var(--color-accent-rose)",
};

export const Sidebar: React.FC = () => {
  const { pastStates, futureStates, undo, redo } = useWorkflowStore.temporal.getState();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      className="w-60 flex flex-col h-full border-r z-10 shrink-0 bg-space-light/85 backdrop-blur-2xl border-glass-border bg-theme-transition"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-glass-border flex justify-between items-center bg-theme-transition">
        <h2 className="font-semibold text-mist-dim text-xs uppercase tracking-wider">
          Nodes
        </h2>
        <div className="flex gap-0.5">
          <button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            className="p-1.5 text-mist-dim hover:text-coral hover:bg-coral/10 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Undo"
          >
            <Undo2 size={13} />
          </button>
          <button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            className="p-1.5 text-mist-dim hover:text-coral hover:bg-coral/10 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Redo"
          >
            <Redo2 size={13} />
          </button>
        </div>
      </div>

      {/* Node List */}
      <div className="p-2.5 flex flex-col gap-1.5 overflow-y-auto flex-1">
        {Object.entries(nodeRegistry).map(([type], index) => (
          <div
            key={type}
            className="group p-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 border animate-slide-in-left bg-space-card shadow-sm border-glass-border"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = `color-mix(in srgb, ${NODE_COLORS[type]} 15%, transparent)`;
              el.style.borderColor = `color-mix(in srgb, ${NODE_COLORS[type]} 30%, transparent)`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = "var(--theme-space-card)";
              el.style.borderColor = "var(--theme-glass-border)";
            }}
            onDragStart={(event) => onDragStart(event, type)}
            draggable
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-md text-white shadow-sm"
                  style={{ background: NODE_COLORS[type] }}
                >
                  {NODE_ICONS[type]}
                </span>
                <span className="text-xs font-medium text-mist capitalize bg-theme-transition">{type}</span>
              </div>
              <GripVertical size={12} className="text-mist-dim opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-glass-border bg-theme-transition">
        <p className="text-[9px] text-mist-dim text-center leading-tight font-medium">
          Drag & drop nodes onto the canvas
        </p>
      </div>
    </aside>
  );
};
