import { ConfigGuardScanner } from "./scanner/config-guard.scanner.js";
import { GemmaConfigFixerService } from "./ai/gemma-config-fixer.service.js";
import type { ConfigFixReport, ConfigType } from "../types/config-fixer.types.js";
interface AnalyzeConfigParams {
    configText: string;
    configType: ConfigType;
}
export declare class ConfigFixerOrchestrator {
    private readonly scanner;
    private readonly aiService;
    constructor(scanner: ConfigGuardScanner, aiService: GemmaConfigFixerService);
    analyzeConfig(params: AnalyzeConfigParams): Promise<ConfigFixReport>;
}
export {};
//# sourceMappingURL=config-fixer.orchestrator.d.ts.map