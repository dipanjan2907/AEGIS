import traversePkg from "@babel/traverse";
import type { File, AssignmentExpression, JSXAttribute } from "@babel/types";
import type { ISecurityRule } from "../interfaces/rule.interface.js";
import type { SecurityFinding } from "../../../types/finding.types.js";

const traverse =
  typeof traversePkg === "function"
    ? traversePkg
    : (traversePkg as { default: typeof traversePkg }).default;

export class XssRule implements ISecurityRule {
  public readonly id = "XSS";
  public readonly name = "Cross-Site Scripting (XSS) Detection";

  public evaluate(ast: File, rawCode: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];
    const codeLines = rawCode.split("\n");

    traverse(ast, {
      AssignmentExpression: (path) => {
        const node = path.node as AssignmentExpression;
        if (
          node.left.type === "MemberExpression" &&
          node.left.property.type === "Identifier" &&
          node.left.property.name === "innerHTML"
        ) {
          const line = node.loc?.start.line ?? 1;
          const column = node.loc?.start.column ?? 0;
          const evidence = codeLines[line - 1]?.trim() ?? rawCode.slice(0, 80);

          findings.push({
            id: `xss-innerHTML-${line}-${column}`,
            type: "XSS",
            severity: "HIGH",
            confidence: 0.9,
            title: "Unsafe DOM Assignment to innerHTML",
            description:
              "Assigning non-sanitized content to innerHTML can lead to DOM-based Cross-Site Scripting.",
            location: { line, column },
            evidence,
          });
        }
      },
      JSXAttribute: (path) => {
        const node = path.node as JSXAttribute;
        if (node.name.name === "dangerouslySetInnerHTML") {
          const line = node.loc?.start.line ?? 1;
          const column = node.loc?.start.column ?? 0;
          const evidence = codeLines[line - 1]?.trim() ?? rawCode.slice(0, 80);

          findings.push({
            id: `xss-jsx-${line}-${column}`,
            type: "XSS",
            severity: "HIGH",
            confidence: 0.95,
            title: "Use of dangerouslySetInnerHTML in JSX",
            description:
              "dangerouslySetInnerHTML bypasses React sanitization defenses and introduces severe XSS risk.",
            location: { line, column },
            evidence,
          });
        }
      },
    });

    return findings;
  }
}
