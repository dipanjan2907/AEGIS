import { z } from "zod";

export const dependencyScanRequestSchema = z.object({
  lockfileContent: z
    .string()
    .min(1, "Lockfile content cannot be empty")
    .max(100_000, "Lockfile content exceeds maximum 100,000 characters"),
  lockfileType: z.enum(["package-lock.json", "yarn.lock", "pnpm-lock.yaml"]),
});

export type DependencyScanRequestInput = z.infer<
  typeof dependencyScanRequestSchema
>;
