import { HTTP_STATUS } from "../constants/http-status.js";
import { AppError } from "./app-error.js";
export class InternalServerError extends AppError {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    constructor(message = "An unexpected error occurred", details) {
        super(message, details);
    }
}
//# sourceMappingURL=internal.error.js.map