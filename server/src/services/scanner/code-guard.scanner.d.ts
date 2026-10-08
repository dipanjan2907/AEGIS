import type { SecurityFinding } from "../../types/finding.types.js";
export declare class CodeGuardScanner {
    private readonly parser;
    private readonly rules;
    constructor();
    scan(code: string, language: "javascript" | "typescript"): SecurityFinding[];
}
//# sourceMappingURL=code-guard.scanner.d.ts.map