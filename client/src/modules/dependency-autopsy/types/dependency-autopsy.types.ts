export type LockfileType = "package-lock.json" | "yarn.lock" | "pnpm-lock.yaml";

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface DependencyFinding {
  id: string;
  packageName: string;
  currentVersion: string;
  fixedVersion: string;
  cveId: string;
  severity: SeverityLevel;
  transitiveChain: string[];
  impactAssessment: string;
  summary: string;
}

export interface DependencyReport {
  scanId: string;
  timestamp: string;
  lockfileType: LockfileType;
  totalDependencies: number;
  vulnerableCount: number;
  riskScore: number;
  findings: DependencyFinding[];
  transitiveGraph: Record<string, string[]>;
}

export interface DependencyPreset {
  id: string;
  name: string;
  description: string;
  lockfileType: LockfileType;
  lockfileContent: string;
}
