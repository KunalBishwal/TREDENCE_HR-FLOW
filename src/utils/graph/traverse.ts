import { WorkflowNode, Edge } from "../../types/workflow.types";

export interface TraversalStep {
  nodeId: string;
  nodeType: string;
  title: string;
  message: string;
}

export function simulateBFS(nodes: WorkflowNode[], edges: Edge[]): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const startNode = nodes.find(n => n.type === "start");
  if (!startNode) return steps;

  const queue: WorkflowNode[] = [startNode];
  const visited = new Set<string>();
  visited.add(startNode.id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    let msg = `Executed ${current.type}`;
    
    if (current.type === "task") msg = `Assigned task to ${current.data.assignee || "Anyone"}`;
    if (current.type === "approval") msg = `Waiting for ${current.data.approverRole || "Manager"}`;
    if (current.type === "automated") msg = `Triggered API: ${current.data.action || "None"}`;
    if (current.type === "end") msg = `Workflow Terminated.`;

    steps.push({
      nodeId: current.id,
      nodeType: current.type || "unknown",
      title: (current.data.title as string) || (current.type || "unknown"),
      message: msg
    });

    const outgoing = edges.filter(e => e.source === current.id);
    for (const edge of outgoing) {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        const nextNode = nodes.find(n => n.id === edge.target);
        if (nextNode) queue.push(nextNode);
      }
    }
  }

  return steps;
}
