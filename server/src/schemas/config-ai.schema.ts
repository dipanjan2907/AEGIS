import { z } from "zod";

export const configAIAnalysisSchema = z.object({
  riskScore: z.number().min(0).max(100),
  findings: z.array(
    z.object({
      id: z.string(),
      ruleId: z.string(),
      severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
      title: z.string(),
      description: z.string(),
      lineNumber: z.number().optional(),
      evidence: z.string(),
      recommendation: z.string(),
    })
  ),
  securedConfig: z.string(),
  diffSummary: z.array(z.string()),
});

export type ConfigAIAnalysisResponse = z.infer<typeof configAIAnalysisSchema>;