import { Router } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
const healthRouter = Router();
healthRouter.get("/", (_req, res) => {
    res.status(HTTP_STATUS.OK).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "aegis-backend",
    });
});
export { healthRouter };
//# sourceMappingURL=health.router.js.map