import React from "react";
import { Scissors, Check, ShieldAlert } from "lucide-react";

interface SanitizedDiffViewerProps {
  removedSegments: string[];
  sanitizedPrompt: string;
  firewallEnabled: boolean;
}

export const SanitizedDiffViewer: React.FC<SanitizedDiffViewerProps> = ({
  removedSegments,
  sanitizedPrompt,
  firewallEnabled,
}) => {
  if (!firewallEnabled) {
    return (
      <div className="p-4 bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#f87171] font-bold">
          <ShieldAlert className="w-4 h-4" /> FIREWALL BYPASS ACTIVE
        </div>
        <p className="text-xs text-[#8b949e] font-sans">
          Sanitization pass was skipped. The raw payload with embedded injection
          commands was sent unmodified directly to the LLM Agent.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Removed Segments */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#f87171]">
          <Scissors className="w-4 h-4" /> REMOVED INJECTION SEGMENTS (
          {removedSegments.length}):
        </div>
        {removedSegments.length > 0 ? (
          <div className="flex flex-col gap-2">
            {removedSegments.map((segment, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-[#0d1117] border border-[#f87171]/30 rounded font-mono text-xs text-[#f87171] line-through"
              >
                {segment}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8b949e] font-mono italic">
            No malicious segments detected to remove.
          </p>
        )}
      </div>

      {/* Clean Output */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#00e6a8]">
          <Check className="w-4 h-4" /> EFFECTIVE SANITIZED PROMPT PASSED TO
          AGENT:
        </div>
        <pre className="p-3 bg-[#0d1117] border border-[#00e6a8]/30 rounded font-mono text-xs text-[#00e6a8] whitespace-pre-wrap">
          {sanitizedPrompt}
        </pre>
      </div>
    </div>
  );
};
