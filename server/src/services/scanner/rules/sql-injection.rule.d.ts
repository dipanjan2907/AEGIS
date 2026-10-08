import type { File } from "@babel/types";
import type { ISecurityRule } from "../interfaces/rule.interface.js";
import type { SecurityFinding } from "../../../types/finding.types.js";
export declare class SqlInjectionRule implements ISecurityRule {
    readonly id = "SQL_INJECTION";
    readonly name = "SQL Injection Detection";
    evaluate(ast: File, rawCode: string): SecurityFinding[];
}
//# sourceMappingURL=sql-injection.rule.d.ts.map