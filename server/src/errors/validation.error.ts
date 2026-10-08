import { HTTP_STATUS, type HttpStatusCode } from "../constants/http-status.js";
import { AppError } from "./app-error.js";

export class ValidationError extends AppError {
  public readonly statusCode: HttpStatusCode = HTTP_STATUS.BAD_REQUEST;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}
