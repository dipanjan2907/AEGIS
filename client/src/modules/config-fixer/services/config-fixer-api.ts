import type { ConfigFixReport, ConfigType } from "../types/config-fixer.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export interface ScanConfigParams {
  configText: string;
  configType: ConfigType;
}

export const scanConfigPayload = async (
  params: ScanConfigParams
): Promise<ConfigFixReport> => {
  const response = await fetch(`${API_BASE_URL}/config/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to audit configuration file");
  }

  return data.data;
};