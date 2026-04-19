import { Edge } from "reactflow";

export function detectCycle(nodes: string[], edges: Edge[]): boolean {
  // Built adj list
  const adjList: Record<string, string[]> = {};
  nodes.forEach(n => adjList[n] = []);
  
  edges.forEach(e => {
    if (adjList[e.source]) {
        adjList[e.source].push(e.target);
    }
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true; // Cycle found
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}
