import { HTTP_STATUS, type HttpStatusCode } from "../constants/http-status.js";
import { AppError } from "./app-error.ts";

export class ServiceUnavailableError extends AppError {
  public readonly statusCode: HttpStatusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}
