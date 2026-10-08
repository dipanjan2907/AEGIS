import React from "react";
import { Wrench } from "lucide-react";
import type { ConfigFinding } from "../types/config-fixer.types";

interface ConfigFindingCardProps {
  finding: ConfigFinding;
}

export const ConfigFindingCard: React.FC<ConfigFindingCardProps> = ({ finding }) => {
  const getBadgeClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30";
      case "HIGH":
        return "bg-[#ff6b35]/10 text-[#ff6b35] border-[#ff6b35]/30";
      case "MEDIUM":
        return "bg-[#ffd166]/10 text-[#ffd166] border-[#ffd166]/30";
      default:
        return "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30";
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#212630] rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold font-mono text-xs text-[#e6edf3]">
              {finding.title}
            </h4>
          </div>
          <p className="text-xs text-[#8b949e] font-sans">
            {finding.description}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${getBadgeClass(
              finding.severity
            )}`}
          >
            {finding.severity}
          </span>
          {finding.lineNumber && (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#212630] text-[#8b949e] rounded border border-[#303644]">
              Line {finding.lineNumber}
            </span>
          )}
        </div>
      </div>

      {finding.evidence && (
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#8b949e]">DETECTED EVIDENCE:</span>
          <pre className="p-2 bg-[#0d1117] border border-[#212630] rounded font-mono text-xs text-[#f87171]">
            <code>{finding.evidence}</code>
          </pre>
        </div>
      )}

      <div className="space-y-1 pt-1">
        <span className="text-[10px] font-mono text-[#62D7AE] flex items-center gap-1">
          <Wrench className="w-3 h-3" /> HARDENING RECOMMENDATION:
        </span>
        <p className="text-xs text-[#8b949e] bg-[#0d1117] p-2.5 rounded border border-[#212630] font-mono">
          {finding.recommendation}
        </p>
      </div>
    </div>
  );
};