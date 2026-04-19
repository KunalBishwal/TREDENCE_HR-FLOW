import React from "react";
import { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import { UserCheck } from "lucide-react";
import { BaseNodeData, NodeSchema } from "../types/workflow.types";

export const ApprovalNode: React.FC<NodeProps<BaseNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      title={(data.title as string) || "Approval"}
      icon={<UserCheck size={13} />}
      accentColor="#FFA726"
      glowColor="rgba(255, 167, 38, 0.3)"
      error={data.error}
      selected={selected}
    >
      <div className="text-[10px] text-mist/45">
        <span className="font-semibold text-mist/60">Approver:</span>{" "}
        {(data.approverRole as string) || "Any Manager"}
      </div>
    </BaseNode>
  );
};

export const approvalSchema: NodeSchema = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "approverRole", label: "Approver Role", type: "text" },
    { name: "autoApproveThreshold", label: "Auto-Approve Threshold (Days)", type: "number" },
  ]
};
