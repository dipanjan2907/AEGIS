import React from "react";
import { Activity, CircleDot } from "lucide-react";
import type {
  AttackTimelineEvent,
  SeverityLevel,
} from "../types/log-investigator.types";

const severityColor: Record<SeverityLevel, string> = {
  CRITICAL: "text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10",
  HIGH: "text-[#fb923c] border-[#fb923c]/30 bg-[#fb923c]/10",
  MEDIUM: "text-[#E8C66A] border-[#E8C66A]/30 bg-[#E8C66A]/10",
  LOW: "text-[#62D7AE] border-[#62D7AE]/30 bg-[#62D7AE]/10",
  INFO: "text-[#A99AEF] border-[#A99AEF]/30 bg-[#A99AEF]/10",
};

interface AttackTimelineProps {
  events: AttackTimelineEvent[];
}

export const AttackTimeline: React.FC<AttackTimelineProps> = ({ events }) => (
  <section className="space-y-3 rounded-lg border border-[#212630] bg-[#131720] p-4">
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-[#e6edf3]">
        <Activity className="h-4 w-4 text-[#A99AEF]" />
        VISUAL ATTACK TIMELINE
      </h3>
      <span className="font-mono text-[10px] text-[#8b949e]">
        {events.length} EVENTS
      </span>
    </div>
    {events.length > 0 ? (
      <div className="max-h-80 space-y-0 overflow-y-auto pr-1">
        {events.map((event, index) => (
          <div key={`${event.time}-${index}`} className="flex gap-3">
            <div className="flex w-4 shrink-0 flex-col items-center">
              <CircleDot className="mt-3 h-3 w-3 shrink-0 text-[#A99AEF]" />
              {index < events.length - 1 && (
                <div className="my-1 w-px flex-1 bg-[#303644]" />
              )}
            </div>
            <div className="flex-1 border-b border-[#212630] py-2.5">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <time className="font-mono text-[10px] text-[#8b949e]">
                  {event.time}
                </time>
                <span
                  className={`rounded border px-1.5 py-0.5 font-mono text-[8px] font-bold ${severityColor[event.severity]}`}
                >
                  {event.severity}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#c4cbd4]">
                {event.event}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="rounded border border-dashed border-[#303644] p-5 text-center font-mono text-[10px] text-[#8b949e]">
        No anomalous events were identified by deterministic rules.
      </p>
    )}
  </section>
);
