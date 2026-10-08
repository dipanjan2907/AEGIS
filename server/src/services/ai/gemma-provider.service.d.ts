import type { IAIProvider } from "./interfaces/ai-provider.interface.js";
import type { SecurityFinding } from "../../types/finding.types.js";
import { type AIAnalysisResponse } from "../../schemas/ai-response.schema.js";
export declare class GemmaProviderService implements IAIProvider {
    private readonly client;
    constructor();
    analyzeFindings(code: string, findings: SecurityFinding[]): Promise<AIAnalysisResponse>;
}
//# sourceMappingURL=gemma-provider.service.d.ts.map