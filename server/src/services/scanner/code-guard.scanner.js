import { ASTParser } from "./ast-parser.js";
import { SqlInjectionRule } from "./rules/sql-injection.rule.js";
import { CommandInjectionRule } from "./rules/command-injection.rule.js";
import { XssRule } from "./rules/xss.rule.js";
import { HardcodedSecretsRule } from "./rules/hardcoded-secrets.rule.js";
import { DangerousEvalRule } from "./rules/dangerous-eval.rule.js";
export class CodeGuardScanner {
    parser;
    rules;
    constructor() {
        this.parser = new ASTParser();
        this.rules = [
            new SqlInjectionRule(),
            new CommandInjectionRule(),
            new XssRule(),
            new HardcodedSecretsRule(),
            new DangerousEvalRule(),
        ];
    }
    scan(code, language) {
        const ast = this.parser.parseCode(code, language);
        const findings = [];
        for (const rule of this.rules) {
            const ruleFindings = rule.evaluate(ast, code);
            findings.push(...ruleFindings);
        }
        return findings;
    }
}
//# sourceMappingURL=code-guard.scanner.js.map