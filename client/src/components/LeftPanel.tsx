import React from "react";
import {
  Cpu,
  ShieldCheck,
  Code,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export const LeftPanel: React.FC = () => {
  return (
    <aside className="w-full lg:w-[360px] xl:w-[400px] h-full flex flex-col bg-[#0B1017] border-r border-[#252D38] select-none overflow-y-auto">
      {/* Top Section */}
      <div className="flex-1 flex flex-col gap-7 p-6">
        {/* 1. Brand Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#171D27] border border-[#303A48]">
              <Activity className="w-4 h-4 text-[#F05A28]" />
            </div>

            <div>
              <h1 className="text-xl font-mono font-bold tracking-tight text-[#E8DDB5] leading-none uppercase">
                AEGIS
              </h1>

              <div className="text-[10px] font-mono tracking-widest text-[#F05A28] mt-1 uppercase font-semibold">
                AI-Powered Security Workspace
              </div>
            </div>
          </div>

          <p className="text-sm text-[#788AA3] leading-relaxed mt-1">
            AI-powered static analysis threat detection engine for code,
            configs, and privacy vulnerabilities.
          </p>
        </div>

        {/* 2. Core Engine */}
        <div className="flex flex-col bg-[#141B24] border border-[#293442] rounded-md p-4">
          <div className="flex items-center justify-between mb-4 border-b border-[#293442] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#92B6B1]" />

              <span className="text-xs font-mono font-semibold text-[#E8DDB5] tracking-wider uppercase">
                Core Engine
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#666A86]">MODEL</span>
              <span className="text-[#92B6B1]">Gemma-4-26b-a4b-it</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#666A86]">MODE</span>
              <span className="text-[#92B6B1]">Static + LLM Hybrid</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#666A86]">RULESET</span>
              <span className="text-[#92B6B1]">v2026.4.1</span>
            </div>
          </div>
        </div>

        {/* 3. Analysis Pipeline */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-semibold text-[#666A86] tracking-wider uppercase">
              Analysis Pipeline
            </h3>

            <span className="text-[9px] font-mono text-[#515C6C]">
              04 STAGES
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* AST */}
            <div
              className="px-2.5 py-1 text-[10px] font-mono font-medium
    border border-[#788AA3]/30
    bg-[#788AA3]/10
    text-[#788AA3]
    rounded-sm"
            >
              AST
            </div>

            <span className="text-[#515C6C] text-[10px]">→</span>

            {/* RULES */}
            <div
              className="px-2.5 py-1 text-[10px] font-mono font-medium
    border border-[#92B6B1]/30
    bg-[#92B6B1]/10
    text-[#92B6B1]
    rounded-sm"
            >
              RULES
            </div>

            <span className="text-[#515C6C] text-[10px]">→</span>

            {/* AI */}
            <div
              className="px-2.5 py-1 text-[10px] font-mono font-semibold
    border border-[#F05A28]/40
    bg-[#F05A28]/12
    text-[#F05A28]
    rounded-sm
    shadow-[0_0_10px_rgba(240,90,40,0.08)]"
            >
              AI
            </div>

            <span className="text-[#515C6C] text-[10px]">→</span>

            {/* REPORT */}
            <div
              className="px-2.5 py-1 text-[10px] font-mono font-medium
    border border-[#B2C9AB]/30
    bg-[#B2C9AB]/10
    text-[#B2C9AB]
    rounded-sm"
            >
              REPORT
            </div>
          </div>
        </div>

        {/* 4. Coverage / Capabilities */}
        <div className="grid grid-cols-2 gap-3">
          {/* Detection */}
          <div className="flex flex-col bg-[#141B24] border border-[#293442] rounded-md p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B2C9AB]" />

              <span className="text-[10px] font-mono text-[#666A86] uppercase tracking-wider">
                Detection
              </span>
            </div>

            <span className="text-base font-mono text-[#E8DDB5] mb-1">
              20+ Rules
            </span>

            <span className="text-[10px] text-[#788AA3]">
              Security patterns
            </span>
          </div>

          {/* Languages */}
          <div className="flex flex-col bg-[#141B24] border border-[#293442] rounded-md p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Code className="w-3.5 h-3.5 text-[#92B6B1]" />

              <span className="text-[10px] font-mono text-[#666A86] uppercase tracking-wider">
                Languages
              </span>
            </div>

            <span className="text-base font-mono text-[#E8DDB5] mb-1">
              JS / TS
            </span>

            <span className="text-[10px] text-[#788AA3]">Static analysis</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-5 p-6 border-t border-[#252D38] bg-[#080D13]">
        {/* 5. Bottom Navigation */}
        <div className="flex flex-col gap-1">

          <a
            href="https://github.com/dipanjan2907/AEGIS/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="
            flex items-center justify-between
            p-2.5 rounded-md
            hover:bg-[#171F29]
            transition-colors
            group w-full text-left
          "
          >
            <div className="flex items-center gap-3">
              <FaGithub className="w-4 h-4 text-[#666A86] group-hover:text-[#92B6B1] transition-colors" />

              <span className="text-sm font-medium text-[#788AA3] group-hover:text-[#E8DDB5] transition-colors">
                Documentation
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-[#515C6C] group-hover:text-[#92B6B1] transition-colors" />
          </a>
        </div>

        {/* 6. Repository Card */}
        <a
          href="https://github.com/dipanjan2907/AEGIS"
          target="_blank"
          rel="noopener noreferrer"
          className="
          flex flex-col gap-1.5
          p-3
          bg-[#141B24]
          border border-[#293442]
          rounded-md
          hover:bg-[#1A232E]
          hover:border-[#3A4858]
          transition-all
          group
        "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaGithub className="w-3.5 h-3.5 text-[#E8DDB5]" />

              <span className="text-xs font-mono font-semibold text-[#E8DDB5]">
                AEGIS
              </span>
            </div>

            <ExternalLink className="w-3.5 h-3.5 text-[#515C6C] group-hover:text-[#92B6B1] transition-colors" />
          </div>

          <p className="text-[11px] text-[#788AA3]">
            View source, rules & architecture
          </p>
        </a>

        {/* 7. Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[#B2C9AB]" />

            <span className="text-[10px] font-mono text-[#515C6C]">
              Aegis Core v1.0
            </span>
          </div>

          <span className="text-[10px] font-mono text-[#515C6C]">
            BUILD 2026.09
          </span>
        </div>
      </div>
    </aside>
  );
};