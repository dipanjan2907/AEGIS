import type { Request, Response, NextFunction } from "express";
import { PromptFirewallOrchestrator } from "../services/prompt-firewall.orchestrator.js";
export declare class PromptController {
    private readonly orchestrator;
    constructor(orchestrator: PromptFirewallOrchestrator);
    scanPrompt: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=prompt.controller.d.ts.map