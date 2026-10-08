import { ASTParser } from "./ast-parser.js";
import type { ISecurityRule } from "./interfaces/rule.interface.js";
import type { SecurityFinding } from "../../types/finding.types.js";
import { SqlInjectionRule } from "./rules/sql-injection.rule.js";
import { CommandInjectionRule } from "./rules/command-injection.rule.js";
import { XssRule } from "./rules/xss.rule.js";
import { HardcodedSecretsRule } from "./rules/hardcoded-secrets.rule.js";
import { DangerousEvalRule } from "./rules/dangerous-eval.rule.js";

export class CodeGuardScanner {
  private readonly parser: ASTParser;
  private readonly rules: ISecurityRule[];

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

  public scan(
    code: string,
    language: "javascript" | "typescript",
  ): SecurityFinding[] {
    const ast = this.parser.parseCode(code, language);
    const findings: SecurityFinding[] = [];

    for (const rule of this.rules) {
      const ruleFindings = rule.evaluate(ast, code);
      findings.push(...ruleFindings);
    }

    return findings;
  }
}
