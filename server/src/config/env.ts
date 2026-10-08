import dotenv from "dotenv";
import { envSchema, type EnvConfig } from "./env.schema.js";

dotenv.config();

const parseEnv = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => ` - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `FATAL: Invalid environment variable configuration:\n${formattedErrors}`,
    );
  }

  return result.data;
};

export const env = parseEnv();
