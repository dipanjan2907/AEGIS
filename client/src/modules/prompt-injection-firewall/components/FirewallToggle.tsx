import React from "react";
import { Shield, ShieldOff } from "lucide-react";

interface FirewallToggleProps {
  enabled: boolean;
  onToggle: (state: boolean) => void;
}

export const FirewallToggle: React.FC<FirewallToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#161b22] border border-[#212630] rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`p-2.5 rounded-lg border transition-all ${
            enabled
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              : "bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30"
          }`}
        >
          {enabled ? (
            <Shield className="w-5 h-5" />
          ) : (
            <ShieldOff className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-mono font-bold text-sm text-[#e6edf3]">
              AEGIS FIREWALL PROTECTION
            </h4>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                enabled
                  ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30"
                  : "bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30"
              }`}
            >
              {enabled ? "ACTIVE (PROTECTED)" : "DISABLED (BYPASS)"}
            </span>
          </div>
          <p className="text-xs text-[#8b949e] font-sans mt-0.5">
            {enabled
              ? "Prompts are sanitized by Gemma before reaching the AI Agent."
              : "Raw inputs pass directly to the AI Agent (Demo Hijack Mode)."}
          </p>
        </div>
      </div>

      <button
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? "bg-[#00f0ff]" : "bg-[#212630]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#0d1117] shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
