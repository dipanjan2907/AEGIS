import React, { useState } from "react";
import { Check, Copy, ArrowRight, ShieldCheck, FileCode } from "lucide-react";

interface ConfigDiffViewerProps {
  originalConfig: string;
  securedConfig: string;
  diffSummary: string[];
}

export const ConfigDiffViewer: React.FC<ConfigDiffViewerProps> = ({
  originalConfig,
  securedConfig,
  diffSummary,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(securedConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Diff Summary Badges */}
      <div className="p-4 bg-[#161b22] border border-[#212630] rounded-lg space-y-2">
        <span className="text-xs font-mono text-[#6B9FE8] font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> GEMMA REPAIR SUMMARY ({diffSummary.length} CHANGES):
        </span>
        <div className="flex flex-col gap-1.5">
          {diffSummary.map((item, idx) => (
            <div
              key={idx}
              className="text-xs font-mono text-[#e6edf3] flex items-center gap-2 bg-[#0d1117] p-2 rounded border border-[#212630]"
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#6B9FE8] flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Code Viewers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span className="flex items-center gap-1.5 text-[#f87171]">
              <FileCode className="w-3.5 h-3.5" /> ORIGINAL CONFIG (UNSECURED)
            </span>
          </div>
          <pre className="p-3 bg-[#0d1117] border border-[#f87171]/30 rounded font-mono text-xs text-[#f87171]/90 overflow-x-auto h-[320px] resize-none">
            <code>{originalConfig}</code>
          </pre>
        </div>

        {/* Secured */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#62D7AE]">
              <ShieldCheck className="w-3.5 h-3.5" /> HARDENED CONFIG (SECURED)
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] font-mono text-[#8b949e] hover:text-[#62D7AE] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#62D7AE]" /> : <Copy className="w-3 h-3" />}
              {copied ? "COPIED" : "COPY SECURED CONFIG"}
            </button>
          </div>
          <pre className="p-3 bg-[#0d1117] border border-[#62D7AE]/40 rounded font-mono text-xs text-[#62D7AE] overflow-x-auto h-[320px] resize-none">
            <code>{securedConfig}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};