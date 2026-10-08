import React, { createContext, useContext, useState } from "react";
import type {
  ThreatCounts,
  SecurityPosture,
  ActivityEvent,
} from "../modules/prompt-injection-firewall/types/telemetry.types";

interface TelemetryContextType {
  posture: SecurityPosture;
  threats: ThreatCounts;
  sparklineData: number[];
  recentEvents: ActivityEvent[];
  recordScanEvent: (
    event: Omit<ActivityEvent, "id" | "timestamp">,
    scoreDeduction?: number,
  ) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(
  undefined,
);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [postureScore, setPostureScore] = useState<number>(100);
  const [threats, setThreats] = useState<ThreatCounts>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [sparklineData, setSparklineData] = useState<number[]>([
    10, 15, 12, 20, 18, 25, 30, 28,
  ]);
  const [recentEvents, setRecentEvents] = useState<ActivityEvent[]>([]);

  // Calculate posture status dynamically from score
  const getPostureLabel = (score: number): SecurityPosture["label"] => {
    if (score >= 80) return "OPTIMAL";
    if (score >= 50) return "ELEVATED RISK";
    return "CRITICAL VULNERABILITIES";
  };

  const getPostureColor = (score: number): string => {
    if (score >= 80) return "#62D7AE";
    if (score >= 50) return "#ffd166";
    return "#f87171";
  };

  // Called whenever a module completes a scan
  const recordScanEvent = (
    eventData: Omit<ActivityEvent, "id" | "timestamp">,
    scoreDeduction: number = 0,
  ) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const newEvent: ActivityEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      timestamp,
    };

    // Update Recent Events Feed (keep latest 5)
    setRecentEvents((prev) => [newEvent, ...prev.slice(0, 4)]);

    // Update Threat Counters dynamically based on severity
    setThreats((prev) => {
      const updated = { ...prev };
      if (eventData.severity === "CRITICAL") updated.critical += 1;
      else if (eventData.severity === "HIGH") updated.high += 1;
      else if (eventData.severity === "MEDIUM") updated.medium += 1;
      else if (eventData.severity === "LOW") updated.low += 1;
      return updated;
    });

    // Adjust Posture Score dynamically
    setPostureScore((prev) =>
      Math.max(0, Math.min(100, prev - scoreDeduction)),
    );

    // Push new point to real-time sparkline graph
    setSparklineData((prev) => [
      ...prev.slice(1),
      Math.min(100, (scoreDeduction + 2) * 5),
    ]);
  };

  return (
    <TelemetryContext.Provider
      value={{
        posture: {
          score: postureScore,
          label: getPostureLabel(postureScore),
          statusColor: getPostureColor(postureScore),
        },
        threats,
        sparklineData,
        recentEvents,
        recordScanEvent,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
};
