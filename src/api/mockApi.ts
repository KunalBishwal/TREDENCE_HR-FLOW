export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export const mockApi = {
  getAutomations: async (): Promise<AutomationAction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "send_email", label: "Send Email", params: ["to", "subject"] },
          { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
          { id: "notify_slack", label: "Send Slack Notification", params: ["channel", "message"] }
        ]);
      }, 300);
    });
  },

  simulate: async (workflowJson: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payload = JSON.parse(workflowJson);
        const steps = payload.executionPath || [];
        resolve([
          "Initializing Server Resources...",
          `Verified Payload Structure: ${steps.length} nodes parsed.`,
          "Executing Edge Computations...",
          "Validating Security Schema...",
          "Simulation Success. Return Code 200."
        ]);
      }, 1000); // 1s delay to seem like a real API
    });
  }
};
