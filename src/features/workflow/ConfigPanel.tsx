import React from "react";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { nodeRegistry } from "../../nodes/registry";
import { DynamicFormRenderer } from "../../components/form/DynamicFormRenderer";
import { Settings2, Trash2, X } from "lucide-react";

const NODE_COLORS: Record<string, string> = {
  start: "var(--color-accent-teal)",
  task: "var(--color-accent-blue)",
  approval: "var(--color-accent-amber)",
  automated: "var(--color-accent-purple)",
  end: "var(--color-accent-rose)",
};

export const ConfigPanel: React.FC = () => {
  const { nodes, selectedNodeId, deleteNode, setSelectedNode } = useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside
        className="w-72 flex flex-col items-center justify-center p-6 text-center border-l shrink-0 bg-space-light/85 backdrop-blur-2xl border-glass-border bg-theme-transition"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-inner bg-mist/5"
        >
          <Settings2 size={22} className="text-mist-dim" />
        </div>
        <p className="text-xs text-mist-dim font-medium">Select a node to configure</p>
      </aside>
    );
  }

  const { type, data } = selectedNode;
  const registryEntry = type ? nodeRegistry[type] : undefined;

  if (!registryEntry) {
    return (
      <aside
        className="w-72 p-6 text-red-500 border-l shrink-0 font-medium bg-red-500/10 border-glass-border"
      >
        Unknown node type: {type}
      </aside>
    );
  }

  const accentColor = NODE_COLORS[type || ""] || "var(--theme-coral)";

  return (
    <aside
      className="w-72 flex flex-col h-full border-l z-10 shrink-0 bg-space-light/85 backdrop-blur-2xl border-glass-border bg-theme-transition"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-glass-border flex justify-between items-center bg-theme-transition">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm"
            style={{ background: `color-mix(in srgb, ${accentColor} 20%, transparent)` }}
          >
            <Settings2 size={13} style={{ color: accentColor }} />
          </span>
          <div>
            <h2 className="font-semibold text-mist capitalize text-xs bg-theme-transition">{type} Config</h2>
          </div>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="p-1.5 text-red-500/70 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-all"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setSelectedNode(null)}
            className="p-1.5 text-mist-dim hover:text-mist hover:bg-mist/10 rounded-md transition-all"
            title="Close"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 flex-1 overflow-y-auto animate-fade-in-up">
        <DynamicFormRenderer
          schema={registryEntry.configSchema}
          nodeData={data}
          nodeId={selectedNode.id}
        />
      </div>

      {/* Error */}
      {data.error && (
        <div
          className="mx-3 mb-3 p-2.5 rounded-lg text-xs flex gap-2 items-start bg-red-500/10 border border-red-500/20"
        >
          <span className="font-semibold text-red-500 shrink-0">Error:</span>
          <span className="text-red-500 mix-blend-multiply dark:mix-blend-screen">{data.error}</span>
        </div>
      )}
    </aside>
  );
};
