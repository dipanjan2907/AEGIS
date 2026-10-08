import { randomUUID } from "node:crypto";
import type { CodeGuardScanner } from "./scanner/code-guard.scanner.js";
import type { IAIProvider } from "./ai/interfaces/ai-provider.interface.js";
import type {
  SecurityReport,
  SeveritySummary,
  UnifiedSecurityFinding,
} from "../types/report.types.js";
import type { SecurityFinding, SeverityLevel } from "../types/finding.types.js";
import { logger } from "../utils/logger.js";

interface AnalyzeCodeParams {
  code: string;
  language: "javascript" | "typescript";
}

export class SecurityAnalysisOrchestrator {
  constructor(
    private readonly scanner: CodeGuardScanner,
    private readonly aiProvider: IAIProvider,
  ) {}

  public async analyzeCode(params: AnalyzeCodeParams): Promise<SecurityReport> {
    const scanId = randomUUID();
    const timestamp = new Date().toISOString();

    logger.info(
      { scanId, language: params.language },
      "Initiating CodeGuard analysis scan",
    );

    // Step 1: Execute deterministic AST static analysis
    const findings = this.scanner.scan(params.code, params.language);

    logger.info(
      { scanId, count: findings.length },
      "Static AST analysis complete",
    );

    // Step 2: Enrich findings via Gemma AI provider if vulnerabilities exist
    let enrichedFindings: UnifiedSecurityFinding[] = [];

    if (findings.length > 0) {
      try {
        const aiResponse = await this.aiProvider.analyzeFindings(
          params.code,
          findings,
        );

        const analysisMap = new Map(
          aiResponse.analyses.map((item) => [item.findingId, item]),
        );

        enrichedFindings = findings.map((finding) => {
          const analysis = analysisMap.get(finding.id);
          return {
            ...finding,
            ...(analysis && { analysis }),
          };
        });
      } catch (error) {
        logger.warn(
          { scanId, err: error },
          "AI enrichment failed or partially failed; returning static findings only",
        );
        enrichedFindings = findings;
      }
    }

    // Step 3: Compute summary metrics and deterministic security score
    const summary = this.computeSeveritySummary(findings);
    const securityScore = this.calculateSecurityScore(summary);

    return {
      scanId,
      timestamp,
      securityScore,
      totalVulnerabilities: findings.length,
      summary,
      findings: enrichedFindings,
    };
  }

  private computeSeveritySummary(findings: SecurityFinding[]): SeveritySummary {
    const summary: SeveritySummary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    for (const finding of findings) {
      const level = finding.severity.toLowerCase() as keyof SeveritySummary;
      if (summary[level] !== undefined) {
        summary[level] += 1;
      }
    }

    return summary;
  }

  private calculateSecurityScore(summary: SeveritySummary): number {
    // Standard baseline deductions per severity
    const deductions: Record<keyof SeveritySummary, number> = {
      critical: 25,
      high: 15,
      medium: 10,
      low: 5,
      info: 0,
    };

    let totalDeduction = 0;
    for (const [key, count] of Object.entries(summary)) {
      totalDeduction += (deductions[key as keyof SeveritySummary] ?? 0) * count;
    }

    return Math.max(0, 100 - totalDeduction);
  }
}
