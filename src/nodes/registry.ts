import { StartNode, startSchema } from "./StartNode";
import { TaskNode, taskSchema } from "./TaskNode";
import { ApprovalNode, approvalSchema } from "./ApprovalNode";
import { AutomatedNode, automatedSchema } from "./AutomatedNode";
import { EndNode, endSchema } from "./EndNode";
import { NodeSchema } from "../types/workflow.types";
import { ComponentType } from "react";
import { NodeProps } from "reactflow";
import { BaseNodeData } from "../types/workflow.types";

export interface NodeRegistryEntry {
  component: ComponentType<NodeProps<BaseNodeData>>;
  configSchema: NodeSchema;
  defaultData: Partial<BaseNodeData>;
}

export const nodeRegistry: Record<string, NodeRegistryEntry> = {
  start: {
    component: StartNode as any,
    configSchema: startSchema,
    defaultData: { title: "Start" },
  },
  task: {
    component: TaskNode as any,
    configSchema: taskSchema,
    defaultData: { title: "New Task" },
  },
  approval: {
    component: ApprovalNode as any,
    configSchema: approvalSchema,
    defaultData: { title: "Manager Approval", autoApproveThreshold: 3 },
  },
  automated: {
    component: AutomatedNode as any,
    configSchema: automatedSchema,
    defaultData: { title: "Automated Action", action: "send_email" },
  },
  end: {
    component: EndNode as any,
    configSchema: endSchema,
    defaultData: { title: "End", summaryToggle: true },
  },
};

// Export the reactflow node types mapping for the wrapper
export const customNodeTypes = Object.entries(nodeRegistry).reduce((acc, [key, value]) => {
  acc[key] = value.component;
  return acc;
}, {} as Record<string, any>);
