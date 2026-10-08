import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { logScanRequestSchema } from "../schemas/log-request.schema.js";
import { LogInvestigatorOrchestrator } from "../services/log-investigator.orchestrator.js";

export class LogController {
  constructor(private readonly orchestrator: LogInvestigatorOrchestrator) {}

  public scanLogs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated = logScanRequestSchema.parse(req.body);
      const report = await this.orchestrator.investigate({
        logText: validated.logText,
        logFormat: validated.logFormat,
        ...(validated.plainEnglishQuery === undefined
          ? {}
          : { plainEnglishQuery: validated.plainEnglishQuery }),
      });
      res.status(HTTP_STATUS.OK).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  };
}
