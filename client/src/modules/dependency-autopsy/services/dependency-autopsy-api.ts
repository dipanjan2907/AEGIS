import type {
  DependencyReport,
  LockfileType,
} from "../types/dependency-autopsy.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const scanDependencyLockfile = async (
  lockfileContent: string,
  lockfileType: LockfileType,
): Promise<DependencyReport> => {
  const response = await fetch(`${API_BASE_URL}/dependency/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lockfileContent, lockfileType }),
  });

  const result: {
    success: boolean;
    data?: DependencyReport;
    error?: { message?: string };
  } = await response.json();
  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.error?.message || "Failed to scan dependency lockfile",
    );
  }

  return result.data;
};
