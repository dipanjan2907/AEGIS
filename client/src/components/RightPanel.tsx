import React from "react";
import { ShieldCheck, ArrowRight, ScanLine } from "lucide-react";

import { ToolsConfig } from "../data/toolsData";

interface RightPanelProps {
  onSelectTool: (toolId: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ onSelectTool }) => {
  return (
    <main className="relative flex-1 h-full overflow-y-auto bg-[#0B1017] text-[#E8DDB5]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-[#92B6B1]/[0.025] blur-3xl" />

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            bg-[linear-gradient(rgba(146,182,177,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(146,182,177,0.5)_1px,transparent_1px)]
            bg-[size:32px_32px]
          "
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8 lg:px-10 lg:py-10">
        {/* ───────────────── HEADER ───────────────── */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#92B6B1]/20 bg-[#92B6B1]/[0.07]">
                  <ShieldCheck
                    className="h-4 w-4 text-[#92B6B1]"
                    strokeWidth={1.8}
                  />
                </div>

                <span className="text-[10px] font-mono font-medium tracking-[0.18em] text-[#788AA3]">
                  AEGIS / ANALYSIS
                </span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-[#E8DDB5]">
                Security Engines
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#788AA3]">
                Select an automated analysis module to inspect code,
                configurations, manifests, dependencies, or security events.
              </p>
            </div>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-[#293442] via-[#293442]/70 to-transparent" />
        </div>

        {/* ───────────────── GRID ───────────────── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ToolsConfig.list.map((tool, index) => {
            const IconComponent = tool.icon;

            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="
                  group relative cursor-pointer overflow-hidden
                  rounded-lg
                  border
                  p-5
                  transition-all duration-300
                  hover:-translate-y-1
                "
                style={{
                  backgroundColor: tool.cardBg,
                  borderColor: tool.cardBorder,
                  boxShadow: `0 8px 30px ${tool.glowColor}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tool.accentColor;
                  e.currentTarget.style.boxShadow = `
                    0 12px 40px ${tool.glowColor},
                    0 0 0 1px ${tool.accentColor}18
                  `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = tool.cardBorder;
                  e.currentTarget.style.boxShadow = `0 8px 30px ${tool.glowColor}`;
                }}
              >
                {/* Decorative scan line */}
                <div
                  className="
                    pointer-events-none absolute
                    left-0 top-0 h-px w-0
                    transition-all duration-500
                    group-hover:w-full
                  "
                  style={{
                    backgroundColor: tool.accentColor,
                    boxShadow: `0 0 12px ${tool.accentColor}`,
                  }}
                />

                {/* Corner decoration */}
                <div
                  className="pointer-events-none absolute right-0 top-0 h-16 w-16 opacity-20"
                  style={{
                    background: `
                      radial-gradient(
                        circle at top right,
                        ${tool.accentColor} 0,
                        transparent 65%
                      )
                    `,
                  }}
                />

                {/* ───────── Card Header ───────── */}
                <div className="relative flex items-start justify-between">
                  <div
                    className="
                      relative flex h-11 w-11
                      items-center justify-center
                      rounded-md
                      border
                      transition-all duration-300
                      group-hover:scale-105
                    "
                    style={{
                      backgroundColor: tool.badgeBg,
                      borderColor: tool.badgeBorder,
                      color: tool.accentColor,
                    }}
                  >
                    <IconComponent className="h-5 w-5" strokeWidth={1.7} />

                    {/* tiny corner indicator */}
                    <span
                      className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: tool.accentColor,
                        boxShadow: `0 0 8px ${tool.accentColor}`,
                      }}
                    />
                  </div>

                  <span
                    className="
                      rounded-sm
                      px-2 py-1
                      text-[9px]
                      font-mono
                      font-medium
                      tracking-[0.08em]
                    "
                    style={{
                      backgroundColor: tool.badgeBg,
                      color: tool.accentColor,
                      border: `1px solid ${tool.badgeBorder}`,
                    }}
                  >
                    {tool.category}
                  </span>
                </div>

                {/* ───────── Content ───────── */}
                <div className="relative mt-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full opacity-70"
                      style={{
                        backgroundColor: tool.accentColor,
                      }}
                    />

                    <span className="text-[9px] font-mono tracking-wider text-[#515C6C]">
                      MODULE 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-semibold tracking-tight text-[#E8DDB5] transition-colors">
                    {tool.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-xs leading-5 text-[#788AA3]">
                    {tool.description}
                  </p>
                </div>

                {/* ───────── Footer ───────── */}
                <div className="relative mt-5 flex items-center justify-between border-t border-[#293442]/80 pt-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {tool.track.map((track) => (
                      <span
                        key={track}
                        className="rounded-md px-2 py-0.5 text-[9px] font-mono"
                        style={{
                          color: tool.accentColor,
                          backgroundColor: `${tool.accentColor}0F`,
                          border: `1px solid ${tool.accentColor}24`,
                        }}
                      >
                        {track}
                      </span>
                    ))}
                  </div>

                  <div
                    className="
                      flex items-center gap-1.5
                      text-[10px]
                      font-mono
                      font-medium
                      opacity-60
                      transition-all duration-200
                      group-hover:translate-x-0.5
                      group-hover:opacity-100
                    "
                    style={{
                      color: tool.accentColor,
                    }}
                  >
                    <span>LAUNCH</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Bottom security detail */}
                <div className="pointer-events-none absolute bottom-2 right-3 opacity-[0.08]">
                  <ScanLine
                    className="h-10 w-10"
                    style={{ color: tool.accentColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ───────────────── FOOTER STATUS ───────────────── */}
        <div className="mt-7 flex items-center justify-between border-t border-[#293442]/70 pt-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#515C6C]">
            <span className="text-[#788AA3]">{ToolsConfig.list.length}</span>
            ANALYSIS MODULES AVAILABLE
          </div>

          <div className="hidden sm:block text-[10px] font-mono text-[#515C6C]">
            AEGIS CORE / STATIC + AI
          </div>
        </div>
      </div>
    </main>
  );
};