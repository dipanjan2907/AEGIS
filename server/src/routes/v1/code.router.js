import { Router } from "express";
import { ScanController } from "../../controllers/scan.controller.js";
import { SecurityAnalysisOrchestrator } from "../../services/security-analysis.orchestrator.js";
import { CodeGuardScanner } from "../../services/scanner/code-guard.scanner.js";
import { GemmaProviderService } from "../../services/ai/gemma-provider.service.js";
const codeRouter = Router();
// Dependency Injection Setup
const scanner = new CodeGuardScanner();
const aiProvider = new GemmaProviderService();
const orchestrator = new SecurityAnalysisOrchestrator(scanner, aiProvider);
const scanController = new ScanController(orchestrator);
codeRouter.post("/scan", scanController.scanCode);
export { codeRouter };
//# sourceMappingURL=code.router.js.map