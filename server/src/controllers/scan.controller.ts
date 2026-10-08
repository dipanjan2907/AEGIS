import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";

import { scanRequestSchema } from "../schemas/scan-request.schema.js";
import { SecurityAnalysisOrchestrator } from "../services/security-analysis.orchestrator.js";

export class ScanController {
  constructor(private readonly orchestrator: SecurityAnalysisOrchestrator) {}

  public scanCode = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
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
    } catch (error) {
      next(error);
    }
  };
}
