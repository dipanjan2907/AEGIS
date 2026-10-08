import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";
import { HTTP_STATUS } from "../constants/http-status.js";

export const rateLimiterMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  message: {
    success: false,
    error: {
      message: "Too many requests from this IP. Please try again later.",
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    },
  },
});
