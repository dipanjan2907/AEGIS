import type { File } from "@babel/types";
import type { ISecurityRule } from "../interfaces/rule.interface.js";
import type { SecurityFinding } from "../../../types/finding.types.js";
export declare class XssRule implements ISecurityRule {
    readonly id = "XSS";
    readonly name = "Cross-Site Scripting (XSS) Detection";
    evaluate(ast: File, rawCode: string): SecurityFinding[];
}
//# sourceMappingURL=xss.rule.d.ts.map