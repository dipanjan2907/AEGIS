import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import type { PromptFinding } from "../../types/prompt-firewall.types.js";
import {
  promptAIAnalysisSchema,
  type PromptAIAnalysisResponse,
} from "../../schemas/prompt-ai.schema.js";
import { buildPromptFirewallPrompt } from "./prompts/prompt-firewall.prompt.js";
import { ServiceUnavailableError } from "../../errors/service-unavailable.error.js";
import { logger } from "../../utils/logger.js";

export class GemmaPromptFirewallService {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: env.GEMMA_API_KEY });
  }

  public async analyzeAndSanitize(
    rawInput: string,
    targetAgentRole: string,
    staticFindings: PromptFinding[],
  ): Promise<PromptAIAnalysisResponse> {
    const prompt = buildPromptFirewallPrompt(
      rawInput,
      targetAgentRole,
      staticFindings,
    );

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
        throw new ServiceUnavailableError(
          "Gemma API returned an empty analysis",
        );
      }

      const parsed = JSON.parse(text);
      return promptAIAnalysisSchema.parse(parsed);
    } catch (error) {
      logger.error(
        { err: error },
        "Failed to complete Prompt Firewall analysis with Gemma",
      );
      throw new ServiceUnavailableError(
        "AI Prompt Firewall analysis provider unavailable or returned malformed JSON",
        { originalError: (error as Error).message },
      );
    }
  }
}
