import type { SecurityFinding } from "./finding.types.js";
export interface FindingEnrichment {
    findingId: string;
    explanation: string;
    attackPath: string[];
    remediation: string;
    saferCodeExample: string;
}
export interface UnifiedSecurityFinding extends SecurityFinding {
    analysis?: FindingEnrichment;
}
export interface SeveritySummary {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
}
export interface SecurityReport {
    scanId: string;
    timestamp: string;
    securityScore: number;
    totalVulnerabilities: number;
    summary: SeveritySummary;
    findings: UnifiedSecurityFinding[];
}
//# sourceMappingURL=report.types.d.ts.map