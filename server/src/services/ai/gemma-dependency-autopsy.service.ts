import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import {
  dependencyAIAnalysisSchema,
  type DependencyAIAnalysis,
} from "../../schemas/dependency-ai.schema.js";
import type { DependencyReport } from "../../types/dependency-autopsy.types.js";
import { ServiceUnavailableError } from "../../errors/service-unavailable.error.js";
import { logger } from "../../utils/logger.js";
import { buildDependencyAutopsyPrompt } from "./prompts/dependency-autopsy.prompt.js";

export class GemmaDependencyAutopsyService {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: env.GEMMA_API_KEY });
  }

  public async analyzeImpact(
    report: DependencyReport,
  ): Promise<DependencyAIAnalysis> {
    if (report.findings.length === 0) {
      return dependencyAIAnalysisSchema.parse(report);
    }

    try {
      const response = await this.client.models.generateContent({
        model: env.GEMMA_MODEL_NAME,
        contents: buildDependencyAutopsyPrompt(report),
        config: { responseMimeType: "application/json" },
      });
      if (!response.text) {
        throw new ServiceUnavailableError(
          "Gemma API returned an empty dependency impact analysis",
        );
      }
      return dependencyAIAnalysisSchema.parse(JSON.parse(response.text));
    } catch (error) {
      logger.error({ err: error }, "Gemma Dependency Autopsy analysis failed");
      throw new ServiceUnavailableError(
        "Gemma Dependency Autopsy service unavailable or returned invalid JSON",
        { originalError: (error as Error).message },
      );
    }
  }
}
