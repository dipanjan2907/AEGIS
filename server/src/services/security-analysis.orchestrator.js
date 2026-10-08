import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";
export class SecurityAnalysisOrchestrator {
    scanner;
    aiProvider;
    constructor(scanner, aiProvider) {
        this.scanner = scanner;
        this.aiProvider = aiProvider;
    }
    async analyzeCode(params) {
        const scanId = randomUUID();
        const timestamp = new Date().toISOString();
        logger.info({ scanId, language: params.language }, "Initiating CodeGuard analysis scan");
        // Step 1: Execute deterministic AST static analysis
        const findings = this.scanner.scan(params.code, params.language);
        logger.info({ scanId, count: findings.length }, "Static AST analysis complete");
        // Step 2: Enrich findings via Gemma AI provider if vulnerabilities exist
        let enrichedFindings = [];
        if (findings.length > 0) {
            try {
                const aiResponse = await this.aiProvider.analyzeFindings(params.code, findings);
                const analysisMap = new Map(aiResponse.analyses.map((item) => [item.findingId, item]));
                enrichedFindings = findings.map((finding) => {
                    const analysis = analysisMap.get(finding.id);
                    return {
                        ...finding,
                        ...(analysis && { analysis }),
                    };
                });
            }
            catch (error) {
                logger.warn({ scanId, err: error }, "AI enrichment failed or partially failed; returning static findings only");
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
    computeSeveritySummary(findings) {
        const summary = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0,
        };
        for (const finding of findings) {
            const level = finding.severity.toLowerCase();
            if (summary[level] !== undefined) {
                summary[level] += 1;
            }
        }
        return summary;
    }
    calculateSecurityScore(summary) {
        // Standard baseline deductions per severity
        const deductions = {
            critical: 25,
            high: 15,
            medium: 10,
            low: 5,
            info: 0,
        };
        let totalDeduction = 0;
        for (const [key, count] of Object.entries(summary)) {
            totalDeduction += (deductions[key] ?? 0) * count;
        }
        return Math.max(0, 100 - totalDeduction);
    }
}
//# sourceMappingURL=security-analysis.orchestrator.js.map