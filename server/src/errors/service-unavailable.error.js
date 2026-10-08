import { HTTP_STATUS } from "../constants/http-status.js";
import { AppError } from "./app-error.ts";
export class ServiceUnavailableError extends AppError {
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
    constructor(message, details) {
        super(message, details);
    }
}
//# sourceMappingURL=service-unavailable.error.js.map