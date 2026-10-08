import React from "react";
import type { LogFormat } from "../types/log-investigator.types";

const FORMATS: Array<{ value: LogFormat; label: string }> = [
  { value: "nginx_access", label: "Nginx Access" },
  { value: "express_json", label: "Express JSON" },
  { value: "auth_syslog", label: "Auth Syslog" },
];

interface LogFormatSelectorProps {
  value: LogFormat;
  onChange: (format: LogFormat) => void;
}

export const LogFormatSelector: React.FC<LogFormatSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="flex flex-wrap gap-1 rounded border border-[#303644] bg-[#0d1117] p-1">
    {FORMATS.map((format) => (
      <button
        key={format.value}
        type="button"
        aria-pressed={value === format.value}
        onClick={() => onChange(format.value)}
        className={`rounded px-2.5 py-1.5 font-mono text-[10px] transition-colors ${
          value === format.value
            ? "border border-[#A99AEF]/40 bg-[#A99AEF]/15 font-bold text-[#A99AEF]"
            : "text-[#8b949e] hover:text-[#e6edf3]"
        }`}
      >
        {format.label}
      </button>
    ))}
  </div>
);
