import React from "react";
import { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import { CheckSquare } from "lucide-react";
import { BaseNodeData, NodeSchema } from "../types/workflow.types";

export const TaskNode: React.FC<NodeProps<BaseNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      title={(data.title as string) || "Task"}
      icon={<CheckSquare size={13} />}
      accentColor="#42A5F5"
      glowColor="rgba(66, 165, 245, 0.3)"
      error={data.error}
      selected={selected}
    >
      <div className="text-[10px] text-mist/45">
        <span className="font-semibold text-mist/60">Assignee:</span>{" "}
        {(data.assignee as string) || "Unassigned"}
      </div>
    </BaseNode>
  );
};

export const taskSchema: NodeSchema = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "assignee", label: "Assignee", type: "text" },
    { name: "dueDate", label: "Due Date", type: "text" },
    { name: "customFields", label: "Custom Fields (JSON)", type: "textarea" },
  ]
};
