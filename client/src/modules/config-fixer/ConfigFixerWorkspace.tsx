import React, { useState } from "react";
import { Play, Sliders, AlertTriangle, Loader2, Sparkles, Wrench } from "lucide-react";

import type { ConfigFixReport, ConfigType } from "./types/config-fixer.types";
import { scanConfigPayload } from "./services/config-fixer-api";
import { CONFIG_PRESETS, type ConfigPreset } from "./data/configPresets";
import { ConfigDiffViewer } from "./components/ConfigDiffViewer";
import { ConfigFindingCard } from "./components/ConfigFindingCard";
import { useTelemetry } from "../../context/TelemetryContext";

export const ConfigFixerWorkspace: React.FC = () => {
  const { recordScanEvent } = useTelemetry();

  const [configType, setConfigType] = useState<ConfigType>("dockerfile");
  const [configText, setConfigText] = useState<string>(CONFIG_PRESETS[0]?.configText || "");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<ConfigFixReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (preset: ConfigPreset) => {
    setConfigType(preset.type);
    setConfigText(preset.configText);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    setReport(null);

    try {
      const result = await scanConfigPayload({
        configText,
        configType,
      });
      setReport(result);

      // Record live scan event in LeftPanel telemetry
      recordScanEvent(
        {
          moduleName: "Config Fixer",
          eventType: `${result.totalIssues} Misconfigurations Audited`,
          severity: result.riskScore > 50 ? "CRITICAL" : "HIGH",
          detail: `Hardened ${result.configType.toUpperCase()} file via Gemma AI`,
        },
        result.riskScore / 2
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full gap-4 text-[#e6edf3]">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-4 bg-[#131720] border border-[#212630] rounded-lg">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-[#6B9FE8]" />
          <div>
            <h3 className="font-mono font-bold text-sm text-[#e6edf3]">
              FIX MY SECURITY CONFIG
            </h3>
            <p className="text-xs text-[#8b949e]">
              Linter + Gemma AI security audit for Nginx, Dockerfile, and .env files
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1 bg-[#161b22] border border-[#212630] rounded p-1">
          {(["dockerfile", "nginx", "env"] as ConfigType[]).map((type) => (
            <button
              key={type}
              onClick={() => setConfigType(type)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase ${
                configType === type
                  ? "bg-[#6B9FE8]/20 text-[#6B9FE8] border border-[#6B9FE8]/40 font-bold"
                  : "text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left Column: Editor & Presets */}
        <div className="bg-[#131720] border border-[#212630] rounded-lg p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8b949e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6B9FE8]" /> INSECURE CONFIG PRESETS:
            </span>
            <div className="flex flex-wrap gap-2">
              {CONFIG_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 bg-[#161b22] border border-[#212630] hover:border-[#6B9FE8]/50 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Config Input Area */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <label className="text-xs font-mono text-[#8b949e]">
              RAW CONFIGURATION INPUT ({configType.toUpperCase()}):
            </label>
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              placeholder={`Paste your ${configType} file contents here...`}
              className="w-full flex-1 bg-[#0d1117] border border-[#212630] rounded p-3 font-mono text-xs text-[#e6edf3] focus:border-[#6B9FE8] outline-none resize-none min-h-[260px]"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleScan}
            disabled={isScanning || !configText.trim()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#6B9FE8] text-[#0d1117] hover:bg-[#8bb4f0] font-mono font-bold text-xs rounded transition-all duration-200 shadow-lg shadow-[#6B9FE8]/10 disabled:opacity-50 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> GENERATING SECURED DIFF VIA GEMMA...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> AUDIT & HARDEN CONFIGURATION
              </>
            )}
          </button>
        </div>

        {/* Right Column: Diff View & Findings */}
        <div className="bg-[#131720] border border-[#212630] rounded-lg p-5 flex flex-col gap-5 overflow-y-auto">
          {error && (
            <div className="p-4 bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg flex items-center gap-3 text-[#f87171] text-xs font-mono">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isScanning ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#212630] rounded-lg text-[#8b949e] animate-pulse">
              <Loader2 className="w-10 h-10 text-[#6B9FE8] animate-spin mb-3" />
              <p className="font-mono text-xs text-[#e6edf3] font-bold">
                AUDITING CONFIGURATION & GENERATING REPAIR DIFF...
              </p>
              <p className="font-mono text-[11px] text-[#8b949e] mt-1">
                Evaluating parameters against security baselines & applying fixes via Gemma...
              </p>
            </div>
          ) : report ? (
            <>
              {/* Header Score Banner */}
              <div className="flex items-center justify-between p-4 bg-[#161b22] border border-[#212630] rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#8b949e]">RISK SCORE EVALUATION</span>
                  <div className="text-xl font-mono font-extrabold text-[#f87171]">
                    {report.riskScore} / 100
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-mono text-[#8b949e]">TOTAL MISCONFIGURATIONS</span>
                  <div className="text-sm font-mono font-bold text-[#6B9FE8]">
                    {report.totalIssues} Issues Found
                  </div>
                </div>
              </div>

              {/* Side by Side Diff Viewer */}
              <ConfigDiffViewer
                originalConfig={report.originalConfig}
                securedConfig={report.securedConfig}
                diffSummary={report.diffSummary}
              />

              {/* Finding Cards */}
              <div className="space-y-3 pt-2 border-t border-[#212630]">
                <h4 className="text-xs font-mono font-bold text-[#e6edf3] flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#6B9FE8]" /> DETECTED ISSUES & AUDIT TRAIL
                </h4>
                {report.findings.map((finding) => (
                  <ConfigFindingCard key={finding.id} finding={finding} />
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#212630] rounded-lg text-[#8b949e]">
              <Sliders className="w-12 h-12 text-[#6B9FE8]/40 mb-3" />
              <p className="font-mono text-xs">
                Select a config preset or paste custom file contents, then click <br />
                <strong className="text-[#e6edf3]">"AUDIT & HARDEN CONFIGURATION"</strong> to inspect.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};