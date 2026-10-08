import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/not-found.error.js";

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.path}`));
};
