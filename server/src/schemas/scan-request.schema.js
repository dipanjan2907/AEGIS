import { z } from "zod";
export const scanRequestSchema = z.object({
    code: z
        .string({
        required_error: "Source code is required for scanning",
        invalid_type_error: "Source code must be a string",
    })
        .min(1, "Source code cannot be empty")
        .max(100000, "Source code exceeds maximum length limit of 100,000 characters"),
    language: z
        .enum(["javascript", "typescript"], {
        required_error: "Language parameter is required",
        invalid_type_error: 'Language must be either "javascript" or "typescript"',
    })
        .default("javascript"),
});
//# sourceMappingURL=scan-request.schema.js.map