import traversePkg from "@babel/traverse";
const traverse = typeof traversePkg === "function"
    ? traversePkg
    : traversePkg.default;
export class DangerousEvalRule {
    id = "DANGEROUS_EVAL";
    name = "Dangerous Code Execution Detection";
    evaluate(ast, rawCode) {
        const findings = [];
        const codeLines = rawCode.split("\n");
        traverse(ast, {
            CallExpression: (path) => {
                const node = path.node;
                const isEvalCall = node.callee.type === "Identifier" && node.callee.name === "eval";
                const isFunctionConstructor = node.callee.type === "Identifier" && node.callee.name === "Function";
                if (isEvalCall || isFunctionConstructor) {
                    const line = node.loc?.start.line ?? 1;
                    const column = node.loc?.start.column ?? 0;
                    const evidence = codeLines[line - 1]?.trim() ?? rawCode.slice(0, 80);
                    findings.push({
                        id: `eval-${line}-${column}`,
                        type: "DANGEROUS_EVAL",
                        severity: "CRITICAL",
                        confidence: 0.98,
                        title: "Dangerous Dynamic Code Execution",
                        description: "Dynamic code execution constructs (`eval()` or `Function()`) execute untrusted strings as code.",
                        location: { line, column },
                        evidence,
                    });
                }
            },
        });
        return findings;
    }
}
//# sourceMappingURL=dangerous-eval.rule.js.map