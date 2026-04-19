import { WorkflowNode, Edge } from "../../types/workflow.types";
import { detectCycle } from "./detectCycle";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>; // nodeId -> error string
  globalError?: string;
}

export function validateGraph(nodes: WorkflowNode[], edges: Edge[]): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: {} };

  if (nodes.length === 0) {
    result.isValid = false;
    result.globalError = "Workflow is empty.";
    return result;
  }

  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length === 0) {
    result.isValid = false;
    result.globalError = "Workflow must have a Start node.";
    return result;
  }

  if (startNodes.length > 1) {
    result.isValid = false;
    result.globalError = "Workflow can only have one Start node.";
    startNodes.slice(1).forEach(n => result.errors[n.id] = "Multiple start nodes are not allowed.");
  }

  // Detect disconnected nodes (Ensure all nodes are reachable from Start)
  const reachableNodes = new Set<string>();
  
  const bfsQueue: string[] = [startNodes[0].id];
  reachableNodes.add(startNodes[0].id);

  while(bfsQueue.length > 0) {
    const current = bfsQueue.shift()!;
    const outgoing = edges.filter(e => e.source === current);
    outgoing.forEach(e => {
      if (!reachableNodes.has(e.target)) {
        reachableNodes.add(e.target);
        bfsQueue.push(e.target);
      }
    });
  }

  nodes.forEach(n => {
    if (!reachableNodes.has(n.id) && n.type !== "start") {
      result.isValid = false;
      result.errors[n.id] = "Node is unreachable from the Start node.";
    }
  });

  // Cycle Detection
  const hasCycle = detectCycle(nodes.map(n => n.id), edges);
  if (hasCycle) {
    result.isValid = false;
    result.globalError = "Workflow contains cycles which are not allowed.";
  }

  // Field Level validations could be added here by cross referencing nodeRegistry schema

  return result;
}
