import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "production",
  PORT: process.env.PORT || "3000",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  CORS_ORIGINS: process.env.CORS_ORIGINS || "http://localhost:5173",

  // Rate limiting
  RATE_LIMIT_WINDOW_MS:
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS:
    Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // Gemma / Gemini
  GEMMA_API_KEY: process.env.GEMMA_API_KEY || "",
  GEMMA_MODEL_NAME:
    process.env.GEMMA_MODEL_NAME || "gemma-3-27b-it",
};