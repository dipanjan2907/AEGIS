import { HTTP_STATUS } from "../constants/http-status.js";
import { AppError } from "./app-error.js";
export class NotFoundError extends AppError {
    statusCode = HTTP_STATUS.NOT_FOUND;
    constructor(message = "Resource not found") {
        super(message);
    }
}
//# sourceMappingURL=not-found.error.js.map