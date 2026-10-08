import { type HttpStatusCode } from "../constants/http-status.js";
import { AppError } from "./app-error.js";
export declare class NotFoundError extends AppError {
    readonly statusCode: HttpStatusCode;
    constructor(message?: string);
}
//# sourceMappingURL=not-found.error.d.ts.map