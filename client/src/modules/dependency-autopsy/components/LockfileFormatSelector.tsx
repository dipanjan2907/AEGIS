import React from "react";
import type { LockfileType } from "../types/dependency-autopsy.types";

const LOCKFILE_FORMATS: LockfileType[] = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
];

interface LockfileFormatSelectorProps {
  value: LockfileType;
  onChange: (value: LockfileType) => void;
}

export const LockfileFormatSelector: React.FC<LockfileFormatSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="flex flex-wrap items-center gap-1 rounded border border-[#303644] bg-[#0d1117] p-1">
    {LOCKFILE_FORMATS.map((format) => (
      <button
        key={format}
        type="button"
        onClick={() => onChange(format)}
        aria-pressed={value === format}
        className={`rounded px-2.5 py-1.5 font-mono text-[10px] transition-colors ${
          value === format
            ? "border border-[#E8C66A]/40 bg-[#E8C66A]/15 font-bold text-[#E8C66A]"
            : "text-[#8b949e] hover:text-[#e6edf3]"
        }`}
      >
        {format}
      </button>
    ))}
  </div>
);
