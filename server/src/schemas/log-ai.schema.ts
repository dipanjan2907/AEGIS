import { z } from "zod";

export const logAIAnalysisSchema = z.object({
  attackTimeline: z.array(
    z.object({
      time: z.string(),
      event: z.string(),
      severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
    }),
  ),
  gemmaForensicSummary: z.string(),
  plainEnglishAnswer: z.string(),
});

export type LogAIAnalysis = z.infer<typeof logAIAnalysisSchema>;
