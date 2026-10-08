export type LogFormat = "nginx_access" | "express_json" | "auth_syslog";

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface LogIncident {
  id: string;
  timestamp: string;
  ipAddress: string;
  method: string;
  path: string;
  statusCode: number;
  attackType: string;
  severity: SeverityLevel;
  reasoning: string;
}

export interface AttackTimelineEvent {
  time: string;
  event: string;
  severity: SeverityLevel;
}

export interface LogReport {
  scanId: string;
  timestamp: string;
  logFormat: LogFormat;
  totalLogEntries: number;
  anomalousEntriesCount: number;
  threatSummary: string;
  attackTimeline: AttackTimelineEvent[];
  findings: LogIncident[];
  gemmaForensicSummary: string;
  plainEnglishAnswer: string;
}

export interface LogPreset {
  id: string;
  name: string;
  description: string;
  format: LogFormat;
  content: string;
  query: string;
}
