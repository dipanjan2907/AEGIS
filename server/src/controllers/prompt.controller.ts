import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { promptScanRequestSchema } from "../schemas/prompt-request.schema.js";
import { PromptFirewallOrchestrator } from "../services/prompt-firewall.orchestrator.js";

export class PromptController {
  constructor(private readonly orchestrator: PromptFirewallOrchestrator) {}

  public scanPrompt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated = promptScanRequestSchema.parse(req.body);

      const report = await this.orchestrator.analyzePrompt({
        prompt: validated.prompt,
        firewallEnabled: validated.firewallEnabled,
        targetAgentRole: validated.targetAgentRole,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };
}
