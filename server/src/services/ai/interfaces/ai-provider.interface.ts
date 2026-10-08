import type { SecurityFinding } from "../../../types/finding.types.js";
import type { AIAnalysisResponse } from "../../../schemas/ai-response.schema.js";

export interface IAIProvider {
  analyzeFindings(
    code: string,
    findings: SecurityFinding[],
  ): Promise<AIAnalysisResponse>;
}
