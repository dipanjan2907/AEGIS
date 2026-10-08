import React from "react";
import { ShieldAlert } from "lucide-react";

interface AttackPathViewerProps {
  attackPath: string[];
}

export const AttackPathViewer: React.FC<AttackPathViewerProps> = ({
  attackPath,
}) => {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-mono text-[#ff6b35] flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5" /> RECONSTRUCTED ATTACK PATH:
      </span>
      <div className="flex flex-col gap-2 p-3 bg-[#0d1117] rounded border border-[#212630]">
        {attackPath.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-mono">
            <span className="w-5 h-5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] flex items-center justify-center text-[10px] font-bold border border-[#ff6b35]/20 flex-shrink-0">
              {idx + 1}
            </span>
            <span className="text-[#e6edf3]">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
