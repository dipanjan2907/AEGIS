import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { dependencyScanRequestSchema } from "../schemas/dependency-request.schema.js";
import { DependencyAutopsyOrchestrator } from "../services/dependency-autopsy.orchestrator.js";

export class DependencyController {
  constructor(private readonly orchestrator: DependencyAutopsyOrchestrator) {}

  public scanDependencies = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated = dependencyScanRequestSchema.parse(req.body);
      const report = await this.orchestrator.scan({
        lockfileContent: validated.lockfileContent,
        lockfileType: validated.lockfileType,
      });
      res.status(HTTP_STATUS.OK).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  };
}
