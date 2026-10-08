import type { Request, Response, NextFunction } from "express";
import { SecurityAnalysisOrchestrator } from "../services/security-analysis.orchestrator.js";
export declare class ScanController {
    private readonly orchestrator;
    constructor(orchestrator: SecurityAnalysisOrchestrator);
    scanCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=scan.controller.d.ts.map