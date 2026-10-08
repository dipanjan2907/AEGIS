import type { PromptFinding } from "../../types/prompt-firewall.types.js";
import { type PromptAIAnalysisResponse } from "../../schemas/prompt-ai.schema.js";
export declare class GemmaPromptFirewallService {
    private readonly client;
    constructor();
    analyzeAndSanitize(rawInput: string, targetAgentRole: string, staticFindings: PromptFinding[]): Promise<PromptAIAnalysisResponse>;
}
//# sourceMappingURL=gemma-prompt-firewall.services.d.ts.map