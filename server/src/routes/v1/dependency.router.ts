import { Router } from "express";
import { DependencyController } from "../../controllers/dependency.controller.js";
import { DependencyAutopsyOrchestrator } from "../../services/dependency-autopsy.orchestrator.js";
import { DependencyGuardScanner } from "../../services/scanner/dependency-guard.scanner.js";
import { GemmaDependencyAutopsyService } from "../../services/ai/gemma-dependency-autopsy.service.js";

const dependencyRouter = Router();
const scanner = new DependencyGuardScanner();
const aiService = new GemmaDependencyAutopsyService();
const orchestrator = new DependencyAutopsyOrchestrator(scanner, aiService);
const controller = new DependencyController(orchestrator);

dependencyRouter.post("/scan", controller.scanDependencies);

export { dependencyRouter };
