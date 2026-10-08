import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import { logAIAnalysisSchema, type LogAIAnalysis } from "../../schemas/log-ai.schema.js";
import type {
  LogFormat,
  LogIncident,
} from "../../types/log-investigator.types.js";
import { ServiceUnavailableError } from "../../errors/service-unavailable.error.js";
import { logger } from "../../utils/logger.js";
import { buildLogInvestigatorPrompt } from "./prompts/log-investigator.prompt.js";

export class GemmaLogInvestigatorService {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: env.GEMMA_API_KEY });
  }

  public async investigate(
    logText: string,
    logFormat: LogFormat,
    findings: LogIncident[],
    plainEnglishQuery?: string,
  ): Promise<LogAIAnalysis> {
    try {
      const response = await this.client.models.generateContent({
        model: env.GEMMA_MODEL_NAME,
        contents: buildLogInvestigatorPrompt(
          logText,
          logFormat,
          findings,
          plainEnglishQuery,
        ),
        config: { responseMimeType: "application/json" },
      });
      if (!response.text) {
        throw new ServiceUnavailableError(
          "Gemma API returned an empty forensic analysis",
        );
      }
      return logAIAnalysisSchema.parse(JSON.parse(response.text));
    } catch (error) {
      logger.error({ err: error }, "Gemma Log Investigator analysis failed");
      throw new ServiceUnavailableError(
        "Gemma Log Investigator service unavailable or returned invalid JSON",
        { originalError: (error as Error).message },
      );
    }
  }
}
