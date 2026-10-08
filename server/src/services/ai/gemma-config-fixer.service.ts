import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import type { ConfigFinding, ConfigType } from "../../types/config-fixer.types.js";
import {
  configAIAnalysisSchema,
  type ConfigAIAnalysisResponse,
} from "../../schemas/config-ai.schema.js";
import { buildConfigFixerPrompt } from "./prompts/config-fixer.prompt.js";
import { ServiceUnavailableError } from "../../errors/service-unavailable.error.js";
import { logger } from "../../utils/logger.js";

export class GemmaConfigFixerService {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: env.GEMMA_API_KEY });
  }

  public async analyzeAndRepair(
    configText: string,
    configType: ConfigType,
    staticFindings: ConfigFinding[]
  ): Promise<ConfigAIAnalysisResponse> {
    const prompt = buildConfigFixerPrompt(configText, configType, staticFindings);

    try {
      const response = await this.client.models.generateContent({
        model: env.GEMMA_MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
        throw new ServiceUnavailableError("Gemma API returned an empty config analysis");
      }

      const parsed = JSON.parse(text);
      return configAIAnalysisSchema.parse(parsed);
    } catch (error) {
      logger.error({ err: error }, "Failed to complete Config Repair with Gemma");
      throw new ServiceUnavailableError(
        "Gemma Config Fixer service unavailable or returned invalid JSON",
        { originalError: (error as Error).message }
      );
    }
  }
}