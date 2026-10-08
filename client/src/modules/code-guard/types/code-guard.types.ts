export type VulnerabilityType =
  | "SQL_INJECTION"
  | "COMMAND_INJECTION"
  | "XSS"
  | "HARDCODED_SECRETS"
  | "DANGEROUS_EVAL";

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface SourceLocation {
  line: number;
  column: number;
}

export interface FindingEnrichment {
  findingId: string;
  explanation: string;
  attackPath: string[];
  remediation: string;
  saferCodeExample: string;
}

export interface UnifiedSecurityFinding {
  id: string;
  type: VulnerabilityType;
  severity: SeverityLevel;
  confidence: number;
  title: string;
  description: string;
  location: SourceLocation;
  evidence: string;
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
