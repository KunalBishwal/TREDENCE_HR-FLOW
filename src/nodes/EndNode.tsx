import React from "react";
import { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import { Flag } from "lucide-react";
import { BaseNodeData, NodeSchema } from "../types/workflow.types";

export const EndNode: React.FC<NodeProps<BaseNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      title={(data.title as string) || "End"}
      icon={<Flag size={13} />}
      accentColor="#EF5350"
      glowColor="rgba(239, 83, 80, 0.3)"
      isEnd={true}
      error={data.error}
      selected={selected}
    >
      <div className="text-[10px] text-mist/45">Workflow termination</div>
    </BaseNode>
  );
};

export const endSchema: NodeSchema = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "endMessage", label: "End Message", type: "textarea" },
    { name: "summaryToggle", label: "Include Summary?", type: "toggle" },
  ]
};
