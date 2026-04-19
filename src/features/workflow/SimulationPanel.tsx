import React, { useState, useEffect } from "react";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { validateGraph } from "../../utils/graph/validateGraph";
import { simulateBFS } from "../../utils/graph/traverse";
import { serializeWorkflow } from "../../utils/graph/serialize";
import { mockApi } from "../../api/mockApi";
import { Play, X, CheckCircle2, AlertCircle, Loader, Terminal } from "lucide-react";

export const SimulationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { nodes, edges, updateNodeData } = useWorkflowStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    setError(null);

    nodes.forEach(n => {
      if (n.data.error) updateNodeData(n.id, { error: undefined });
    });

    const validation = validateGraph(nodes, edges);
    if (!validation.isValid) {
      setError(validation.globalError || "Graph validation failed.");
      Object.entries(validation.errors).forEach(([nodeId, err]) => {
        updateNodeData(nodeId, { error: err });
      });
      setIsRunning(false);
      return;
    }

    setLogs(prev => [...prev, "Starting BFS Engine Traversal..."]);
    const traversal = simulateBFS(nodes, edges);

    for (const step of traversal) {
      await new Promise(resolve => setTimeout(resolve, 350));
      setLogs(prev => [...prev, `[${step.title.toUpperCase()}] ${step.message}`]);
    }

    setLogs(prev => [...prev, "", "Serializing graph payload..."]);
    const jsonStr = serializeWorkflow(nodes, edges, traversal.map(t => t.nodeId));

    setLogs(prev => [...prev, "POST /simulate → mock API..."]);
    const apiLogs = await mockApi.simulate(jsonStr);

    setLogs(prev => [...prev, ...apiLogs]);
    setIsRunning(false);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="flex flex-col h-full text-mist font-mono text-xs relative bg-theme-transition">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center bg-coral/20">
            <Terminal size={11} className="text-coral" />
          </span>
          <span className="text-mist font-bold text-[10px] uppercase tracking-wider">Execution Engine</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-coral/10 text-coral" >
              <span className="w-1 h-1 rounded-full bg-coral animate-pulse" />
              running
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 text-mist-dim hover:text-mist hover:bg-mist/10 rounded transition-all">
          <X size={13} />
        </button>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-space-light/50 font-medium">
        {error && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle size={12} className="text-red-500 shrink-0" />
            <span className="text-red-500 mix-blend-multiply dark:mix-blend-screen text-[11px]">{error}</span>
          </div>
        )}

        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-2.5 animate-fade-in-up" style={{ animationDelay: `${idx * 25}ms` }}>
            <span className="text-mist-dim/50 shrink-0 tabular-nums w-5 text-right">{String(idx + 1).padStart(2, "0")}</span>
            <span className={log.includes("Success") ? "text-green-500 font-bold" : log.startsWith("[") ? "text-coral font-bold" : "text-mist-dim"}>
              {log || " "}
            </span>
          </div>
        ))}

        {isRunning && (
          <div className="flex items-center gap-2 text-coral mt-1 font-bold">
            <Loader size={11} className="animate-spin" /> Processing...
          </div>
        )}

        {!isRunning && !error && logs.length > 0 && (
          <div className="flex items-center gap-2 text-green-500 mt-3 font-bold border-t border-glass-border pt-2 w-max">
            <CheckCircle2 size={13} />
            Simulation Complete
          </div>
        )}
      </div>
    </div>
  );
};
