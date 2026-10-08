import { type HttpStatusCode } from "../constants/http-status.js";
import { AppError } from "./app-error.js";
export declare class InternalServerError extends AppError {
    readonly statusCode: HttpStatusCode;
    constructor(message?: string, details?: Record<string, unknown>);
}
//# sourceMappingURL=internal.error.d.ts.map