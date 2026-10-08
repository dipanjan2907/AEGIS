import { HTTP_STATUS } from "../constants/http-status.js";
import { AppError } from "./app-error.js";
export class BadRequestError extends AppError {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    constructor(message, details) {
        super(message, details);
    }
}
//# sourceMappingURL=bad-request.error.js.map