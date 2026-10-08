import { HTTP_STATUS } from "../constants/http-status.js";
import { AppError } from "./app-error.ts";
export class ScannerError extends AppError {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    constructor(message, details) {
        super(message, details);
    }
}
//# sourceMappingURL=scanner.error.js.map