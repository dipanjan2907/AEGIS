import { type HttpStatusCode } from "../constants/http-status.js";
import { AppError } from "./app-error.ts";
export declare class ScannerError extends AppError {
    readonly statusCode: HttpStatusCode;
    constructor(message: string, details?: Record<string, unknown>);
}
//# sourceMappingURL=scanner.error.d.ts.map