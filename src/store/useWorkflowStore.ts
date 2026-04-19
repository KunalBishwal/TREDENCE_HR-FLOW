import { create } from "zustand";
import { Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from "reactflow";
import { WorkflowState, WorkflowNode, BaseNodeData } from "../types/workflow.types";
import { temporal } from "zundo";

export interface ExtendedWorkflowState extends WorkflowState {
  clearAll: () => void;
  loadWorkflow: (nodes: WorkflowNode[], edges: Edge[]) => void;
}

export const useWorkflowStore = create<ExtendedWorkflowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,

      addNode: (node: WorkflowNode) => {
        set({ nodes: [...get().nodes, node] });
      },

      deleteNode: (nodeId: string) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== nodeId),
          edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
        });
      },

      updateNodeData: (nodeId: string, data: Partial<BaseNodeData>) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
          ),
        });
      },

      setNodes: (nodesInput) => {
        const nextNodes = typeof nodesInput === "function" ? nodesInput(get().nodes) : nodesInput;
        set({ nodes: nextNodes });
      },

      setEdges: (edgesInput) => {
        const nextEdges = typeof edgesInput === "function" ? edgesInput(get().edges) : edgesInput;
        set({ edges: nextEdges });
      },

      setSelectedNode: (nodeId: string | null) => {
        set({ selectedNodeId: nodeId });
      },

      clearAll: () => {
        set({ nodes: [], edges: [], selectedNodeId: null });
      },

      loadWorkflow: (nodes: WorkflowNode[], edges: Edge[]) => {
        set({ nodes, edges, selectedNodeId: null });
      },

      validateGraph: () => {
        // Connected to graph utils via SimulationPanel
      },
    }),
    {
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      limit: 50,
    }
  )
);
