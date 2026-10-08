import { z } from "zod";
export const promptAIAnalysisSchema = z.object({
    isInjected: z.boolean(),
    overallRisk: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"]),
    findings: z.array(z.object({
        id: z.string(),
        type: z.enum([
            "INSTRUCTION_HIJACKING",
            "DATA_EXFILTRATION",
            "JAILBREAK_ROLEPLAY",
            "DELIMITER_SPOOFING",
            "HIDDEN_ENCODING",
        ]),
        risk: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"]),
        title: z.string(),
        suspiciousText: z.string(),
        reasoning: z.string(),
    })),
    removedSegments: z.array(z.string()),
    sanitizedPrompt: z.string(),
    unprotectedAgentResponse: z.string(),
    protectedAgentResponse: z.string(),
    wasHijackedInUnprotected: z.boolean(),
    hijackEvidence: z.array(z.string()).optional(),
});
//# sourceMappingURL=prompt-ai.schema.js.map