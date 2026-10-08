import { HTTP_STATUS } from "../constants/http-status.js";
export class AppError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
//# sourceMappingURL=app-error.js.map