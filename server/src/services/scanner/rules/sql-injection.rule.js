import traversePkg from "@babel/traverse";
// Handle Babel ESM import compatibility
const traverse = typeof traversePkg === "function"
    ? traversePkg
    : traversePkg.default;
const SQL_KEYWORDS_REGEX = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|WHERE|FROM|INTO)\b/i;
export class SqlInjectionRule {
    id = "SQL_INJECTION";
    name = "SQL Injection Detection";
    evaluate(ast, rawCode) {
        const findings = [];
        const codeLines = rawCode.split("\n");
        traverse(ast, {
            BinaryExpression: (path) => {
                const node = path.node;
                if (node.operator === "+") {
                    const isLeftLiteralWithSql = node.left.type === "StringLiteral" &&
                        SQL_KEYWORDS_REGEX.test(node.left.value);
                    const isRightLiteralWithSql = node.right.type === "StringLiteral" &&
                        SQL_KEYWORDS_REGEX.test(node.right.value);
                    const isLeftIdentifier = node.left.type === "Identifier" ||
                        node.left.type === "MemberExpression";
                    const isRightIdentifier = node.right.type === "Identifier" ||
                        node.right.type === "MemberExpression";
                    if ((isLeftLiteralWithSql && isRightIdentifier) ||
                        (isRightLiteralWithSql && isLeftIdentifier)) {
                        const line = node.loc?.start.line ?? 1;
                        const column = node.loc?.start.column ?? 0;
                        const evidence = codeLines[line - 1]?.trim() ?? rawCode.slice(0, 80);
                        findings.push({
                            id: `sqli-${line}-${column}`,
                            type: "SQL_INJECTION",
                            severity: "CRITICAL",
                            confidence: 0.92,
                            title: "Potential SQL Injection via String Concatenation",
                            description: "User-controlled dynamic variables appear to be directly concatenated into a SQL query string.",
                            location: { line, column },
                            evidence,
                        });
                    }
                }
            },
            TemplateLiteral: (path) => {
                const node = path.node;
                if (node.expressions.length > 0) {
                    const rawTemplateText = node.quasis.map((q) => q.value.raw).join("");
                    if (SQL_KEYWORDS_REGEX.test(rawTemplateText)) {
                        const line = node.loc?.start.line ?? 1;
                        const column = node.loc?.start.column ?? 0;
                        const evidence = codeLines[line - 1]?.trim() ?? rawCode.slice(0, 80);
                        findings.push({
                            id: `sqli-template-${line}-${column}`,
                            type: "SQL_INJECTION",
                            severity: "CRITICAL",
                            confidence: 0.88,
                            title: "Potential SQL Injection via Template Interpolation",
                            description: "Expressions are interpolated inside a template literal containing SQL keyword queries.",
                            location: { line, column },
                            evidence,
                        });
                    }
                }
            },
        });
        return findings;
    }
}
//# sourceMappingURL=sql-injection.rule.js.map