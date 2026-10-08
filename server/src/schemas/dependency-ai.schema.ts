import { z } from "zod";

export const dependencyAIAnalysisSchema = z.object({
  scanId: z.string(),
  timestamp: z.string(),
  lockfileType: z.enum(["package-lock.json", "yarn.lock", "pnpm-lock.yaml"]),
  totalDependencies: z.number().int().nonnegative(),
  vulnerableCount: z.number().int().nonnegative(),
  riskScore: z.number().min(0).max(100),
  findings: z.array(
    z.object({
      id: z.string(),
      packageName: z.string(),
      currentVersion: z.string(),
      fixedVersion: z.string(),
      cveId: z.string(),
      severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
      transitiveChain: z.array(z.string()),
      impactAssessment: z.string(),
      summary: z.string(),
    }),
  ),
  transitiveGraph: z.record(z.string(), z.array(z.string())),
});

export type DependencyAIAnalysis = z.infer<typeof dependencyAIAnalysisSchema>;
