import { WorkflowNode, Edge } from "../../types/workflow.types";

export function serializeWorkflow(nodes: WorkflowNode[], edges: Edge[], executionPath: string[] = []) {
  return JSON.stringify({
    metadata: {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
    graph: {
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type,
        data: e.data,
      })),
    },
    executionPath,
  }, null, 2);
}
