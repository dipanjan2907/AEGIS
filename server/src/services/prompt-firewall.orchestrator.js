import { randomUUID } from "node:crypto";
import { PromptGuardScanner } from "./scanner/prompt-guard.scanner.js";
import { GemmaPromptFirewallService } from "./ai/gemma-prompt-firewall.services.js";
import { logger } from "../utils/logger.js";
export class PromptFirewallOrchestrator {
    scanner;
    aiService;
    constructor(scanner, aiService) {
        this.scanner = scanner;
        this.aiService = aiService;
    }
    async analyzePrompt(params) {
        const scanId = randomUUID();
        const timestamp = new Date().toISOString();
        logger.info({ scanId, firewallEnabled: params.firewallEnabled }, "Initiating Prompt Injection Firewall analysis");
        // Pass 1: Deterministic Heuristic Scanner
        const staticFindings = this.scanner.scan(params.prompt);
        // Pass 2: Gemma Analysis & Agent Simulation
        const aiAnalysis = await this.aiService.analyzeAndSanitize(params.prompt, params.targetAgentRole, staticFindings);
        // Merge static and AI findings, deduplicating titles
        const combinedFindings = [...staticFindings];
        for (const aiFinding of aiAnalysis.findings) {
            if (!combinedFindings.some((f) => f.title === aiFinding.title)) {
                combinedFindings.push(aiFinding);
            }
        }
        const effectiveInput = params.firewallEnabled
            ? aiAnalysis.sanitizedPrompt
            : params.prompt;
        const agentResponse = params.firewallEnabled
            ? aiAnalysis.protectedAgentResponse
            : aiAnalysis.unprotectedAgentResponse;
        return {
            scanId,
            timestamp,
            firewallEnabled: params.firewallEnabled,
            isInjected: aiAnalysis.isInjected,
            overallRisk: aiAnalysis.isInjected ? aiAnalysis.overallRisk : "SAFE",
            findings: aiAnalysis.isInjected ? combinedFindings : [],
            removedSegments: params.firewallEnabled ? aiAnalysis.removedSegments : [],
            sanitizedPrompt: aiAnalysis.sanitizedPrompt,
            simulation: {
                firewallEnabled: params.firewallEnabled,
                agentSystemPrompt: params.targetAgentRole,
                rawInput: params.prompt,
                effectiveInput,
                agentResponse,
                wasHijacked: !params.firewallEnabled && aiAnalysis.wasHijackedInUnprotected,
                ...(aiAnalysis.hijackEvidence && {
                    hijackEvidence: aiAnalysis.hijackEvidence,
                }),
            },
        };
    }
}
//# sourceMappingURL=prompt-firewall.orchestrator.js.map