export type NodeType = "start" | "task" | "approval" | "automated" | "end";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "toggle" | "textarea";
  required?: boolean;
  options?: { label: string; value: string }[]; // For select fields
}

export interface NodeSchema {
  fields: readonly FormField[];
}

export interface BaseNodeData extends Record<string, unknown> {
  id: string; // The generated UUID for the node
  type: NodeType;
  error?: string; // Optional field populated by validation engine
}

// Ensure our store types align with React Flow types
import type { Node as ReactFlowNode, Edge } from "reactflow";
export type { Edge };

// Stronger typed version of React Flow's Node
export type WorkflowNode = ReactFlowNode<BaseNodeData>;

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  addNode: (node: WorkflowNode) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<BaseNodeData>) => void;
  setNodes: (nodes: WorkflowNode[] | ((nodes: WorkflowNode[]) => WorkflowNode[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  setSelectedNode: (nodeId: string | null) => void;
  validateGraph: () => void;
}
