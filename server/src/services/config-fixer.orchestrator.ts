import { randomUUID } from "node:crypto";
import { ConfigGuardScanner } from "./scanner/config-guard.scanner.js";
import { GemmaConfigFixerService } from "./ai/gemma-config-fixer.service.js";
import type { ConfigFixReport, ConfigType } from "../types/config-fixer.types.js";
import { logger } from "../utils/logger.js";

interface AnalyzeConfigParams {
  configText: string;
  configType: ConfigType;
}

export class ConfigFixerOrchestrator {
  constructor(
    private readonly scanner: ConfigGuardScanner,
    private readonly aiService: GemmaConfigFixerService
  ) {}

  public async analyzeConfig(params: AnalyzeConfigParams): Promise<ConfigFixReport> {
    const scanId = randomUUID();
    const timestamp = new Date().toISOString();

    logger.info(
      { scanId, configType: params.configType },
      "Initiating Config Fixer security audit"
    );

    // Step 1: Static Linter Rules
    const staticFindings = this.scanner.scan(params.configText, params.configType);

    // Step 2: Gemma AI Analysis & Secure Diff Generation
    let aiAnalysis;
    try {
      aiAnalysis = await this.aiService.analyzeAndRepair(
        params.configText,
        params.configType,
        staticFindings
      );
    } catch (error) {
      logger.warn(
        { scanId, err: error },
        "Gemma AI repair failed; returning static findings fallback"
      );

      return {
        scanId,
        timestamp,
        configType: params.configType,
        totalIssues: staticFindings.length,
        riskScore: Math.min(100, staticFindings.length * 20),
        findings: staticFindings,
        originalConfig: params.configText,
        securedConfig: params.configText,
        diffSummary: ["AI repair unavailable; review static recommendations manually."],
      };
    }

    return {
      scanId,
      timestamp,
      configType: params.configType,
      totalIssues: aiAnalysis.findings.length,
      riskScore: aiAnalysis.riskScore,
      findings: aiAnalysis.findings,
      originalConfig: params.configText,
      securedConfig: aiAnalysis.securedConfig,
      diffSummary: aiAnalysis.diffSummary,
    };
  }
}