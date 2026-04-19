import React from "react";
import { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import { Zap } from "lucide-react";
import { BaseNodeData, NodeSchema } from "../types/workflow.types";

export const AutomatedNode: React.FC<NodeProps<BaseNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      title={(data.title as string) || "Automated Action"}
      icon={<Zap size={13} />}
      accentColor="#AB47BC"
      glowColor="rgba(171, 71, 188, 0.3)"
      error={data.error}
      selected={selected}
    >
      <div className="text-[10px] text-mist/45">
        <span className="font-semibold text-mist/60">Action:</span>{" "}
        {(data.action as string) || "None"}
      </div>
    </BaseNode>
  );
};

export const automatedSchema: NodeSchema = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "action", label: "Action (API)", type: "select", options: [
      { label: "Send Email", value: "send_email" },
      { label: "Generate Document", value: "generate_doc" },
      { label: "Send Slack Notification", value: "notify_slack" },
    ]},
    { name: "parameters", label: "Dynamic Parameters (JSON)", type: "textarea" },
  ]
};
