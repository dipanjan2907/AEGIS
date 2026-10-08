import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";
import type {
  LogFormat,
  LogReport,
  SeverityLevel,
} from "../types/log-investigator.types.js";
import { LogGuardScanner } from "./scanner/log-guard.scanner.js";
import { GemmaLogInvestigatorService } from "./ai/gemma-log-investigator.service.js";

interface InvestigateLogsParams {
  logText: string;
  logFormat: LogFormat;
  plainEnglishQuery?: string;
}

const riskWeights: Record<SeverityLevel, number> = {
  CRITICAL: 40,
  HIGH: 25,
  MEDIUM: 15,
  LOW: 5,
  INFO: 0,
};

export class LogInvestigatorOrchestrator {
  constructor(
    private readonly scanner: LogGuardScanner,
    private readonly aiService: GemmaLogInvestigatorService,
  ) {}

  public async investigate(
    params: InvestigateLogsParams,
  ): Promise<LogReport> {
    const scanId = randomUUID();
    const timestamp = new Date().toISOString();
    logger.info(
      { scanId, logFormat: params.logFormat },
      "Initiating Security Log Investigator analysis",
    );

    const staticAnalysis = this.scanner.scan(params.logText, params.logFormat);
    const report: LogReport = {
      scanId,
      timestamp,
      logFormat: params.logFormat,
      totalLogEntries: staticAnalysis.totalLogEntries,
      anomalousEntriesCount: staticAnalysis.anomalousEntriesCount,
      threatSummary: staticAnalysis.threatSummary,
      attackTimeline: staticAnalysis.attackTimeline,
      findings: staticAnalysis.findings,
      gemmaForensicSummary:
        "AI forensic analysis is not available; the report contains deterministic log-pattern findings only.",
      plainEnglishAnswer: "",
    };

    try {
      const aiAnalysis = await this.aiService.investigate(
        params.logText,
        params.logFormat,
        report.findings,
        params.plainEnglishQuery,
      );
      report.attackTimeline = aiAnalysis.attackTimeline;
      report.gemmaForensicSummary = aiAnalysis.gemmaForensicSummary;
      report.plainEnglishAnswer = aiAnalysis.plainEnglishAnswer;
    } catch (error) {
      logger.warn(
        { scanId, err: error },
        "Gemma forensic analysis unavailable; returning deterministic findings",
      );
      if (params.plainEnglishQuery) {
        report.plainEnglishAnswer =
          `Automated AI analysis was unavailable. Deterministic rules identified ${report.anomalousEntriesCount} anomalous log entries; use the findings below to assess the question against the raw evidence.`;
      }
    }

    const riskScore = Math.min(
      100,
      report.findings.reduce(
        (score, finding) => score + riskWeights[finding.severity],
        0,
      ),
    );
    logger.info(
      {
        scanId,
        totalLogEntries: report.totalLogEntries,
        anomalousEntriesCount: report.anomalousEntriesCount,
        riskScore,
      },
      "Completed Security Log Investigator analysis",
    );

    return report;
  }
}
