import { z } from "zod";
export declare const promptScanRequestSchema: z.ZodObject<{
    prompt: z.ZodString;
    firewallEnabled: z.ZodDefault<z.ZodBoolean>;
    targetAgentRole: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type PromptScanRequestInput = z.infer<typeof promptScanRequestSchema>;
//# sourceMappingURL=prompt-request.schema.d.ts.map