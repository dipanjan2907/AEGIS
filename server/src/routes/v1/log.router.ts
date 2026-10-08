import { Router } from "express";
import { LogController } from "../../controllers/log.controller.js";
import { LogInvestigatorOrchestrator } from "../../services/log-investigator.orchestrator.js";
import { LogGuardScanner } from "../../services/scanner/log-guard.scanner.js";
import { GemmaLogInvestigatorService } from "../../services/ai/gemma-log-investigator.service.js";

const logRouter = Router();
const scanner = new LogGuardScanner();
const aiService = new GemmaLogInvestigatorService();
const orchestrator = new LogInvestigatorOrchestrator(scanner, aiService);
const controller = new LogController(orchestrator);

logRouter.post("/scan", controller.scanLogs);

export { logRouter };
