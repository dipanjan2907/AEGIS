import React from "react";
import { AlertTriangle, Globe2 } from "lucide-react";
import type {
  LogIncident,
  SeverityLevel,
} from "../types/log-investigator.types";

const severityColor: Record<SeverityLevel, string> = {
  CRITICAL: "text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10",
  HIGH: "text-[#fb923c] border-[#fb923c]/30 bg-[#fb923c]/10",
  MEDIUM: "text-[#E8C66A] border-[#E8C66A]/30 bg-[#E8C66A]/10",
  LOW: "text-[#62D7AE] border-[#62D7AE]/30 bg-[#62D7AE]/10",
  INFO: "text-[#A99AEF] border-[#A99AEF]/30 bg-[#A99AEF]/10",
};

export const IncidentInspectorCard: React.FC<{ incident: LogIncident }> = ({
  incident,
}) => (
  <article className="space-y-3 rounded-lg border border-[#212630] bg-[#161b22] p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#A99AEF]" />
        <div>
          <h4 className="font-mono text-sm font-bold text-[#e6edf3]">
            {incident.attackType}
          </h4>
          <time className="mt-1 block font-mono text-[9px] text-[#8b949e]">
            {incident.timestamp}
          </time>
        </div>
      </div>
      <span
        className={`rounded border px-2 py-1 font-mono text-[9px] font-bold ${severityColor[incident.severity]}`}
      >
        {incident.severity}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
      <div className="flex min-w-0 items-center gap-1.5 rounded border border-[#212630] bg-[#0d1117] px-2 py-1.5 text-[#c4cbd4]">
        <Globe2 className="h-3 w-3 shrink-0 text-[#A99AEF]" />
        <span className="truncate">{incident.ipAddress}</span>
      </div>
      <div className="rounded border border-[#212630] bg-[#0d1117] px-2 py-1.5 text-[#c4cbd4]">
        HTTP {incident.statusCode || "—"} · {incident.method}
      </div>
      <div className="col-span-2 truncate rounded border border-[#212630] bg-[#0d1117] px-2 py-1.5 text-[#8b949e]">
        {incident.path}
      </div>
    </div>
    <p className="text-[11px] leading-relaxed text-[#8b949e]">
      {incident.reasoning}
    </p>
  </article>
);
