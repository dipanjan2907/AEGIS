import type { SecurityReport } from "../types/code-guard.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const scanCodeRepository = async (
  code: string,
  language: "javascript" | "typescript",
): Promise<SecurityReport> => {
  const response = await fetch(`${API_BASE_URL}/code/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to scan code repository");
  }

  return data.data;
};
