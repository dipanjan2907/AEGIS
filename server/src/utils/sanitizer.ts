/**
 * Utility to sanitize sensitive data before logging or emitting external metrics.
 */
export const sanitizeData = (data: unknown): unknown => {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sensitiveKeys = [
    "password",
    "token",
    "secret",
    "authorization",
    "apiKey",
    "api_key",
    "code",
    "gemmaApiKey",
    "GEMMA_API_KEY",
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (
      sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))
    ) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};
