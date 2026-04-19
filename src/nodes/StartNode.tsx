import React from "react";
import { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import { Play } from "lucide-react";
import { BaseNodeData, NodeSchema } from "../types/workflow.types";

export const StartNode: React.FC<NodeProps<BaseNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      title={(data.title as string) || "Start"}
      icon={<Play size={13} />}
      accentColor="#26A69A"
      glowColor="rgba(38, 166, 154, 0.3)"
      isStart={true}
      error={data.error}
      selected={selected}
    >
      <div className="text-[10px] text-mist/45">Entry point of workflow</div>
    </BaseNode>
  );
};

export const startSchema: NodeSchema = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "metadata", label: "Metadata (JSON)", type: "textarea" },
  ]
};
