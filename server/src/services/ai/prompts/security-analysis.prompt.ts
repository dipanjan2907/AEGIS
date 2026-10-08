import type { SecurityFinding } from "../../../types/finding.types.js";

export const buildSecurityAnalysisPrompt = (
  code: string,
  findings: SecurityFinding[],
): string => {
  const formattedFindings = findings.map((f) => ({
    findingId: f.id,
    type: f.type,
    severity: f.severity,
    location: f.location,
    evidence: f.evidence,
    description: f.description,
  }));

  return `You are a senior cybersecurity engineer evaluating static code scan evidence.

SOURCE CODE:
\`\`\`
${code}
\`\`\`

DETERMINISTIC FINDINGS GATHERED BY SCANNER:
${JSON.stringify(formattedFindings, null, 2)}

INSTRUCTIONS:
Provide a JSON object analyzing EVERY finding in the input array matching this exact JSON schema:
{
  "analyses": [
    {
      "findingId": "string matching findingId from input",
      "explanation": "Clear, technical explanation of why this code pattern is dangerous",
      "attackPath": ["Step 1...", "Step 2...", "Step 3..."],
      "remediation": "Technical guide explaining how to make the code secure",
      "saferCodeExample": "Refactored, production-ready secure version of the code"
    }
  ]
}

DO NOT wrap in Markdown code blocks. Respond purely with valid JSON.`;
};
