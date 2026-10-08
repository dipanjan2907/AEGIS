import type {
  AttackTimelineEvent,
  LogFormat,
  LogIncident,
  SeverityLevel,
} from "../../types/log-investigator.types.js";

interface ParsedLogEntry {
  lineNumber: number;
  timestamp: string;
  ipAddress: string;
  method: string;
  path: string;
  statusCode: number;
  userAgent: string;
  raw: string;
  authFailure: boolean;
}

export interface LogScanResult {
  totalLogEntries: number;
  anomalousEntriesCount: number;
  threatSummary: string;
  attackTimeline: AttackTimelineEvent[];
  findings: LogIncident[];
}

const UNKNOWN_IP = "unknown";

const normalizeTimestamp = (value: string): string => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};

const parseNginxEntry = (
  line: string,
  lineNumber: number,
): ParsedLogEntry | null => {
  const match = line.match(
    /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"(?:(\S+)\s+(\S+)(?:\s+HTTP\/[\d.]+)?|([^"]+))"\s+(\d{3})\s+\S+(?:\s+"[^"]*")?(?:\s+"([^"]*)")?/,
  );
  if (!match) return null;
  const [, ipAddress, timestamp, method, path, authEvent, status, userAgent] =
    match;
  return {
    lineNumber,
    timestamp: normalizeTimestamp(timestamp ?? ""),
    ipAddress: ipAddress ?? UNKNOWN_IP,
    method: method ?? (authEvent ? "AUTH" : "-"),
    path: path ?? authEvent ?? "-",
    statusCode: Number(status),
    userAgent: userAgent ?? "",
    raw: line,
    authFailure: false,
  };
};

