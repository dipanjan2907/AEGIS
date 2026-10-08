import dotenv from "dotenv";
import { envSchema, type EnvConfig } from "./env.schema.js";

dotenv.config();

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(result.error.format());
  throw new Error("Invalid environment variables");
}

export const env: EnvConfig = result.data;