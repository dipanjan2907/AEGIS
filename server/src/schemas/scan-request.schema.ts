import { z } from "zod";

export const scanRequestSchema = z.object({
  code: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Source code is required for scanning"
          : issue.code === "invalid_type"
            ? "Source code must be a string"
            : undefined,
    })
    .min(1, "Source code cannot be empty")
    .max(
      100000,
      "Source code exceeds maximum length limit of 100,000 characters",
    ),
  language: z
    .enum(["javascript", "typescript"], {
      error: (issue) =>
        issue.input === undefined
          ? "Language parameter is required"
          : 'Language must be either "javascript" or "typescript"',
    })
    .default("javascript"),
});

export type ScanRequestInput = z.infer<typeof scanRequestSchema>;
