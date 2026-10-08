import { Router } from "express";
import { PromptController } from "../../controllers/prompt.controller.js";
import { PromptFirewallOrchestrator } from "../../services/prompt-firewall.orchestrator.js";
import { PromptGuardScanner } from "../../services/scanner/prompt-guard.scanner.js";
import { GemmaPromptFirewallService } from "../../services/ai/gemma-prompt-firewall.services.js";

const promptRouter = Router();

const scanner = new PromptGuardScanner();
const aiService = new GemmaPromptFirewallService();
const orchestrator = new PromptFirewallOrchestrator(scanner, aiService);
const controller = new PromptController(orchestrator);

promptRouter.post("/scan", controller.scanPrompt);

export { promptRouter };
