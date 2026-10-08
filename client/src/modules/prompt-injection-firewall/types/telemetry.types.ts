export interface ThreatCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SecurityPosture {
  score: number; // 0 - 100
  label: "OPTIMAL" | "ELEVATED RISK" | "CRITICAL VULNERABILITIES";
  statusColor: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  moduleName: string;
  eventType: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  detail: string;
}

export interface EngineMetadata {
  toolId: string;
  engineName: string;
  mode: string;
  primaryTech: string;
  detectionLayers: string[];
  rulesCount: number;
  aiModel: string;
  accentColor: string;
}

export interface SystemTelemetry {
  connectionStatus: "CONNECTED" | "DEGRADED" | "DISCONNECTED";
  activeVersion: string;
  buildNumber: string;
  posture: SecurityPosture;
  threats: ThreatCounts;
  sparklineData: number[]; // 8 data points for visual activity signal
  recentEvents: ActivityEvent[];
  engines: Record<string, EngineMetadata>;
}
