import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "production",
  PORT: process.env.PORT || "3000",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  CORS_ORIGINS:
    process.env.CORS_ORIGINS || "http://localhost:5173",
};