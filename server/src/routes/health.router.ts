import { Router, type Request, type Response } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";

const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "aegis-backend",
  });
});

export { healthRouter };
