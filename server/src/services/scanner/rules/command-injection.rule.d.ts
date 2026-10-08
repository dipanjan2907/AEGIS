import type { File } from "@babel/types";
import type { ISecurityRule } from "../interfaces/rule.interface.js";
import type { SecurityFinding } from "../../../types/finding.types.js";
export declare class CommandInjectionRule implements ISecurityRule {
    readonly id = "COMMAND_INJECTION";
    readonly name = "Command Injection Detection";
    evaluate(ast: File, rawCode: string): SecurityFinding[];
}
//# sourceMappingURL=command-injection.rule.d.ts.map