import { z } from "zod";
export declare const configAIAnalysisSchema: z.ZodObject<{
    riskScore: z.ZodNumber;
    findings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        ruleId: z.ZodString;
        severity: z.ZodEnum<{
            CRITICAL: "CRITICAL";
            HIGH: "HIGH";
            MEDIUM: "MEDIUM";
            LOW: "LOW";
        }>;
        title: z.ZodString;
        description: z.ZodString;
        lineNumber: z.ZodOptional<z.ZodNumber>;
        evidence: z.ZodString;
        recommendation: z.ZodString;
    }, z.core.$strip>>;
    securedConfig: z.ZodString;
    diffSummary: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type ConfigAIAnalysisResponse = z.infer<typeof configAIAnalysisSchema>;
//# sourceMappingURL=config-ai.schema.d.ts.map