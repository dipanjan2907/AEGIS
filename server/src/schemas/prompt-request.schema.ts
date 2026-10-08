import { z } from "zod";

export const promptScanRequestSchema = z.object({
  prompt: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Prompt text is required for scanning" : undefined,
    })
    .min(1, "Prompt cannot be empty")
    .max(50000, "Prompt exceeds maximum length limit of 50,000 characters"),
  firewallEnabled: z.boolean().default(true),
  targetAgentRole: z
    .string()
    .default("Helpful AI Email Assistant that summarizes incoming messages"),
});

export type PromptScanRequestInput = z.infer<typeof promptScanRequestSchema>;
