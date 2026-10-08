import React, { useState } from "react";
import { Play, ShieldAlert, AlertTriangle, Terminal, Zap } from "lucide-react";

import type { SecurityReport } from "./types/code-guard.types";
import { scanCodeRepository } from "./services/code-guard-api";
import { CodeEditor } from "./components/CodeEditor";
import { SecurityScoreCard } from "./components/SecurityScoreCard";
import { SeverityBreakdown } from "./components/SeverityBreakdown";
import { FindingCard } from "./components/FindingCard";
import { ScanProgressBar } from "./components/ScanProgressBar";

const DEFAULT_SAMPLE_CODE = `// Sample JS Code with Security Vulnerabilities
const express = require('express');
const { exec } = require('child_process');
const app = express();

const API_KEY = "rk_live_99887766554433221100";

app.get('/user', (req, res) => {
  const username = req.query.username;
  
  // Vulnerability 1: SQL Injection
  const query = "SELECT * FROM users WHERE name = '" + username + "'";
  
  // Vulnerability 2: Command Injection
  exec("ping " + req.query.host);
  
  // Vulnerability 3: Dangerous eval
  eval(req.query.code);
  
  res.send("Executed");
});
`;

export const CodeGuardWorkspace: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_SAMPLE_CODE);
  const [language, setLanguage] = useState<"javascript" | "typescript">(
    "javascript",
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "report">("editor");

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const result = await scanCodeRepository(code, language);
      setReport(result);
      setActiveTab("report");
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#161b22] border border-[#212630] rounded p-1">
            <button
              onClick={() => setLanguage("javascript")}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                language === "javascript"
                  ? "bg-[#00e6a8]/20 text-[#00e6a8] border border-[#00e6a8]/40 font-bold"
                  : "text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => setLanguage("typescript")}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                language === "typescript"
                  ? "bg-[#00e6a8]/20 text-[#00e6a8] border border-[#00e6a8]/40 font-bold"
                  : "text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              TypeScript
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 ${
                activeTab === "editor"
                  ? "bg-[#212630] text-[#e6edf3] font-semibold"
                  : "text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Code Editor
            </button>
            <button
              onClick={() => setActiveTab("report")}
              disabled={!report}
              className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                activeTab === "report"
                  ? "bg-[#212630] text-[#00f0ff] font-semibold"
                  : "text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Security Report{" "}
              {report && (
                <span className="px-1.5 py-0.2 bg-[#00f0ff]/20 text-[#00f0ff] rounded-full text-[10px]">
                  {report.totalVulnerabilities}
                </span>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning || !code.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-[#00e6a8] text-[#0d1117] hover:bg-[#33f3ff] font-mono font-bold text-xs rounded transition-all duration-200 shadow-lg shadow-[#00e6a8]/10 disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" /> RUN CODEGUARD SCAN
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg flex items-center gap-3 text-[#f87171] text-xs font-mono">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Workspace Panel */}
      <div className="flex-1 bg-[#131720] border border-[#212630] rounded-lg overflow-hidden relative">
        {/* Animated Process Bar Overlay during Scanning */}
        <ScanProgressBar isScanning={isScanning} />

        {activeTab === "editor" ? (
          <CodeEditor
            code={code}
            language={language}
            onChange={(val) => setCode(val)}
          />
        ) : report ? (
          <div className="h-full overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <SecurityScoreCard
                  score={report.securityScore}
                  totalVulnerabilities={report.totalVulnerabilities}
                />
              </div>
              <SeverityBreakdown summary={report.summary} />
            </div>

            <div className="space-y-6">
              <h3 className="text-base font-bold font-mono text-[#e6edf3] flex items-center gap-2 border-b border-[#212630] pb-3">
                <Zap className="w-4 h-4 text-[#00f0ff]" /> DETECTED FINDINGS &
                GEMMA REASONING
              </h3>

              {report.findings.map((finding, idx) => (
                <FindingCard key={finding.id} finding={finding} index={idx} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};