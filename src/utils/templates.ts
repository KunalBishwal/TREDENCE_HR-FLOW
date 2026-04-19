import { WorkflowNode, Edge } from "../types/workflow.types";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: WorkflowNode[];
  edges: Edge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "onboarding",
    name: "Employee Onboarding",
    description: "Standard new hire onboarding: collect documents → verify → approve → send welcome kit.",
    icon: "👤",
    nodes: [
      { id: "t-s", type: "start", position: { x: 250, y: 0 }, data: { id: "t-s", type: "start", title: "Hire Confirmed" } },
      { id: "t-1", type: "task", position: { x: 250, y: 150 }, data: { id: "t-1", type: "task", title: "Collect Documents", assignee: "HR Coordinator", description: "Collect ID proof, address proof, education certificates" } },
      { id: "t-2", type: "approval", position: { x: 250, y: 300 }, data: { id: "t-2", type: "approval", title: "Manager Approval", approverRole: "Hiring Manager", autoApproveThreshold: 3 } },
      { id: "t-3", type: "automated", position: { x: 250, y: 450 }, data: { id: "t-3", type: "automated", title: "Send Welcome Kit", action: "send_email" } },
      { id: "t-e", type: "end", position: { x: 250, y: 600 }, data: { id: "t-e", type: "end", title: "Onboarding Complete", summaryToggle: true } },
    ],
    edges: [
      { id: "te-1", source: "t-s", target: "t-1", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "te-2", source: "t-1", target: "t-2", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "te-3", source: "t-2", target: "t-3", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "te-4", source: "t-3", target: "t-e", type: "custom", data: { edgeStyle: "dashed", arrowType: "arrowClosed" } },
    ],
  },
  {
    id: "leave",
    name: "Leave Approval",
    description: "Employee leave request → manager review → HR verification → approval/rejection.",
    icon: "📋",
    nodes: [
      { id: "l-s", type: "start", position: { x: 250, y: 0 }, data: { id: "l-s", type: "start", title: "Leave Requested" } },
      { id: "l-1", type: "task", position: { x: 250, y: 150 }, data: { id: "l-1", type: "task", title: "Review Leave Balance", assignee: "HR System", description: "Check remaining leave balance" } },
      { id: "l-2", type: "approval", position: { x: 250, y: 300 }, data: { id: "l-2", type: "approval", title: "Manager Approval", approverRole: "Direct Manager" } },
      { id: "l-3", type: "automated", position: { x: 250, y: 450 }, data: { id: "l-3", type: "automated", title: "Update Calendar", action: "generate_doc" } },
      { id: "l-e", type: "end", position: { x: 250, y: 600 }, data: { id: "l-e", type: "end", title: "Leave Processed" } },
    ],
    edges: [
      { id: "le-1", source: "l-s", target: "l-1", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "le-2", source: "l-1", target: "l-2", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "le-3", source: "l-2", target: "l-3", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "le-4", source: "l-3", target: "l-e", type: "custom", data: { edgeStyle: "dashed", arrowType: "arrowClosed" } },
    ],
  },
  {
    id: "docverify",
    name: "Document Verification",
    description: "Upload docs → automated scan → compliance review → sign-off.",
    icon: "📄",
    nodes: [
      { id: "d-s", type: "start", position: { x: 250, y: 0 }, data: { id: "d-s", type: "start", title: "Documents Received" } },
      { id: "d-1", type: "automated", position: { x: 250, y: 150 }, data: { id: "d-1", type: "automated", title: "Run OCR Scan", action: "generate_doc" } },
      { id: "d-2", type: "task", position: { x: 250, y: 300 }, data: { id: "d-2", type: "task", title: "Manual Compliance Check", assignee: "Compliance Officer" } },
      { id: "d-3", type: "approval", position: { x: 250, y: 450 }, data: { id: "d-3", type: "approval", title: "Final Sign-Off", approverRole: "Director" } },
      { id: "d-e", type: "end", position: { x: 250, y: 600 }, data: { id: "d-e", type: "end", title: "Verification Complete", summaryToggle: true } },
    ],
    edges: [
      { id: "de-1", source: "d-s", target: "d-1", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "de-2", source: "d-1", target: "d-2", type: "custom", data: { edgeStyle: "dotted", arrowType: "arrow" } },
      { id: "de-3", source: "d-2", target: "d-3", type: "custom", data: { edgeStyle: "default", arrowType: "arrowClosed" } },
      { id: "de-4", source: "d-3", target: "d-e", type: "custom", data: { edgeStyle: "dashed", arrowType: "arrowClosed" } },
    ],
  },
];
