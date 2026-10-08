import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import type { IAIProvider } from "./interfaces/ai-provider.interface.js";
import type { SecurityFinding } from "../../types/finding.types.js";
import {
  aiAnalysisResponseSchema,
  type AIAnalysisResponse,
} from "../../schemas/ai-response.schema.js";
import { buildSecurityAnalysisPrompt } from "./prompts/security-analysis.prompt.js";
import { ServiceUnavailableError } from "../../errors/service-unavailable.error.js";
import { logger } from "../../utils/logger.js";

export class GemmaProviderService implements IAIProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: env.GEMMA_API_KEY });
  }

  public async analyzeFindings(
    code: string,
    findings: SecurityFinding[],
  ): Promise<AIAnalysisResponse> {
    if (findings.length === 0) {
      return { analyses: [] };
    }

    const prompt = buildSecurityAnalysisPrompt(code, findings);

    try {
      const response = await this.client.models.generateContent({
        model: env.GEMMA_MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new ServiceUnavailableError(
          "Gemma AI returned an empty response",
        );
      }

      const parsedJson: unknown = JSON.parse(responseText);
      const validatedResult = aiAnalysisResponseSchema.parse(parsedJson);

      return validatedResult;
    } catch (error) {
      logger.error(
        { err: error },
        "Failed to process AI vulnerability enrichment with Gemma",
      );
      throw new ServiceUnavailableError(
        "AI security analysis provider unavailable or returned malformed response",
        { originalError: (error as Error).message },
      );
    }
  }
}
