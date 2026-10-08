import { z } from "zod";

export const logScanRequestSchema = z.object({
  logText: z
    .string()
    .min(1, "Log text cannot be empty")
    .max(100_000, "Log text exceeds maximum 100,000 characters"),
  logFormat: z.enum(["nginx_access", "express_json", "auth_syslog"]),
  plainEnglishQuery: z.string().max(2_000).optional(),
});

export type LogScanRequestInput = z.infer<typeof logScanRequestSchema>;
