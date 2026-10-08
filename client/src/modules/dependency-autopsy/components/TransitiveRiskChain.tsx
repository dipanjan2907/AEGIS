import React from "react";
import { ArrowDown, Boxes, CircleDot } from "lucide-react";
import type { DependencyReport } from "../types/dependency-autopsy.types";

interface TransitiveRiskChainProps {
  report: DependencyReport;
}

export const TransitiveRiskChain: React.FC<TransitiveRiskChainProps> = ({
  report,
}) => {
  const roots = report.transitiveGraph.root ?? [];
  const displayed = new Set<string>();

  const renderBranch = (
    packageName: string,
    depth: number,
    ancestors: Set<string>,
  ): React.ReactNode => {
    if (depth > 4 || ancestors.has(packageName) || displayed.has(packageName)) {
      return null;
    }
    displayed.add(packageName);
    const children = report.transitiveGraph[packageName] ?? [];
    const branch = new Set(ancestors).add(packageName);

    return (
      <div key={`${packageName}-${depth}`} className="space-y-1.5">
        <div
          className="flex items-center gap-2 rounded border border-[#212630] bg-[#0d1117] px-3 py-2 font-mono text-xs"
          style={{ marginLeft: `${depth * 16}px` }}
        >
          {report.findings.some((finding) => finding.packageName === packageName) ? (
            <CircleDot className="h-3.5 w-3.5 shrink-0 text-[#f87171]" />
          ) : (
            <Boxes className="h-3.5 w-3.5 shrink-0 text-[#E8C66A]" />
          )}
          <span className="truncate text-[#e6edf3]">{packageName}</span>
          {report.findings.some((finding) => finding.packageName === packageName) && (
            <span className="ml-auto text-[9px] font-bold text-[#f87171]">
              VULNERABLE
            </span>
          )}
        </div>
        {children
          .filter((child) => !branch.has(child))
          .map((child) => (
            <React.Fragment key={`${packageName}-${child}`}>
              <ArrowDown
                className="h-3 w-3 text-[#64748b]"
                style={{ marginLeft: `${depth * 16 + 16}px` }}
              />
              {renderBranch(child, depth + 1, branch)}
            </React.Fragment>
          ))}
      </div>
    );
  };

  return (
    <section className="space-y-3 rounded-lg border border-[#212630] bg-[#131720] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold text-[#e6edf3]">
          TRANSITIVE RISK CHAIN
        </h3>
        <span className="font-mono text-[10px] text-[#8b949e]">
          {report.totalDependencies} NODES
        </span>
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {roots.length > 0 ? (
          roots.map((root) => renderBranch(root, 0, new Set()))
        ) : (
          <p className="font-mono text-[11px] text-[#8b949e]">
            No dependency graph edges were found.
          </p>
        )}
      </div>
      <div className="space-y-2 border-t border-[#212630] pt-3">
        {report.findings.map((finding) => (
          <div key={finding.id} className="font-mono text-[10px] text-[#8b949e]">
            <span className="text-[#f87171]">{finding.severity}</span>
            <span className="mx-2 text-[#64748b]">/</span>
            {finding.transitiveChain.join("  →  ")}
          </div>
        ))}
      </div>
    </section>
  );
};
