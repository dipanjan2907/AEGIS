import { HTTP_STATUS } from "../constants/http-status.js";
import { promptScanRequestSchema } from "../schemas/prompt-request.schema.js";
import { PromptFirewallOrchestrator } from "../services/prompt-firewall.orchestrator.js";
export class PromptController {
    orchestrator;
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }
    scanPrompt = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=prompt.controller.js.map