import React from "react";
import { Bot, AlertOctagon, CheckCircle2 } from "lucide-react";
import type { AgentSimulationResult } from "../types/prompt-firewall.types";

interface AgentSimulatorProps {
  simulation: AgentSimulationResult;
}

export const AgentSimulator: React.FC<AgentSimulatorProps> = ({
  simulation,
}) => {
  return (
    <div className="bg-[#161b22] border border-[#212630] rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#212630] pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#b58cff]" />
          <h4 className="font-mono font-bold text-sm text-[#e6edf3]">
            TARGET AI AGENT SIMULATION
          </h4>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
            simulation.wasHijacked
              ? "bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30"
              : "bg-[#00e6a8]/10 text-[#00e6a8] border-[#00e6a8]/30"
          }`}
        >
          {simulation.wasHijacked ? "AGENT HIJACKED" : "SAFE EXECUTION"}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-mono text-[#8b949e]">
          TARGET AGENT ROLE:
        </span>
        <div className="text-xs font-mono text-[#e6edf3] bg-[#0d1117] p-2 rounded border border-[#212630]">
          {simulation.agentSystemPrompt}
        </div>
      </div>

      {/* Simulated Output Box */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-[#8b949e]">
          SIMULATED AGENT RESPONSE:
        </span>
        <div
          className={`p-4 rounded-lg border font-mono text-xs whitespace-pre-wrap transition-colors ${
            simulation.wasHijacked
              ? "bg-[#f87171]/10 border-[#f87171]/40 text-[#f87171]"
              : "bg-[#0d1117] border-[#00e6a8]/30 text-[#00e6a8]"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-bold text-xs border-b border-current/20 pb-2">
            {simulation.wasHijacked ? (
              <>
                <AlertOctagon className="w-4 h-4" /> BREACH CONFIRMED: AGENT
                INSTRUCTION HIJACKED
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> PROTECTED: AGENT EXECUTED
                INTENDED TASK SAFELY
              </>
            )}
          </div>
          {simulation.agentResponse}
        </div>
      </div>
    </div>
  );
};
