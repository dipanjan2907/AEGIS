import type { PromptFirewallReport } from "../types/prompt-firewall.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export interface ScanPromptParams {
  prompt: string;
  firewallEnabled: boolean;
  targetAgentRole?: string;
}

export const scanPromptPayload = async (
  params: ScanPromptParams,
): Promise<PromptFirewallReport> => {
  const response = await fetch(`${API_BASE_URL}/prompt/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to scan prompt text");
  }

  return data.data;
};
