import React, { useEffect, useState } from "react";
import {
  Terminal,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface ScanProgressBarProps {
  isScanning: boolean;
}

const SCAN_STEPS = [
  {
    label: "Parsing JavaScript / TypeScript AST...",
    duration: 2200,
    icon: Terminal,
  },
  {
    label: "Running Deterministic Security Rules...",
    duration: 3200,
    icon: ShieldCheck,
  },
  {
    label: "Dispatching Evidence to Gemma AI Model...",
    duration: 4200,
    icon: Cpu,
  },
  {
    label: "Validating AI Remediation & Attack Paths...",
    duration: 2800,
    icon: Zap,
  },
  {
    label: "Assembling Final Security Report...",
    duration: 1800,
    icon: CheckCircle2,
  },
];

const TOTAL_DURATION = SCAN_STEPS.reduce(
  (total, step) => total + step.duration,
  0,
);

export const ScanProgressBar: React.FC<ScanProgressBarProps> = ({
  isScanning,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (!isScanning) {
      setProgress(0);
      setCurrentStepIdx(0);
      return;
    }

    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;

      /*
       * Keep the progress believable.
       *
       * We intentionally slow down after 85% so the UI doesn't
       * suddenly hit 99% and look frozen while the backend finishes.
       */
      const rawProgress = Math.min(
        (elapsed / TOTAL_DURATION) * 100,
        100,
      );

      let visualProgress: number;

      if (rawProgress <= 85) {
        visualProgress = rawProgress;
      } else {
        // Compress the final 15% into roughly 85 → 94%.
        visualProgress = 85 + (rawProgress - 85) * 0.6;
      }

      setProgress(Math.min(visualProgress, 94));

      /*
       * Determine which scan stage we're currently in.
       */
      let accumulated = 0;

      for (let i = 0; i < SCAN_STEPS.length; i++) {
        accumulated += SCAN_STEPS[i].duration;

        if (elapsed < accumulated) {
          setCurrentStepIdx(i);
          break;
        }
      }

      /*
       * Once the estimated scan duration is reached, remain in
       * the finalization stage until the real scan finishes.
       */
      if (elapsed >= TOTAL_DURATION) {
        setCurrentStepIdx(SCAN_STEPS.length - 1);
        setProgress(94);
      }
    };

    updateProgress();

    const interval = setInterval(updateProgress, 100);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isScanning) return null;

  const ActiveIcon =
    SCAN_STEPS[currentStepIdx]?.icon || Terminal;

  const isFinalizing = currentStepIdx === SCAN_STEPS.length - 1;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0d1117]/80 p-6 backdrop-blur-sm animate-[overlayPulse_3s_ease-in-out_infinite]">
      <div className="w-full max-w-lg space-y-5 rounded-xl border border-[#212630] bg-[#131720] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212630] pb-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Active icon */}
            <div
              className={`shrink-0 rounded border p-2 ${
                isFinalizing
                  ? "border-[#00e6a8]/30 bg-[#00e6a8]/10 text-[#00e6a8]"
                  : "border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]"
              }`}
            >
              <ActiveIcon className="h-5 w-5 animate-pulse" />
            </div>

            {/* Title + current action */}
            <div className="min-w-0">
              <h4 className="font-mono text-sm font-bold text-[#e6edf3]">
                CODEGUARD SCAN IN PROGRESS
              </h4>

              <p className="truncate font-mono text-xs text-[#8b949e]">
                {SCAN_STEPS[currentStepIdx]?.label}
              </p>
            </div>
          </div>

          {/* Progress / Finalizing indicator */}
          <div className="ml-4 shrink-0 font-mono text-xl font-extrabold">
            {isFinalizing ? (
              <span className="flex items-center gap-1.5 text-[#00e6a8]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                <span className="text-xs tracking-wide">
                  FINALIZING
                </span>
              </span>
            ) : (
              <span className="text-[#00f0ff]">
                {Math.floor(progress)}%
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-[#212630] bg-[#161b22]">
            {/* Main progress */}
            <div
              className={`relative h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#00e6a8] to-[#ff6b35] ${
                isFinalizing
                  ? "w-[94%]"
                  : "transition-[width] duration-100 ease-linear"
              }`}
              style={
                !isFinalizing
                  ? { width: `${progress}%` }
                  : undefined
              }
            >
              {/* Moving highlight during finalization */}
              {isFinalizing && (
                <div className="absolute inset-y-0 left-0 w-1/3 animate-[scan_1.4s_ease-in-out_infinite] bg-white/30 blur-sm" />
              )}
            </div>

            {/* Subtle glow during finalization */}
            {isFinalizing && (
              <div className="pointer-events-none absolute inset-0 animate-pulse rounded-full shadow-[0_0_14px_rgba(0,230,168,0.25)]" />
            )}
          </div>

          {/* Status text */}
          <div className="flex items-center justify-between font-mono text-[10px] text-[#484f58]">
            <span>
              {isFinalizing
                ? "Verifying findings and generating report..."
                : "Analyzing source and security evidence..."}
            </span>

            <span>
              {isFinalizing ? "● PROCESSING" : "● LIVE"}
            </span>
          </div>
        </div>

        {/* Scan steps */}
        <div className="grid grid-cols-1 gap-1.5 pt-2">
          {SCAN_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-2 rounded px-3 py-1.5 font-mono text-xs transition-all duration-300 ${
                  isDone
                    ? "border border-[#00e6a8]/20 bg-[#00e6a8]/5 text-[#00e6a8]"
                    : isCurrent
                      ? "border border-[#00f0ff]/30 bg-[#00f0ff]/10 font-bold text-[#00f0ff]"
                      : "border border-transparent text-[#484f58]"
                }`}
              >
                {/* Status indicator */}
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full bg-current ${
                    isCurrent ? "animate-pulse" : ""
                  }`}
                />

                <span className="truncate">
                  {step.label}
                </span>

                {/* Done indicator */}
                {isDone && (
                  <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};