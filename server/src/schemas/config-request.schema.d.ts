import { z } from "zod";
export declare const configScanRequestSchema: z.ZodObject<{
    configText: z.ZodString;
    configType: z.ZodEnum<{
        nginx: "nginx";
        dockerfile: "dockerfile";
        env: "env";
    }>;
}, z.core.$strip>;
export type ConfigScanRequestInput = z.infer<typeof configScanRequestSchema>;
//# sourceMappingURL=config-request.schema.d.ts.map