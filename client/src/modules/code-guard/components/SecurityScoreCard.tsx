import React from "react";

interface SecurityScoreCardProps {
  score: number;
  totalVulnerabilities: number;
}

export const SecurityScoreCard: React.FC<SecurityScoreCardProps> = ({
  score,
  totalVulnerabilities,
}) => {
  const getScoreColor = (val: number) => {
    if (val > 75) return "text-[#00e6a8]";
    if (val > 40) return "text-[#ffd166]";
    return "text-[#f87171]";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-5 bg-[#161b22] border border-[#212630] rounded-lg flex flex-col justify-between">
        <span className="text-xs font-mono text-[#8b949e]">SECURITY SCORE</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span
            className={`text-4xl font-mono font-extrabold ${getScoreColor(score)}`}
          >
            {score}
          </span>
          <span className="text-xs text-[#8b949e] font-mono">/ 100</span>
        </div>
      </div>

      <div className="p-5 bg-[#161b22] border border-[#212630] rounded-lg flex flex-col justify-between">
        <span className="text-xs font-mono text-[#8b949e]">
          TOTAL VULNERABILITIES
        </span>
        <span className="text-3xl font-mono font-extrabold text-[#e6edf3] mt-2">
          {totalVulnerabilities}
        </span>
      </div>
    </div>
  );
};
