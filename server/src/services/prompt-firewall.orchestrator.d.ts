import { PromptGuardScanner } from "./scanner/prompt-guard.scanner.js";
import { GemmaPromptFirewallService } from "./ai/gemma-prompt-firewall.services.js";
import type { PromptFirewallReport } from "../types/prompt-firewall.types.js";
interface AnalyzePromptParams {
    prompt: string;
    firewallEnabled: boolean;
    targetAgentRole: string;
}
export declare class PromptFirewallOrchestrator {
    private readonly scanner;
    private readonly aiService;
    constructor(scanner: PromptGuardScanner, aiService: GemmaPromptFirewallService);
    analyzePrompt(params: AnalyzePromptParams): Promise<PromptFirewallReport>;
}
export {};
//# sourceMappingURL=prompt-firewall.orchestrator.d.ts.map