import type { File } from "@babel/types";
import type { ISecurityRule } from "../interfaces/rule.interface.js";
import type { SecurityFinding } from "../../../types/finding.types.js";
export declare class HardcodedSecretsRule implements ISecurityRule {
    readonly id = "HARDCODED_SECRETS";
    readonly name = "Hardcoded Secrets Detection";
    evaluate(ast: File, rawCode: string): SecurityFinding[];
}
//# sourceMappingURL=hardcoded-secrets.rule.d.ts.map