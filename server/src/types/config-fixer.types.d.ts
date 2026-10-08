export type ConfigType = "nginx" | "dockerfile" | "env";
export type ConfigSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export interface ConfigFinding {
    id: string;
    ruleId: string;
    severity: ConfigSeverity;
    title: string;
    description: string;
    lineNumber?: number;
    evidence: string;
    recommendation: string;
}
export interface ConfigFixReport {
    scanId: string;
    timestamp: string;
    configType: ConfigType;
    totalIssues: number;
    riskScore: number;
    findings: ConfigFinding[];
    originalConfig: string;
    securedConfig: string;
    diffSummary: string[];
}
//# sourceMappingURL=config-fixer.types.d.ts.map