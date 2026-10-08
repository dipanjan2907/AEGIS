import type {
  PromptFinding,
  InjectionType,
  RiskLevel,
} from "../../types/prompt-firewall.types.js";

interface RulePattern {
  id: string;
  type: InjectionType;
  risk: RiskLevel;
  title: string;
  pattern: RegExp;
  reasoning: string;
}

export class PromptGuardScanner {
  private readonly rules: RulePattern[] = [
    // -------------------------------------------------------------------------
    // 1. INSTRUCTION HIJACKING & OVERRIDES
    // -------------------------------------------------------------------------
    {
      id: "hijack-instruction-override",
      type: "INSTRUCTION_HIJACKING",
      risk: "CRITICAL",
      title: "System Instruction Override Attempt",
      // Matches "ignore/disregard/override prior instructions" and semantic variations like "reset instructions"
      pattern:
        /\b(?:ignore|disregard|forget|override|bypass|reset|cancel)\s+(?:all\s+)?(?:previous|prior|above|former|earlier|system)\s+(?:instructions|directives|prompts|rules|guidelines|constraints)\b/i,
      reasoning:
        "Attempting to force the LLM to ignore preceding system guidelines or safety constraints.",
    },
    {
      id: "hijack-system-directive",
      type: "INSTRUCTION_HIJACKING",
      risk: "CRITICAL",
      title: "System Role Directive Injection",
      // Matches "new system prompt", "developer mode active", "admin instruction:"
      pattern:
        /\b(?:new\s+system\s+instruction|system\s+prompt\s+override|developer\s+mode\s+(?:enabled|activated?)|admin\s+override)\b/i,
      reasoning:
        "Impersonating system-level configuration commands to gain privileged execution context.",
    },
    {
      id: "hijack-coercive-command",
      type: "INSTRUCTION_HIJACKING",
      risk: "HIGH",
      title: "Coercive Command Shift",
      // Matches "from now on you must/will/shall" or "your new task is to ignore"
      pattern:
        /\b(?:from\s+now\s+on|starting\s+now)\s+you\s+(?:must|will|shall|are\s+required\s+to)\b/i,
      reasoning:
        "Coercive instruction attempt designed to reframe model behavior away from original constraints.",
    },

    // -------------------------------------------------------------------------
    // 2. DATA EXFILTRATION & LEAKAGE
    // -------------------------------------------------------------------------
    {
      id: "exfil-credential-leak",
      type: "DATA_EXFILTRATION",
      risk: "HIGH",
      title: "Credential or Prompt Exfiltration Directives",
      // Matches "reveal/print/exfiltrate system prompt, api key, credentials"
      pattern:
        /\b(?:reveal|output|display|print|share|leak|exfiltrate|dump)\b[\s\S]{0,40}\b(?:system\s+prompt|api\s+keys?|credentials?|passwords?|secret_keys?|env\s+vars?)\b/i,
      reasoning:
        "Directing the model to output sensitive system parameters, API keys, or private prompts.",
    },
    {
      id: "exfil-outbound-url",
      type: "DATA_EXFILTRATION",
      risk: "HIGH",
      title: "Outbound Exfiltration Payload",
      // Fixed unsafe wildcard matching; uses bounded window between verb and URI/webhook target
      pattern:
        /\b(?:send|transmit|exfiltrate|post|fetch|curl|wget)\b[\s\S]{0,50}\b(?:https?:\/\/[^\s>]+|webhook\.site|[a-z0-9-]+\.attacker\.com)\b/i,
      reasoning:
        "Attempting to force the model to issue or embed external HTTP requests to exfiltrate context.",
    },

    // -------------------------------------------------------------------------
    // 3. JAILBREAKS & PERSONA HIJACKING
    // -------------------------------------------------------------------------
    {
      id: "jailbreak-persona-shift",
      type: "JAILBREAK_ROLEPLAY",
      risk: "HIGH",
      title: "Unrestricted Persona Roleplay",
      // Matches "you are now DAN", "act as an unfiltered AI", "pretend to have no safety guidelines"
      pattern:
        /\b(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be)\s+(?:a\s+)?(?:DAN|jailbroken|unfiltered|evil|unrestricted|godmode|root)\b/i,
      reasoning:
        "Coercing the model into adopting a persona intended to bypass safety boundaries.",
    },
    {
      id: "jailbreak-unrestricted-mode",
      type: "JAILBREAK_ROLEPLAY",
      risk: "MEDIUM",
      title: "Safety Filter Bypass Claim",
      // Matches "ignore safety filters", "unrestricted mode"
      pattern:
        /\b(?:do\s+anything\s+now|ignore\s+(?:all\s+)?safety\s+(?:filters?|rules?)|bypass\s+guardrails?)\b/i,
      reasoning:
        "Expressly instructing the LLM to skip inherent guardrails and moderation layers.",
    },

    // -------------------------------------------------------------------------
    // 4. DELIMITER & STRUCTURAL SPOOFING
    // -------------------------------------------------------------------------
    {
      id: "delimiter-system-tags",
      type: "DELIMITER_SPOOFING",
      risk: "MEDIUM",
      title: "System Delimiter Impersonation",
      // Matches <system>, </system>, ```system, [SYSTEM MESSAGE], [ADMIN INSTRUCTION]
      pattern:
        /(?:<\/?system>|```\s*system|\[(?:SYSTEM\vert{}ADMIN\vert{}DEVELOPER)\s+(?:MESSAGE\vert{}INSTRUCTION\vert{}PROMPT)\])/i,
      reasoning:
        "Injecting structural system tags or block delimiters to spoof prompt parsing boundaries.",
    },
  ];

  public scan(text: string): PromptFinding[] {
    if (!text || typeof text !== "string") {
      return [];
    }

    const findings: PromptFinding[] = [];

    // Step 1: Normalize text for scanning while leaving raw `text` untouched for `suspiciousText`
    const normalizedText = this.normalizeInput(text);

    // Step 2: Check for hidden Unicode / Zero-Width Characters
    if (/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/.test(text)) {
      findings.push({
        id: "unicode-zero-width",
        type: "HIDDEN_ENCODING",
        risk: "MEDIUM",
        title: "Hidden Zero-Width / BIDI Unicode Characters",
        suspiciousText: "Invisible unicode characters detected",
        reasoning:
          "Obfuscation technique using zero-width spaces or directional override tags to evade scanners.",
      });
    }

    // Step 3: Run Pattern Matching against Normalized Text
    for (const rule of this.rules) {
      const match = rule.pattern.exec(normalizedText);
      if (match) {
        // Extract the original, raw substring using the match indices to preserve exact formatting
        const rawSnippet =
          match.index !== undefined && match[0]
            ? text.slice(match.index, match.index + match[0].length)
            : match[0];

        findings.push({
          id: rule.id,
          type: rule.type,
          risk: rule.risk,
          title: rule.title,
          suspiciousText: rawSnippet || match[0],
          reasoning: rule.reasoning,
        });
      }
    }

    return findings;
  }

  /**
   * Performs input normalization (NFKC, zero-width stripping, whitespace collapse)
   * without mutating the original input string.
   */
  private normalizeInput(input: string): string {
    return (
      input
        // 1. Compatibility decomposition + canonical composition (handles fullwidth characters, obscure accents)
        .normalize("NFKC")
        // 2. Remove zero-width spaces and control characters that break pattern detection
        .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, "")
        // 3. Replace common obfuscation substitutions (e.g., zero -> 'o' in specific contexts if needed, or non-standard spaces)
        .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
        // 4. Collapse consecutive whitespace into single spaces for clean token boundary checks
        .replace(/\s+/g, " ")
    );
  }
}
