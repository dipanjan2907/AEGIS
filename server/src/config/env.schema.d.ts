import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>;
    PORT: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    LOG_LEVEL: z.ZodEnum<{
        fatal: "fatal";
        error: "error";
        warn: "warn";
        info: "info";
        debug: "debug";
        trace: "trace";
    }>;
    CORS_ORIGIN: z.ZodString;
    GEMMA_API_KEY: z.ZodString;
    GEMMA_MODEL_NAME: z.ZodString;
    RATE_LIMIT_WINDOW_MS: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    RATE_LIMIT_MAX_REQUESTS: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export type EnvConfig = z.infer<typeof envSchema>;
//# sourceMappingURL=env.schema.d.ts.map