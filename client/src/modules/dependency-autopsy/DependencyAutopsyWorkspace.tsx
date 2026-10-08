import React, { useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";
import { DEPENDENCY_PRESETS } from "./data/dependencyPresets";
import { LockfileFormatSelector } from "./components/LockfileFormatSelector";
import { RemovalImpactCard } from "./components/RemovalImpactCard";
import { TransitiveRiskChain } from "./components/TransitiveRiskChain";
import { scanDependencyLockfile } from "./services/dependency-autopsy-api";
import type {
  DependencyReport,
  DependencyPreset,
  LockfileType,
} from "./types/dependency-autopsy.types";

const DEFAULT_PRESET = DEPENDENCY_PRESETS[0]!;

const getHighestSeverity = (
  report: DependencyReport,
): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO" => {
  const levels = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
  return (
    levels.find((level) =>
      report.findings.some((finding) => finding.severity === level),
    ) ?? "INFO"
  );
};

export const DependencyAutopsyWorkspace: React.FC = () => {
  const { recordScanEvent } = useTelemetry();
  const [lockfileType, setLockfileType] = useState<LockfileType>(
    DEFAULT_PRESET.lockfileType,
  );
  const [lockfileContent, setLockfileContent] = useState(
    DEFAULT_PRESET.lockfileContent,
  );
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<DependencyReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectPreset = (preset: DependencyPreset) => {
    setLockfileType(preset.lockfileType);
    setLockfileContent(preset.lockfileContent);
    setReport(null);
    setError(null);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    setReport(null);
    try {
      const result = await scanDependencyLockfile(lockfileContent, lockfileType);
      setReport(result);
      recordScanEvent(
        {
          moduleName: "Dependency Autopsy",
          eventType: `${result.vulnerableCount} Vulnerable Dependencies`,
          severity: getHighestSeverity(result),
          detail: `Scanned ${result.totalDependencies} packages in ${result.lockfileType}`,
        },
        result.riskScore / 2,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to scan dependency lockfile",
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full flex-col gap-4 text-[#e6edf3]">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#212630] bg-[#131720] p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-[#E8C66A]/30 bg-[#E8C66A]/10 p-2">
            <Boxes className="h-5 w-5 text-[#E8C66A]" />
          </div>
          <div>
            <h2 className="font-mono text-sm font-bold text-[#e6edf3]">
              DEPENDENCY AUTOPSY
            </h2>
            <p className="mt-1 text-xs text-[#8b949e]">
              Deterministic lockfile analysis with Gemma impact assessment
            </p>
          </div>
        </div>
        <LockfileFormatSelector value={lockfileType} onChange={setLockfileType} />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-lg border border-[#212630] bg-[#131720] p-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#8b949e]">
              <Sparkles className="h-3.5 w-3.5 text-[#E8C66A]" />
              DEMO LOCKFILES
            </div>
            <div className="flex flex-wrap gap-2">
              {DEPENDENCY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  title={preset.description}
                  className="rounded border border-[#303644] bg-[#161b22] px-2.5 py-2 text-left font-mono text-[10px] text-[#8b949e] transition-colors hover:border-[#E8C66A]/50 hover:text-[#e6edf3]"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8b949e]">
              <label htmlFor="dependency-lockfile-input">
                LOCKFILE CONTENT ({lockfileType})
              </label>
              <span>{lockfileContent.length.toLocaleString()} / 100,000</span>
            </div>
            <textarea
              id="dependency-lockfile-input"
              value={lockfileContent}
              maxLength={100_000}
              onChange={(event) => setLockfileContent(event.target.value)}
              spellCheck={false}
              className="min-h-[250px] flex-1 resize-y rounded border border-[#212630] bg-[#0d1117] p-3 font-mono text-[11px] leading-relaxed text-[#c4cbd4] outline-none focus:border-[#E8C66A]/60"
              placeholder={`Paste ${lockfileType} contents here`}
            />
          </div>

          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning || !lockfileContent.trim()}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#E8C66A] py-3 font-mono text-xs font-bold text-[#0d1117] transition-colors hover:bg-[#f1d785] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> ANALYZING SUPPLY CHAIN...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" /> RUN DEPENDENCY AUTOPSY
              </>
            )}
          </button>
        </section>

        <section className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-lg border border-[#212630] bg-[#131720] p-5">
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-[#f87171]/30 bg-[#f87171]/10 p-4 font-mono text-xs text-[#f87171]">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {isScanning ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#303644] text-center">
              <Loader2 className="h-9 w-9 animate-spin text-[#E8C66A]" />
              <p className="font-mono text-xs font-bold">TRACING DEPENDENCY CHAINS</p>
              <p className="text-[11px] text-[#8b949e]">
                Checking known vulnerable signatures and assessing update impact...
              </p>
            </div>
          ) : report ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Metric label="RISK SCORE" value={`${report.riskScore}/100`} danger={report.riskScore > 0} />
                <Metric label="PACKAGES" value={String(report.totalDependencies)} />
                <Metric label="VULNERABLE" value={String(report.vulnerableCount)} danger={report.vulnerableCount > 0} />
              </div>
              {report.findings.length > 0 ? (
                <>
                  <TransitiveRiskChain report={report} />
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-[#e6edf3]">
                      <ShieldCheck className="h-4 w-4 text-[#E8C66A]" />
                      REMEDIATION & REMOVAL IMPACT
                    </h3>
                    {report.findings.map((finding) => (
                      <RemovalImpactCard key={finding.id} finding={finding} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-[#62D7AE]/20 bg-[#62D7AE]/5 p-8 text-center">
                  <ShieldCheck className="h-10 w-10 text-[#62D7AE]" />
                  <p className="font-mono text-xs font-bold text-[#62D7AE]">
                    NO KNOWN VULNERABLE SIGNATURES
                  </p>
                  <p className="text-[11px] text-[#8b949e]">
                    The parsed lockfile contained no packages matching the current deterministic ruleset.
                  </p>
                </div>
              )}
              <p className="border-t border-[#212630] pt-3 font-mono text-[9px] text-[#64748b]">
                SCAN {report.scanId} · {new Date(report.timestamp).toLocaleString()}
              </p>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#303644] p-8 text-center text-[#8b949e]">
              <Boxes className="h-10 w-10 text-[#E8C66A]/40" />
              <p className="font-mono text-xs">
                Select a demo lockfile or paste content, then run the scan.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; danger?: boolean }> = ({
  label,
  value,
  danger = false,
}) => (
  <div className="rounded-lg border border-[#212630] bg-[#161b22] p-3">
    <div className="font-mono text-[9px] text-[#8b949e]">{label}</div>
    <div className={`mt-1 font-mono text-lg font-extrabold ${danger ? "text-[#f87171]" : "text-[#E8C66A]"}`}>
      {value}
    </div>
  </div>
);
