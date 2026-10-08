import { type HttpStatusCode } from "../constants/http-status.js";
export declare abstract class AppError extends Error {
    readonly details?: Record<string, unknown> | undefined;
    abstract readonly statusCode: HttpStatusCode;
    constructor(message: string, details?: Record<string, unknown> | undefined);
}
//# sourceMappingURL=app-error.d.ts.map