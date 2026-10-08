import { HTTP_STATUS, type HttpStatusCode } from "../constants/http-status.js";

export abstract class AppError extends Error {
  public abstract readonly statusCode: HttpStatusCode;

  constructor(
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
