import { Router } from "express";
import { ConfigController } from "../../controllers/config.controller.js";
import { ConfigFixerOrchestrator } from "../../services/config-fixer.orchestrator.js";
import { ConfigGuardScanner } from "../../services/scanner/config-guard.scanner.js";
import { GemmaConfigFixerService } from "../../services/ai/gemma-config-fixer.service.js";
const configRouter = Router();
const scanner = new ConfigGuardScanner();
const aiService = new GemmaConfigFixerService();
const orchestrator = new ConfigFixerOrchestrator(scanner, aiService);
const controller = new ConfigController(orchestrator);
configRouter.post("/scan", controller.scanConfig);
export { configRouter };
//# sourceMappingURL=config.router.js.map