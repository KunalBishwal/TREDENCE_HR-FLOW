import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";
import { ConfigPanel } from "./ConfigPanel";
import { SimulationPanel } from "./SimulationPanel";
import {
  LayoutDashboard,
  Play,
  Square,
  Download,
  Upload,
  LayoutTemplate,
  Trash2,
  AlignVerticalSpaceAround,
  Moon,
  Sun,
} from "lucide-react";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { serializeWorkflow } from "../../utils/graph/serialize";
import { workflowTemplates } from "../../utils/templates";
import { autoLayout } from "../../utils/graph/autoLayout";
import type { WorkflowNode, Edge } from "../../types/workflow.types";

import PlasmaWave from "../../components/ui/PlasmaWave";
import Iridescence from "../../components/ui/Iridescence";

export const WorkflowDesigner: React.FC = () => {
  const [showSimulation, setShowSimulation] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showClearToast, setShowClearToast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { nodes, edges, clearAll, loadWorkflow, setNodes } = useWorkflowStore();

  useEffect(() => {
    // Check initial preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const plasmaColors: [string, string] = isDarkMode ? ['#FF6044', '#AB47BC'] : ['#BCA67F', '#A6916B'];

  const handleExport = () => {
    const json = serializeWorkflow(nodes, edges);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.graph?.nodes && data.graph?.edges) {
          const importedNodes: WorkflowNode[] = data.graph.nodes.map((n: any) => ({
            id: n.id,
            type: n.type,
            position: n.position || { x: Math.random() * 500, y: Math.random() * 500 },
            data: n.data,
          }));
          const importedEdges: Edge[] = data.graph.edges.map((e: any, i: number) => ({
            id: e.id || `imported-${i}`,
            source: e.source,
            target: e.target,
            type: "custom",
            data: e.data || { edgeStyle: "default", arrowType: "arrowClosed" },
          }));
          loadWorkflow(importedNodes, importedEdges);
        }
      } catch {
        alert("Invalid workflow JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleLoadTemplate = (templateId: string) => {
    const t = workflowTemplates.find((tmpl) => tmpl.id === templateId);
    if (t) {
      loadWorkflow(
        t.nodes.map((n) => ({ ...n })),
        t.edges.map((e) => ({ ...e }))
      );
    }
    setShowTemplates(false);
  };

  const handleAutoLayout = () => {
    if (nodes.length === 0) return;
    const layouted = autoLayout(nodes, edges, "TB");
    setNodes(layouted);
  };

  const handleClearConfirm = () => {
    clearAll();
    setShowClearToast(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen overscroll-none overflow-hidden relative">
      {isDarkMode ? (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
           <PlasmaWave colors={plasmaColors} />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.14] mix-blend-multiply">
           <Iridescence color={[0.65, 0.57, 0.42]} speed={0.9} amplitude={0.08} />
        </div>
      )}

      {/* Header */}
      <header
        className="h-14 flex items-center px-5 justify-between select-none z-20 border-b shrink-0 bg-space-card/85 backdrop-blur-2xl border-glass-border bg-theme-transition"
      >
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-coral bg-theme-transition"
          >
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <h1 className="font-bold text-base tracking-wide text-mist transition-colors">
            HR Workflow Designer
          </h1>
        </div>

        {/* Center: Toolbar */}
        <div className="flex items-center gap-1">
          {/* Templates */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-mist-dim hover:text-mist hover:bg-coral/10 transition-all"
              title="Templates"
            >
              <LayoutTemplate size={14} />
              <span className="hidden md:inline">Templates</span>
            </button>

            {showTemplates && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl p-3 z-50 animate-fade-in-up bg-space-light border border-glass-border shadow-xl bg-theme-transition"
              >
                <p className="text-[10px] uppercase tracking-wider text-mist-dim font-bold mb-2">
                  Load Template
                </p>
                <div className="space-y-1.5">
                  {workflowTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleLoadTemplate(t.id)}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-mist/5 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-mist group-hover:text-mist-dark transition-colors">
                            {t.name}
                          </p>
                          <p className="text-[10px] text-mist-dim leading-tight">{t.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-mist/10 mx-1" />

          {/* Auto-layout */}
          <button
            onClick={handleAutoLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-mist-dim hover:text-mist hover:bg-coral/10 transition-all"
            title="Auto-Layout"
          >
            <AlignVerticalSpaceAround size={14} />
            <span className="hidden md:inline">Layout</span>
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-mist-dim hover:text-mist hover:bg-coral/10 transition-all"
            title="Export JSON"
          >
            <Download size={14} />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-mist-dim hover:text-mist hover:bg-coral/10 transition-all"
            title="Import JSON"
          >
            <Upload size={14} />
            <span className="hidden md:inline">Import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />

          <div className="w-px h-5 bg-mist/10 mx-1" />

          {/* Clear All */}
          <button
            onClick={() => setShowClearToast(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all"
            title="Clear All"
          >
            <Trash2 size={14} />
            <span className="hidden md:inline">Clear</span>
          </button>

          <div className="w-px h-5 bg-mist/10 mx-1" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-mist-dim hover:text-mist hover:bg-coral/10 transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span className="hidden md:inline">{isDarkMode ? "Light" : "Dark"}</span>
          </button>
        </div>

        {/* Right: Simulate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulation(!showSimulation)}
            className="flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: showSimulation ? "rgba(239, 83, 80, 0.1)" : "var(--theme-coral)",
              color: showSimulation ? "#EF5350" : "white",
              border: showSimulation ? "1px solid rgba(239, 83, 80, 0.3)" : "1px solid transparent",
            }}
          >
            {showSimulation ? <Square size={14} /> : <Play size={14} />}
            {showSimulation ? "Stop" : "Simulate"}
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 relative flex flex-col bg-transparent bg-theme-transition">
          <Canvas key={isDarkMode ? "dark" : "light"} />
          {showSimulation && (
            <div
              className="absolute bottom-0 left-0 right-0 h-1/3 z-10 animate-fade-in-up border-t bg-space-card/95 backdrop-blur-lg border-glass-border bg-theme-transition"
            >
              <SimulationPanel onClose={() => setShowSimulation(false)} />
            </div>
          )}
        </main>
        <ConfigPanel />
      </div>

      {/* Custom Toast Alert */}
      {showClearToast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 px-4 py-3 rounded-xl shadow-xl animate-slide-in-bottom bg-space-light border border-glass-border bg-theme-transition" style={{ transform: "translateX(-50%)" }}>
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <Trash2 size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-mist">Clear Canvas?</p>
            <p className="text-xs text-mist-dim mt-0.5">This action cannot be undone.</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setShowClearToast(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-mist-dim hover:bg-mist/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleClearConfirm}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-all shadow-md"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
