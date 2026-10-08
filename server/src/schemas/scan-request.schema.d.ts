import { z } from "zod";
export declare const scanRequestSchema: z.ZodObject<{
    code: z.ZodString;
    language: z.ZodDefault<z.ZodEnum<{
        javascript: "javascript";
        typescript: "typescript";
    }>>;
}, z.core.$strip>;
export type ScanRequestInput = z.infer<typeof scanRequestSchema>;
//# sourceMappingURL=scan-request.schema.d.ts.map