import React, { useState } from "react";
import { useTelemetry } from "../../context/TelemetryContext";
import {
  Play,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  Sparkles,
  FileCode2,
  HelpCircle,
  CheckCircle2,
  Activity,
  MessageSquare,
} from "lucide-react";
import type {
  LogFormat,
  LogReport,
  SeverityLevel,
} from "./types/log-investigator.types";
import { scanSecurityLogs } from "./services/log-investigator-api";
import { LOG_PRESETS } from "./data/logPresets";
import { LogFormatSelector } from "./components/LogFormatSelector";
import { AttackTimeline } from "./components/AttackTimeline";
import { IncidentInspectorCard } from "./components/IncidentInspectorCard";

const getSeverityWeight = (severity: SeverityLevel): number => {
  switch (severity) {
    case "CRITICAL":
      return 25;
    case "HIGH":
      return 15;
    case "MEDIUM":
      return 10;
    case "LOW":
      return 5;
    case "INFO":
    default:
      return 0;
  }
};

export const LogInvestigatorWorkspace: React.FC = () => {
  const [logText, setLogText] = useState<string>(LOG_PRESETS[0]?.content || "");
  const [logFormat, setLogFormat] = useState<LogFormat>(
    LOG_PRESETS[0]?.format || "nginx_access",
  );
  const [plainEnglishQuery, setPlainEnglishQuery] = useState<string>(
    LOG_PRESETS[0]?.query || "",
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<LogReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { recordScanEvent } = useTelemetry();

  const handleSelectPreset = (presetId: string) => {
    const preset = LOG_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setLogText(preset.content);
      setLogFormat(preset.format);
      setPlainEnglishQuery(preset.query);
    }
  };

  const handleScan = async () => {
    if (!logText.trim()) return;
    setIsScanning(true);
    setError(null);

    try {
      const result = await scanSecurityLogs(
        logText,
        logFormat,
        plainEnglishQuery,
      );
      setReport(result);

      if (result.findings.length > 0) {
        const highestSeverity = result.findings.reduce<SeverityLevel>(
          (prev, curr) => {
            const weights: Record<SeverityLevel, number> = {
              CRITICAL: 5,
              HIGH: 4,
              MEDIUM: 3,
              LOW: 2,
              INFO: 1,
            };
            return weights[curr.severity] > weights[prev] ? curr.severity : prev;
          },
          "INFO",
        );

        const deduction = getSeverityWeight(highestSeverity);

        recordScanEvent(
          {
            moduleName: "Security Log Investigator",
            eventType: "Security Incident Detected",
            severity: highestSeverity,
            detail: `${result.anomalousEntriesCount} anomalous log entries detected in ${result.logFormat}`,
          },
          deduction,
        );
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full gap-4 text-[#e6edf3]">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#131720] border border-[#212630] rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-[#A99AEF]/10 border border-[#A99AEF]/30 text-[#A99AEF]">
            <FileCode2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono text-[#e6edf3]">
              SECURITY LOG INVESTIGATOR
            </h2>
            <p className="text-[11px] font-mono text-[#8b949e]">
              Forensic Log Analysis & Plain-English Query Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LogFormatSelector value={logFormat} onChange={setLogFormat} />
          <button
            onClick={handleScan}
            disabled={isScanning || !logText.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-[#A99AEF] text-[#0d1117] hover:bg-[#bfaeff] font-mono font-bold text-xs rounded transition-all duration-200 shadow-lg shadow-[#A99AEF]/10 disabled:opacity-50 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> ANALYZING LOGS...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> RUN LOG INVESTIGATION
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left Panel: Presets & Inputs */}
        <div className="bg-[#131720] border border-[#212630] rounded-lg p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Demo Presets */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8b949e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A99AEF]" /> FORENSIC DEMO PRESETS:
            </span>
            <div className="flex flex-wrap gap-2">
              {LOG_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className="px-3 py-1.5 bg-[#161b22] border border-[#212630] hover:border-[#A99AEF]/50 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Plain English Query Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8b949e] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#A99AEF]" />
              PLAIN-ENGLISH FORENSIC QUESTION (OPTIONAL):
            </label>
            <input
              type="text"
              value={plainEnglishQuery}
              onChange={(e) => setPlainEnglishQuery(e.target.value)}
              placeholder="e.g. Did any attacker gain access, or were these only blocked probes?"
              className="w-full bg-[#0d1117] border border-[#212630] rounded p-2.5 font-mono text-xs text-[#e6edf3] focus:border-[#A99AEF] outline-none"
            />
          </div>

          {/* Log Raw Textarea */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <label className="text-xs font-mono text-[#8b949e] flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-[#A99AEF]" />
              RAW ACCESS / AUDIT LOG CONTENT:
            </label>
            <textarea
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              placeholder="Paste raw log lines here..."
              className="w-full flex-1 bg-[#0d1117] border border-[#212630] rounded p-3 font-mono text-xs text-[#e6edf3] focus:border-[#A99AEF] outline-none resize-none min-h-[220px]"
            />
          </div>
        </div>

        {/* Right Panel: Results & Incident Timeline */}
        <div className="bg-[#131720] border border-[#212630] rounded-lg p-5 flex flex-col gap-5 overflow-y-auto">
          {error && (
            <div className="p-4 bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg flex items-center gap-3 text-[#f87171] text-xs font-mono">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isScanning ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#212630] rounded-lg text-[#8b949e] animate-pulse">
              <Loader2 className="w-10 h-10 text-[#A99AEF] animate-spin mb-3" />
              <p className="font-mono text-xs text-[#e6edf3] font-bold">
                ANALYZING LOG INCIDENTS & CONSTRUCTING TIMELINE...
              </p>
              <p className="font-mono text-[11px] text-[#8b949e] mt-1">
                Parsing HTTP logs, executing heuristic rules, and querying Gemma AI...
              </p>
            </div>
          ) : report ? (
            <>
              {/* Summary Stats Header */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#161b22] border border-[#212630] rounded-lg">
                  <span className="text-[10px] font-mono text-[#8b949e] block">
                    TOTAL ENTRIES
                  </span>
                  <span className="text-xl font-mono font-bold text-[#e6edf3]">
                    {report.totalLogEntries}
                  </span>
                </div>
                <div className="p-3 bg-[#161b22] border border-[#212630] rounded-lg">
                  <span className="text-[10px] font-mono text-[#8b949e] block">
                    ANOMALIES DETECTED
                  </span>
                  <span
                    className={`text-xl font-mono font-bold ${
                      report.anomalousEntriesCount > 0
                        ? "text-[#fb923c]"
                        : "text-[#62D7AE]"
                    }`}
                  >
                    {report.anomalousEntriesCount}
                  </span>
                </div>
                <div className="p-3 bg-[#161b22] border border-[#212630] rounded-lg">
                  <span className="text-[10px] font-mono text-[#8b949e] block">
                    LOG FORMAT
                  </span>
                  <span className="text-xs font-mono font-bold text-[#A99AEF] uppercase">
                    {report.logFormat.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Threat Summary */}
              {report.threatSummary && (
                <div className="p-3.5 bg-[#161b22] border border-[#212630] rounded-lg font-mono text-xs text-[#c4cbd4] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#A99AEF] shrink-0" />
                  <span>
                    <strong className="text-[#e6edf3]">Threat Summary:</strong>{" "}
                    {report.threatSummary}
                  </span>
                </div>
              )}

              {/* Plain English Query Answer (if present) */}
              {report.plainEnglishAnswer && (
                <div className="p-4 bg-[#A99AEF]/10 border border-[#A99AEF]/30 rounded-lg space-y-2">
                  <h4 className="font-mono text-xs font-bold text-[#A99AEF] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    FORENSIC QUERY ANSWER
                  </h4>
                  <p className="text-xs text-[#e6edf3] leading-relaxed font-sans">
                    {report.plainEnglishAnswer}
                  </p>
                </div>
              )}

              {/* Gemma Forensic Summary */}
              {report.gemmaForensicSummary && (
                <div className="p-4 bg-[#161b22] border border-[#212630] rounded-lg space-y-2">
                  <h4 className="font-mono text-xs font-bold text-[#e6edf3] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#A99AEF]" />
                    GEMMA FORENSIC SUMMARY
                  </h4>
                  <p className="text-xs text-[#c4cbd4] leading-relaxed font-sans">
                    {report.gemmaForensicSummary}
                  </p>
                </div>
              )}

              {/* Visual Attack Timeline */}
              <AttackTimeline events={report.attackTimeline} />

              {/* Incident Inspector Cards */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-bold text-[#e6edf3] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#A99AEF]" />
                  DETECTED INCIDENTS ({report.findings.length})
                </h3>
                {report.findings.length > 0 ? (
                  report.findings.map((incident) => (
                    <IncidentInspectorCard key={incident.id} incident={incident} />
                  ))
                ) : (
                  <div className="p-6 text-center border border-dashed border-[#212630] rounded-lg text-[#8b949e] font-mono text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#62D7AE]" />
                    No suspicious pattern incidents detected in the log sample.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#212630] rounded-lg text-[#8b949e]">
              <ShieldAlert className="w-12 h-12 text-[#A99AEF]/40 mb-3" />
              <p className="font-mono text-xs">
                Select a preset or paste custom logs, then click <br />
                <strong className="text-[#e6edf3]">"RUN LOG INVESTIGATION"</strong>{" "}
                to analyze.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

