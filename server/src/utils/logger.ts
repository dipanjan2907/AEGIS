import { pino, type Level } from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: (env as typeof env & { LOG_LEVEL?: Level }).LOG_LEVEL ?? "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "body.code",
      "GEMMA_API_KEY",
      "*.password",
      "*.secret",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
});
