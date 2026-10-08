import { z } from "zod";
export const aiFindingAnalysisSchema = z.object({
    findingId: z.string().min(1, "findingId must be provided"),
    explanation: z.string().min(1, "Explanation cannot be empty"),
    attackPath: z
        .array(z.string().min(1, "Attack path step cannot be empty"))
        .min(1, "At least one attack path step must be provided"),
    remediation: z.string().min(1, "Remediation details cannot be empty"),
    saferCodeExample: z.string().min(1, "Safer code example cannot be empty"),
});
export const aiAnalysisResponseSchema = z.object({
    analyses: z.array(aiFindingAnalysisSchema),
});
//# sourceMappingURL=ai-response.schema.js.map