const parseExpressEntry = (
  line: string,
  lineNumber: number,
): ParsedLogEntry | null => {
  let value: unknown;
  try {
    value = JSON.parse(line);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const statusValue = record.statusCode ?? record.status ?? record.status_code;
  const statusCode = Number(statusValue);
  const timestampValue =
    record.timestamp ?? record.time ?? record["@timestamp"] ?? "";
  const ipValue =
    record.ipAddress ??
    record.ip ??
    record.remoteAddress ??
    record.remote_addr ??
    UNKNOWN_IP;
  const methodValue = record.method ?? record.httpMethod ?? "-";
  const pathValue = record.path ?? record.url ?? record.originalUrl ?? "-";
  const userAgentValue = record.userAgent ?? record.user_agent ?? "";

  if (typeof timestampValue !== "string" && typeof timestampValue !== "number") {
    return null;
  }
  if (
    typeof ipValue !== "string" ||
    typeof methodValue !== "string" ||
    typeof pathValue !== "string" ||
    !Number.isFinite(statusCode)
  ) {
    return null;
  }

  return {
    lineNumber,
    timestamp: normalizeTimestamp(String(timestampValue)),
    ipAddress: ipValue,
    method: methodValue.toUpperCase(),
    path: pathValue,
    statusCode,
    userAgent: typeof userAgentValue === "string" ? userAgentValue : "",
    raw: line,
    authFailure:
      statusCode === 401 ||
      statusCode === 403 ||
      /(?:failed|failure|invalid)\s+(?:password|login|authentication)|authentication failure/i.test(
        line,
      ),
  };
};

const parseAuthSyslogEntry = (
  line: string,
  lineNumber: number,
): ParsedLogEntry | null => {
  const timestampMatch = line.match(
    /^([A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+/,
  );
  const ipMatch = line.match(/\bfrom\s+((?:\d{1,3}\.){3}\d{1,3}|[a-f\d:]{3,})\b/i);
  if (!timestampMatch || !ipMatch) return null;
  const year = new Date().getUTCFullYear();
  const timestamp = normalizeTimestamp(
    `${timestampMatch[1]} ${year} UTC`,
  );
  const failure = /failed|failure|invalid user|authentication failure/i.test(
    line,
  );
  const success = /accepted (?:password|publickey)|session opened/i.test(line);
  return {
    lineNumber,
    timestamp,
    ipAddress: ipMatch[1] ?? UNKNOWN_IP,
    method: "AUTH",
    path: line.match(/(?:sshd|sudo|login)(?:\[\d+\])?:\s*(.*)/i)?.[1] ?? line,
    statusCode: success ? 200 : failure ? 401 : 0,
    userAgent: "",
    raw: line,
    authFailure: failure,
  };
};

const parseEntry = (
  line: string,
  lineNumber: number,
  format: LogFormat,
): ParsedLogEntry | null => {
  if (format === "nginx_access") return parseNginxEntry(line, lineNumber);
  if (format === "express_json") return parseExpressEntry(line, lineNumber);
  return parseAuthSyslogEntry(line, lineNumber);
};

const createIncident = (
  entry: ParsedLogEntry,
  attackType: string,
  severity: SeverityLevel,
  reasoning: string,
): LogIncident => ({
  id: `log-${entry.lineNumber}-${attackType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  timestamp: entry.timestamp,
  ipAddress: entry.ipAddress,
  method: entry.method,
  path: entry.path,
  statusCode: entry.statusCode,
  attackType,
  severity,
  reasoning,
});

const buildThreatSummary = (findings: LogIncident[]): string => {
  if (findings.length === 0) {
    return "No suspicious patterns matched the current deterministic rules.";
  }
  const counts = new Map<string, number>();
  for (const finding of findings) {
    counts.set(finding.attackType, (counts.get(finding.attackType) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([attack, count]) => `${attack}: ${count}`)
    .join(" · ");
};

export class LogGuardScanner {
  public scan(logText: string, logFormat: LogFormat): LogScanResult {
    const lines = logText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const entries = lines.flatMap((line, index) => {
      const parsed = parseEntry(line, index + 1, logFormat);
      return parsed ? [parsed] : [];
    });
    const findings: LogIncident[] = [];

    for (const entry of entries) {
      const normalized = `${entry.path} ${entry.raw}`.replace(/%2e/gi, ".");

      if (/(?:\.\.[/\\]){2,}|%2e%2e(?:%2f|%5c)/i.test(normalized)) {
        findings.push(
          createIncident(
            entry,
            "Path Traversal",
            "HIGH",
            "The request contains repeated parent-directory traversal segments that may expose files outside the intended web root.",
          ),
        );
      }
      if (/\bUNION\s+(?:ALL\s+)?SELECT\b/i.test(normalized)) {
        findings.push(
          createIncident(
            entry,
            "SQLi Probe",
            "HIGH",
            "The request includes a UNION SELECT sequence commonly used to probe for SQL injection.",
          ),
        );
      }
      if (/\b(?:nmap|nikto)(?:\/[\d.]+)?\b/i.test(entry.userAgent)) {
        findings.push(
          createIncident(
            entry,
            "Vulnerability Scanner",
            "MEDIUM",
            "The user-agent identifies a known network or web vulnerability scanning tool.",
          ),
        );
      }
    }

    const failedAuthByIp = new Map<string, ParsedLogEntry[]>();
    for (const entry of entries) {
      if (
        entry.authFailure &&
        (entry.statusCode === 401 ||
          entry.statusCode === 403 ||
          entry.statusCode === 0)
      ) {
        const failures = failedAuthByIp.get(entry.ipAddress) ?? [];
        failures.push(entry);
        failedAuthByIp.set(entry.ipAddress, failures);
      }
    }
    for (const [ipAddress, failures] of failedAuthByIp) {
      if (failures.length < 3) continue;
      for (const entry of failures) {
        findings.push(
          createIncident(
            entry,
            "Credential Stuffing",
            "HIGH",
            `${failures.length} failed authentication attempts from ${ipAddress} form a brute-force cluster.`,
          ),
        );
      }
    }

    findings.sort((left, right) => {
      const leftTime = Date.parse(left.timestamp);
      const rightTime = Date.parse(right.timestamp);
      if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
        return left.timestamp.localeCompare(right.timestamp);
      }
      return leftTime - rightTime;
    });
    const attackTimeline = findings.map((finding) => ({
      time: finding.timestamp,
      event: `${finding.attackType} from ${finding.ipAddress} ${finding.method} ${finding.path} (HTTP ${finding.statusCode})`,
      severity: finding.severity,
    }));

    return {
      totalLogEntries: lines.length,
      anomalousEntriesCount: new Set(
        findings.map((finding) => finding.id.split("-")[1]),
      ).size,
      threatSummary: buildThreatSummary(findings),
      attackTimeline,
      findings,
    };
  }
}
