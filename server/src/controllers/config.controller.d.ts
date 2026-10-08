import type { Request, Response, NextFunction } from "express";
import { ConfigFixerOrchestrator } from "../services/config-fixer.orchestrator.js";
export declare class ConfigController {
    private readonly orchestrator;
    constructor(orchestrator: ConfigFixerOrchestrator);
    scanConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=config.controller.d.ts.map