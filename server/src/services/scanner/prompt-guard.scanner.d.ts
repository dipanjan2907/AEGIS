import type { PromptFinding } from "../../types/prompt-firewall.types.js";
export declare class PromptGuardScanner {
    private readonly rules;
    scan(text: string): PromptFinding[];
    /**
     * Performs input normalization (NFKC, zero-width stripping, whitespace collapse)
     * without mutating the original input string.
     */
    private normalizeInput;
}
//# sourceMappingURL=prompt-guard.scanner.d.ts.map