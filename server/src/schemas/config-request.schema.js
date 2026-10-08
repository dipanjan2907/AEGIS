import { z } from "zod";
export const configScanRequestSchema = z.object({
    configText: z
        .string({ required_error: "Configuration content is required" })
        .min(1, "Configuration content cannot be empty")
        .max(50000, "Configuration content exceeds maximum 50,000 characters"),
    configType: z.enum(["nginx", "dockerfile", "env"], {
        required_error: "configType must be 'nginx', 'dockerfile', or 'env'",
    }),
});
//# sourceMappingURL=config-request.schema.js.map