import { HTTP_STATUS, type HttpStatusCode } from "../constants/http-status.js";
import { AppError } from "./app-error.js";

export class InternalServerError extends AppError {
  public readonly statusCode: HttpStatusCode =
    HTTP_STATUS.INTERNAL_SERVER_ERROR;

  constructor(
    message: string = "An unexpected error occurred",
    details?: Record<string, unknown>,
  ) {
    super(message, details);
  }
}
