export type VulnerabilityType = "SQL_INJECTION" | "COMMAND_INJECTION" | "XSS" | "HARDCODED_SECRETS" | "DANGEROUS_EVAL";
export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export interface SourceLocation {
    line: number;
    column: number;
}
export interface SecurityFinding {
    id: string;
    type: VulnerabilityType;
    severity: SeverityLevel;
    confidence: number;
    title: string;
    description: string;
    location: SourceLocation;
    evidence: string;
}
//# sourceMappingURL=finding.types.d.ts.map