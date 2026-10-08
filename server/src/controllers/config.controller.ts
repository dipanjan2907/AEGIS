import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { configScanRequestSchema } from "../schemas/config-request.schema.js";
import { ConfigFixerOrchestrator } from "../services/config-fixer.orchestrator.js";

export class ConfigController {
  constructor(private readonly orchestrator: ConfigFixerOrchestrator) {}

  public scanConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validated = configScanRequestSchema.parse(req.body);

      const report = await this.orchestrator.analyzeConfig({
        configText: validated.configText,
        configType: validated.configType,
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