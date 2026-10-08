import { pino } from "pino";
import { env } from "../config/env.js";
export const logger = pino({
    level: env.LOG_LEVEL,
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
//# sourceMappingURL=logger.js.map