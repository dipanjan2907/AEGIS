import type { ConfigFinding, ConfigType } from "../../types/config-fixer.types.js";
import { type ConfigAIAnalysisResponse } from "../../schemas/config-ai.schema.js";
export declare class GemmaConfigFixerService {
    private readonly client;
    constructor();
    analyzeAndRepair(configText: string, configType: ConfigType, staticFindings: ConfigFinding[]): Promise<ConfigAIAnalysisResponse>;
}
//# sourceMappingURL=gemma-config-fixer.service.d.ts.map