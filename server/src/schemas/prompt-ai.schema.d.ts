import { z } from "zod";
export declare const promptAIAnalysisSchema: z.ZodObject<{
    isInjected: z.ZodBoolean;
    overallRisk: z.ZodEnum<{
        CRITICAL: "CRITICAL";
        HIGH: "HIGH";
        MEDIUM: "MEDIUM";
        LOW: "LOW";
        SAFE: "SAFE";
    }>;
    findings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            INSTRUCTION_HIJACKING: "INSTRUCTION_HIJACKING";
            DATA_EXFILTRATION: "DATA_EXFILTRATION";
            JAILBREAK_ROLEPLAY: "JAILBREAK_ROLEPLAY";
            DELIMITER_SPOOFING: "DELIMITER_SPOOFING";
            HIDDEN_ENCODING: "HIDDEN_ENCODING";
        }>;
        risk: z.ZodEnum<{
            CRITICAL: "CRITICAL";
            HIGH: "HIGH";
            MEDIUM: "MEDIUM";
            LOW: "LOW";
            SAFE: "SAFE";
        }>;
        title: z.ZodString;
        suspiciousText: z.ZodString;
        reasoning: z.ZodString;
    }, z.core.$strip>>;
    removedSegments: z.ZodArray<z.ZodString>;
    sanitizedPrompt: z.ZodString;
    unprotectedAgentResponse: z.ZodString;
    protectedAgentResponse: z.ZodString;
    wasHijackedInUnprotected: z.ZodBoolean;
    hijackEvidence: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type PromptAIAnalysisResponse = z.infer<typeof promptAIAnalysisSchema>;
//# sourceMappingURL=prompt-ai.schema.d.ts.map