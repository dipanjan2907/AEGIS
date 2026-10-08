import type { CodeGuardScanner } from "./scanner/code-guard.scanner.js";
import type { IAIProvider } from "./ai/interfaces/ai-provider.interface.js";
import type { SecurityReport } from "../types/report.types.js";
interface AnalyzeCodeParams {
    code: string;
    language: "javascript" | "typescript";
}
export declare class SecurityAnalysisOrchestrator {
    private readonly scanner;
    private readonly aiProvider;
    constructor(scanner: CodeGuardScanner, aiProvider: IAIProvider);
    analyzeCode(params: AnalyzeCodeParams): Promise<SecurityReport>;
    private computeSeveritySummary;
    private calculateSecurityScore;
}
export {};
//# sourceMappingURL=security-analysis.orchestrator.d.ts.map