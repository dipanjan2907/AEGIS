import express, { type Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import { loggingMiddleware } from "./middlewares/logging.middleware.js";
import { rateLimiterMiddleware } from "./middlewares/rate-limiter.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { apiRouter } from "./routes/api.router.js";
import { healthRouter } from "./routes/health.router.js";

const allowedOrigins = new Set(
  (env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

export const createApp = (): Application => {
  const app = express();

  // Security
  app.use(helmet());

  // CORS — configurable through environment variables
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests without an Origin header
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Origin not allowed by CORS"));
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(loggingMiddleware);

  // Rate limiting
  app.use("/api", rateLimiterMiddleware);

  // Routes
  app.use("/health", healthRouter);
  app.use("/api", apiRouter);

  // Fallback and error handlers
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
};