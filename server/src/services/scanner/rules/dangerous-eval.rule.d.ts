import type { File } from "@babel/types";
import type { ISecurityRule } from "../interfaces/rule.interface.js";
import type { SecurityFinding } from "../../../types/finding.types.js";
export declare class DangerousEvalRule implements ISecurityRule {
    readonly id = "DANGEROUS_EVAL";
    readonly name = "Dangerous Code Execution Detection";
    evaluate(ast: File, rawCode: string): SecurityFinding[];
}
//# sourceMappingURL=dangerous-eval.rule.d.ts.map