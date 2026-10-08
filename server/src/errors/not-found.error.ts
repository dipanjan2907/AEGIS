import { HTTP_STATUS, type HttpStatusCode } from "../constants/http-status.js";
import { AppError } from "./app-error.js";

export class NotFoundError extends AppError {
  public readonly statusCode: HttpStatusCode = HTTP_STATUS.NOT_FOUND;

  constructor(message: string = "Resource not found") {
    super(message);
  }
}
