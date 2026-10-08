import { z } from "zod";
export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string().transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error("PORT must be a valid positive integer");
        }
        return parsed;
    }),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
    CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN cannot be empty"),
    GEMMA_API_KEY: z.string().min(1, "GEMMA_API_KEY must be provided"),
    GEMMA_MODEL_NAME: z.string().min(1, "GEMMA_MODEL_NAME must be provided"),
    RATE_LIMIT_WINDOW_MS: z.string().transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error("RATE_LIMIT_WINDOW_MS must be a valid positive integer");
        }
        return parsed;
    }),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error("RATE_LIMIT_MAX_REQUESTS must be a valid positive integer");
        }
        return parsed;
    }),
});
//# sourceMappingURL=env.schema.js.map