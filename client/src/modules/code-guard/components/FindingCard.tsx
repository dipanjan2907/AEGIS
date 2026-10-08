import React, { useState } from "react";
import { Info, CheckCircle2, Copy, Check } from "lucide-react";
import type {
  UnifiedSecurityFinding,
  SeverityLevel,
} from "../types/code-guard.types";
import { AttackPathViewer } from "./AttackPathViewer";

interface FindingCardProps {
  finding: UnifiedSecurityFinding;
  index: number;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
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
    <div className="bg-[#161b22] border border-[#212630] rounded-lg p-5 space-y-5">
      {/* Finding Title Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8b949e]">
              #{index + 1}
            </span>
            <h4 className="font-bold font-mono text-sm text-[#e6edf3]">
              {finding.title}
            </h4>
          </div>
          <p className="text-xs text-[#8b949e] font-sans">
            {finding.description}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${getSeverityBadge(
              finding.severity,
            )}`}
          >
            {finding.severity}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#212630] text-[#8b949e] rounded border border-[#303644]">
            Line {finding.location.line}
          </span>
        </div>
      </div>

      {/* Static Analysis Evidence */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-[#8b949e]">
          ESTABLISHED EVIDENCE:
        </span>
        <pre className="p-3 bg-[#0d1117] border border-[#212630] rounded font-mono text-xs text-[#f87171] overflow-x-auto">
          <code>{finding.evidence}</code>
        </pre>
      </div>

      {/* Gemma Reasoning Analysis Layer */}
      {finding.analysis && (
        <div className="space-y-4 pt-4 border-t border-[#212630]">
          {/* Explanation */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#00f0ff] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> GEMMA CONTEXT EXPLANATION:
            </span>
            <p className="text-xs text-[#8b949e] bg-[#0d1117] p-3 rounded border border-[#212630]">
              {finding.analysis.explanation}
            </p>
          </div>

          {/* Attack Path */}
          <AttackPathViewer attackPath={finding.analysis.attackPath} />

          {/* Safer Code Remediation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#00e6a8] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> SUGGESTED SECURE
                REFACTOR:
              </span>
              <button
                onClick={() => handleCopy(finding.analysis!.saferCodeExample)}
                className="flex items-center gap-1 text-[10px] font-mono text-[#8b949e] hover:text-[#00e6a8] transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-[#00e6a8]" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? "COPIED" : "COPY CODE"}
              </button>
            </div>

            <pre className="p-3 bg-[#0d1117] border border-[#00e6a8]/30 rounded font-mono text-xs text-[#00e6a8] overflow-x-auto">
              <code>{finding.analysis.saferCodeExample}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
