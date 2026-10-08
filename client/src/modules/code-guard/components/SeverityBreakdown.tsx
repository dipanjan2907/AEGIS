import React from "react";
import type { SeveritySummary } from "../types/code-guard.types";

interface SeverityBreakdownProps {
  summary: SeveritySummary;
}

export const SeverityBreakdown: React.FC<SeverityBreakdownProps> = ({
  summary,
}) => {
  return (
    <div className="p-5 bg-[#161b22] border border-[#212630] rounded-lg flex flex-col justify-between">
      <span className="text-xs font-mono text-[#8b949e]">
        SEVERITY BREAKDOWN
      </span>
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f87171]/10 border border-[#f87171]/30 rounded text-xs font-mono text-[#f87171]">
          <span className="font-bold">{summary.critical}</span> Critical
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded text-xs font-mono text-[#ff6b35]">
          <span className="font-bold">{summary.high}</span> High
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ffd166]/10 border border-[#ffd166]/30 rounded text-xs font-mono text-[#ffd166]">
          <span className="font-bold">{summary.medium}</span> Medium
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded text-xs font-mono text-[#3b82f6]">
          <span className="font-bold">{summary.low}</span> Low
        </div>
      </div>
    </div>
  );
};
