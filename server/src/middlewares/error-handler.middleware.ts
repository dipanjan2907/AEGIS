import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

interface ErrorResponsePayload {
  success: false;
  error: {
    message: string;
    statusCode: number;
    details?: Record<string, unknown>;
  };
}

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    logger.warn({ details: formattedDetails }, "Request validation failed");

    const payload: ErrorResponsePayload = {
      success: false,
      error: {
        message: "Validation failed for request payload",
        statusCode: HTTP_STATUS.BAD_REQUEST,
        details: { issues: formattedDetails },
      },
    };

    res.status(HTTP_STATUS.BAD_REQUEST).json(payload);
    return;
  }

  if (err instanceof AppError) {
    logger.warn(
      {
        statusCode: err.statusCode,
        message: err.message,
        details: err.details,
      },
      "Operational error captured",
    );

    const payload: ErrorResponsePayload = {
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        ...(err.details && { details: err.details }),
      },
    };

    res.status(err.statusCode).json(payload);
    return;
  }

  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
      },
    },
    "Unhandled server error captured",
  );

  const payload: ErrorResponsePayload = {
    success: false,
    error: {
      message:
        env.NODE_ENV === "production"
          ? "An internal server error occurred"
          : err.message,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(payload);
};
