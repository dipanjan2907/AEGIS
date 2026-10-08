import { HTTP_STATUS } from "../constants/http-status.js";
import { scanRequestSchema } from "../schemas/scan-request.schema.js";
import { SecurityAnalysisOrchestrator } from "../services/security-analysis.orchestrator.js";
export class ScanController {
    orchestrator;
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }
    scanCode = async (req, res, next) => {
        try {
            const validatedBody = scanRequestSchema.parse(req.body);
            const report = await this.orchestrator.analyzeCode({
                code: validatedBody.code,
                language: validatedBody.language,
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
//# sourceMappingURL=scan.controller.js.map