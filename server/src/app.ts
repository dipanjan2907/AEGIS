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
  env.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const vercelPreviewOrigin =
  /^https:\/\/aegis-[a-z0-9-]+-dipanjan2907s-projects\.vercel\.app$/;

export const createApp = (): Application => {
  const app = express();

  // Security & Utility Middlewares
  app.use(helmet());

  app.use(
    cors({
      origin: (origin, callback) => {
        callback(
          null,
          !origin ||
            allowedOrigins.has(origin) ||
            vercelPreviewOrigin.test(origin),
        );
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(loggingMiddleware);

  // Rate limiting applied specifically to scan routes
  app.use("/api", rateLimiterMiddleware);

  // Routes
  app.use("/health", healthRouter);
  app.use("/api", apiRouter);

  // Fallback and Error Handlers
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
};
