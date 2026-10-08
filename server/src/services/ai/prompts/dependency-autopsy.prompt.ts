import type { DependencyReport } from "../../../types/dependency-autopsy.types.js";

export const buildDependencyAutopsyPrompt = (
  report: DependencyReport,
): string => `You are a software supply-chain security analyst. Review this deterministic dependency scan and improve each finding's impactAssessment and summary with accurate, concise guidance about update or removal impact.

Use the supplied transitiveGraph and transitiveChain to explain affected parent packages and likely breakage when a vulnerable dependency is removed or updated. Do not invent vulnerabilities or alter package versions, CVE identifiers, severity, metrics, scan identifiers, or graph edges. Preserve every finding and return a complete JSON object matching the supplied report exactly. If there is insufficient context, state that in the impact assessment.

Deterministic scan report:
${JSON.stringify(report)}
`;
