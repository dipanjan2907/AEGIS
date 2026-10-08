import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const startServer = (): void => {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
      },
      `AEGIS Backend Service online and listening on port ${env.PORT}`,
    );
  });

  const handleShutdown = (signal: string): void => {
    logger.info(`Received ${signal}. Initiating graceful shutdown...`);
    server.close(() => {
      logger.info("HTTP server closed. Exiting process.");
      process.exit(0);
    });

    // Force close if graceful shutdown exceeds timeout
    setTimeout(() => {
      logger.error("Forced shutdown due to timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
};

startServer();
