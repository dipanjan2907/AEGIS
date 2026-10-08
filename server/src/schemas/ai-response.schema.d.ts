import { z } from "zod";
export declare const aiFindingAnalysisSchema: z.ZodObject<{
    findingId: z.ZodString;
    explanation: z.ZodString;
    attackPath: z.ZodArray<z.ZodString>;
    remediation: z.ZodString;
    saferCodeExample: z.ZodString;
}, z.core.$strip>;
export declare const aiAnalysisResponseSchema: z.ZodObject<{
    analyses: z.ZodArray<z.ZodObject<{
        findingId: z.ZodString;
        explanation: z.ZodString;
        attackPath: z.ZodArray<z.ZodString>;
        remediation: z.ZodString;
        saferCodeExample: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AIFindingAnalysis = z.infer<typeof aiFindingAnalysisSchema>;
export type AIAnalysisResponse = z.infer<typeof aiAnalysisResponseSchema>;
//# sourceMappingURL=ai-response.schema.d.ts.map