import traversePkg from "@babel/traverse";
const traverse = typeof traversePkg === "function"
    ? traversePkg
    : traversePkg.default;
const DANGEROUS_EXEC_FUNCTIONS = new Set([
    "exec",
    "execSync",
    "spawn",
    "spawnSync",
    "execFile",
]);
export class CommandInjectionRule {
    id = "COMMAND_INJECTION";
    name = "Command Injection Detection";
    evaluate(ast, rawCode) {
        const findings = [];
        const codeLines = rawCode.split("\n");
        traverse(ast, {
            CallExpression: (path) => {
                const node = path.node;
                let functionName = "";
                if (node.callee.type === "Identifier") {
                    functionName = node.callee.name;
                }
                else if (node.callee.type === "MemberExpression" &&
                    node.callee.property.type === "Identifier") {
                    functionName = node.callee.property.name;
                }
                if (DANGEROUS_EXEC_FUNCTIONS.has(functionName) &&
                    node.arguments.length > 0) {
                    const firstArg = node.arguments[0];
                    const isConcatenated = firstArg?.type === "BinaryExpression" ||
                        firstArg?.type === "TemplateLiteral";
                    const isDynamicVariable = firstArg?.type === "Identifier" ||
                        firstArg?.type === "MemberExpression";
                    if (isConcatenated || isDynamicVariable) {
                        const line = node.loc?.start.line ?? 1;
                        const column = node.loc?.start.column ?? 0;
                        const evidence = codeLines[line - 1]?.trim() ?? rawCode.slice(0, 80);
                        findings.push({
                            id: `cmd-inj-${line}-${column}`,
                            type: "COMMAND_INJECTION",
                            severity: "CRITICAL",
                            confidence: 0.95,
                            title: "Potential OS Command Injection",
                            description: "Dynamic execution function called with non-literal or concatenated command strings.",
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
//# sourceMappingURL=command-injection.rule.js.map