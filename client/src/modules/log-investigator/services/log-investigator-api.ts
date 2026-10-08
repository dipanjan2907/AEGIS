import type {
  LogFormat,
  LogReport,
} from "../types/log-investigator.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const scanSecurityLogs = async (
  logText: string,
  logFormat: LogFormat,
  plainEnglishQuery: string,
): Promise<LogReport> => {
  const response = await fetch(`${API_BASE_URL}/log/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logText, logFormat, plainEnglishQuery }),
  });
  const result: {
    success: boolean;
    data?: LogReport;
    error?: { message?: string };
  } = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error?.message || "Failed to investigate security logs");
  }
  return result.data;
};
