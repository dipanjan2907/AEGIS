import React from "react";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import type { DependencyFinding } from "../types/dependency-autopsy.types";

const severityColor: Record<DependencyFinding["severity"], string> = {
  CRITICAL: "text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10",
  HIGH: "text-[#fb923c] border-[#fb923c]/30 bg-[#fb923c]/10",
  MEDIUM: "text-[#E8C66A] border-[#E8C66A]/30 bg-[#E8C66A]/10",
  LOW: "text-[#62D7AE] border-[#62D7AE]/30 bg-[#62D7AE]/10",
};

interface RemovalImpactCardProps {
  finding: DependencyFinding;
}

export const RemovalImpactCard: React.FC<RemovalImpactCardProps> = ({
  finding,
}) => (
  <article className="space-y-3 rounded-lg border border-[#212630] bg-[#161b22] p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#E8C66A]" />
        <div>
          <h4 className="font-mono text-sm font-bold text-[#e6edf3]">
            {finding.packageName}
          </h4>
          <p className="mt-1 font-mono text-[10px] text-[#8b949e]">
            {finding.cveId}
          </p>
        </div>
      </div>
      <span
        className={`rounded border px-2 py-1 font-mono text-[9px] font-bold ${severityColor[finding.severity]}`}
      >
        {finding.severity}
      </span>
    </div>
    <p className="text-xs leading-relaxed text-[#c4cbd4]">{finding.summary}</p>
    <div className="flex flex-wrap items-center gap-2 rounded border border-[#212630] bg-[#0d1117] px-3 py-2 font-mono text-[10px]">
      <span className="text-[#f87171]">{finding.currentVersion}</span>
      <ArrowUpRight className="h-3 w-3 text-[#64748b]" />
      <span className="text-[#62D7AE]">
        {finding.fixedVersion === "REMOVE"
          ? "Remove the compromised package"
          : `Update to ${finding.fixedVersion}+`}
      </span>
    </div>
    <div className="space-y-1">
      <div className="font-mono text-[9px] font-bold tracking-wider text-[#E8C66A]">
        UPDATE / REMOVAL IMPACT
      </div>
      <p className="text-[11px] leading-relaxed text-[#8b949e]">
        {finding.impactAssessment}
      </p>
    </div>
  </article>
);
