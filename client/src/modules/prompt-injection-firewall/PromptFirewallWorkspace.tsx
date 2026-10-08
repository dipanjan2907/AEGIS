import React, { useState } from "react";
import { useTelemetry } from "../../context/TelemetryContext";
import {
  Play,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { PromptFirewallReport } from "./types/prompt-firewall.types";
import { scanPromptPayload } from "./services/prompt-firewall-api";
import { ATTACK_PRESETS, type AttackPreset } from "./data/attackPresets";
import { FirewallToggle } from "./components/FirewallToggle";
import { RiskGauge } from "./components/RiskGauge";
import { SanitizedDiffViewer } from "./components/SanitizedDiffViewer";
import { AgentSimulator } from "./components/AgentSimulator";

export const PromptFirewallWorkspace: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(ATTACK_PRESETS[0]?.prompt || "");
  const [targetAgentRole, setTargetAgentRole] = useState<string>(
    ATTACK_PRESETS[0]?.agentRole ||
      "Helpful AI Assistant summarizing customer emails",
  );
  const [firewallEnabled, setFirewallEnabled] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<PromptFirewallReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { recordScanEvent } = useTelemetry();
  const handleSelectPreset = (preset: AttackPreset) => {
    setPrompt(preset.prompt);
    setTargetAgentRole(preset.agentRole);
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const result = await scanPromptPayload({
        prompt,
        firewallEnabled,
        targetAgentRole,
      });
      setReport(result);

      // Dynamically emit telemetry event
      if (result.isInjected) {
        recordScanEvent(
          {
            moduleName: "Prompt Firewall",
            eventType: "Prompt Injection Intercepted",
            severity: result.overallRisk === "CRITICAL" ? "CRITICAL" : "HIGH",
            detail: `Sanitized ${result.removedSegments.length} malicious segments`,
          },
          15,
        );
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full gap-4 text-[#e6edf3]">
      {/* Firewall Toggle Header */}
      <FirewallToggle enabled={firewallEnabled} onToggle={setFirewallEnabled} />

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left Column: Input & Presets */}
        <div className="bg-[#131720] border border-[#212630] rounded-lg p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8b949e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b58cff]" /> DEMO ATTACK
              PRESETS:
            </span>
            <div className="flex flex-wrap gap-2">
              {ATTACK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 bg-[#161b22] border border-[#212630] hover:border-[#b58cff]/50 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* System Role Config */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8b949e]">
              TARGET AGENT SYSTEM ROLE:
            </label>
            <input
              type="text"
              value={targetAgentRole}
              onChange={(e) => setTargetAgentRole(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#212630] rounded p-2.5 font-mono text-xs text-[#e6edf3] focus:border-[#b58cff] outline-none"
            />
          </div>

          {/* Text Area */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <label className="text-xs font-mono text-[#8b949e]">
              PROMPT / EXTERNAL UNTRUSTED INPUT:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste email, web scrapings, or document text here..."
              className="w-full flex-1 bg-[#0d1117] border border-[#212630] rounded p-3 font-mono text-xs text-[#e6edf3] focus:border-[#b58cff] outline-none resize-none min-h-[200px]"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleScan}
            disabled={isScanning || !prompt.trim()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#b58cff] text-[#0d1117] hover:bg-[#cbb0ff] font-mono font-bold text-xs rounded transition-all duration-200 shadow-lg shadow-[#b58cff]/10 disabled:opacity-50 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> ANALYZING INJECTION
                RISK...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> RUN PROMPT FIREWALL
                INSPECTION
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results & Agent Simulation */}
        <div className="bg-[#131720] border border-[#212630] rounded-lg p-5 flex flex-col gap-5 overflow-y-auto">
          {error && (
            <div className="p-4 bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg flex items-center gap-3 text-[#f87171] text-xs font-mono">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isScanning ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#212630] rounded-lg text-[#8b949e] animate-pulse">
              <Loader2 className="w-10 h-10 text-[#b58cff] animate-spin mb-3" />
              <p className="font-mono text-xs text-[#e6edf3] font-bold">
                RUNNING FIREWALL INSPECTION & AGENT SIMULATION...
              </p>
              <p className="font-mono text-[11px] text-[#8b949e] mt-1">
                Analyzing prompt context with Gemma & applying security
                guardrails...
              </p>
            </div>
          ) : report ? (
            <>
              {/* Risk Gauge Header */}
              <RiskGauge
                risk={report.overallRisk}
                isInjected={report.isInjected}
              />

              {/* Agent Simulator */}
              <AgentSimulator simulation={report.simulation} />

              {/* Sanitization Diff */}
              <SanitizedDiffViewer
                removedSegments={report.removedSegments}
                sanitizedPrompt={report.sanitizedPrompt}
                firewallEnabled={report.firewallEnabled}
              />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#212630] rounded-lg text-[#8b949e]">
              <ShieldAlert className="w-12 h-12 text-[#b58cff]/40 mb-3" />
              <p className="font-mono text-xs">
                Select an attack preset or paste custom text, then click <br />
                <strong className="text-[#e6edf3]">
                  "RUN PROMPT FIREWALL INSPECTION"
                </strong>{" "}
                to inspect.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};