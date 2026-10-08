import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";
import type {
  DependencyFinding,
  DependencyReport,
  LockfileType,
} from "../types/dependency-autopsy.types.js";
import { DependencyGuardScanner } from "./scanner/dependency-guard.scanner.js";
import { GemmaDependencyAutopsyService } from "./ai/gemma-dependency-autopsy.service.js";

interface ScanDependencyParams {
  lockfileContent: string;
  lockfileType: LockfileType;
}

const severityWeights: Record<DependencyFinding["severity"], number> = {
  CRITICAL: 40,
  HIGH: 25,
  MEDIUM: 15,
  LOW: 5,
};

export class DependencyAutopsyOrchestrator {
  constructor(
    private readonly scanner: DependencyGuardScanner,
    private readonly aiService: GemmaDependencyAutopsyService,
  ) {}

  public async scan(params: ScanDependencyParams): Promise<DependencyReport> {
    const scanId = randomUUID();
    const timestamp = new Date().toISOString();
    logger.info(
      { scanId, lockfileType: params.lockfileType },
      "Initiating Dependency Autopsy scan",
    );

    const staticScan = this.scanner.scan(
      params.lockfileContent,
      params.lockfileType,
    );
    const riskScore = Math.min(
      100,
      staticScan.findings.reduce(
        (score, finding) => score + severityWeights[finding.severity],
        0,
      ),
    );
    const report: DependencyReport = {
      scanId,
      timestamp,
      lockfileType: params.lockfileType,
      totalDependencies: staticScan.totalDependencies,
      vulnerableCount: staticScan.findings.length,
      riskScore,
      findings: staticScan.findings,
      transitiveGraph: staticScan.transitiveGraph,
    };

    try {
      const aiAnalysis = await this.aiService.analyzeImpact(report);
      const enrichmentById = new Map(
        aiAnalysis.findings.map((finding) => [finding.id, finding]),
      );
      report.findings = report.findings.map((finding) => {
        const enrichment = enrichmentById.get(finding.id);
        return enrichment
          ? {
              ...finding,
              impactAssessment: enrichment.impactAssessment,
              summary: enrichment.summary,
            }
          : finding;
      });
    } catch (error) {
      logger.warn(
        { scanId, err: error },
        "Gemma impact analysis unavailable; returning deterministic findings",
      );
    }

    return report;
  }
}
