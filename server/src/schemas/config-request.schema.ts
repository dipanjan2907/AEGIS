import { z } from "zod";

export const configScanRequestSchema = z.object({
  configText: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Configuration content is required"
          : undefined,
    })
    .min(1, "Configuration content cannot be empty")
    .max(50000, "Configuration content exceeds maximum 50,000 characters"),
  configType: z.enum(["nginx", "dockerfile", "env"], {
    error: (issue) =>
      issue.input === undefined
        ? "configType must be 'nginx', 'dockerfile', or 'env'"
        : undefined,
  }),
});

export type ConfigScanRequestInput = z.infer<typeof configScanRequestSchema>;