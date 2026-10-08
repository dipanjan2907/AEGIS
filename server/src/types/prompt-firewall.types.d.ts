export type InjectionType = "INSTRUCTION_HIJACKING" | "DATA_EXFILTRATION" | "JAILBREAK_ROLEPLAY" | "DELIMITER_SPOOFING" | "HIDDEN_ENCODING";
export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
export interface PromptFinding {
    id: string;
    type: InjectionType;
    risk: RiskLevel;
    title: string;
    suspiciousText: string;
    reasoning: string;
}
export interface AgentSimulationResult {
    firewallEnabled: boolean;
    agentSystemPrompt: string;
    rawInput: string;
    effectiveInput: string;
    agentResponse: string;
    wasHijacked: boolean;
    hijackEvidence?: string[];
}
export interface PromptFirewallReport {
    scanId: string;
    timestamp: string;
    firewallEnabled: boolean;
    isInjected: boolean;
    overallRisk: RiskLevel;
    findings: PromptFinding[];
    removedSegments: string[];
    sanitizedPrompt: string;
    simulation: AgentSimulationResult;
}
//# sourceMappingURL=prompt-firewall.types.d.ts.map