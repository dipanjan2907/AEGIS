import React from "react";
import type { RiskLevel } from "../types/prompt-firewall.types";

interface RiskGaugeProps {
  risk: RiskLevel;
  isInjected: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ risk, isInjected }) => {
  const getRiskConfig = (level: RiskLevel) => {
    switch (level) {
      case "CRITICAL":
        return {
          color: "text-[#f87171]",
          bg: "bg-[#f87171]/10",
          border: "border-[#f87171]/30",
          label: "CRITICAL THREAT",
        };
      case "HIGH":
        return {
          color: "text-[#ff6b35]",
          bg: "bg-[#ff6b35]/10",
          border: "border-[#ff6b35]/30",
          label: "HIGH RISK",
        };
      case "MEDIUM":
        return {
          color: "text-[#ffd166]",
          bg: "bg-[#ffd166]/10",
          border: "border-[#ffd166]/30",
          label: "MEDIUM RISK",
        };
      case "LOW":
        return {
          color: "text-[#3b82f6]",
          bg: "bg-[#3b82f6]/10",
          border: "border-[#3b82f6]/30",
          label: "LOW RISK",
        };
      default:
        return {
          color: "text-[#00e6a8]",
          bg: "bg-[#00e6a8]/10",
          border: "border-[#00e6a8]/30",
          label: "CLEAN / SAFE",
        };
    }
  };

  const config = getRiskConfig(isInjected ? risk : "SAFE");

  return (
    <div
      className={`p-4 rounded-lg border ${config.bg} ${config.border} flex items-center justify-between`}
    >
      <div className="space-y-0.5">
        <span className="text-[10px] font-mono text-[#8b949e]">
          OVERALL THREAT EVALUATION
        </span>
        <div className={`text-lg font-mono font-extrabold ${config.color}`}>
          {config.label}
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded font-mono text-xs font-bold border ${config.color} ${config.border}`}
      >
        {isInjected ? "INJECTION DETECTED" : "PASSED CLEAR"}
      </div>
    </div>
  );
};
