import traversePkg from "@babel/traverse";
const traverse = typeof traversePkg === "function"
    ? traversePkg
    : traversePkg.default;
const SECRET_VARIABLE_REGEX = /(api[_-]?key|secret|token|password|auth|jwt|private[_-]?key)/i;
const SPECIFIC_SECRET_PATTERNS = [
    /sk_live_[0-9a-zA-Z]{24,}/,
    /AKIA[0-9A-Z]{16}/,
    /ghp_[0-9a-zA-Z]{36}/,
    /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/,
];
export class HardcodedSecretsRule {
    id = "HARDCODED_SECRETS";
    name = "Hardcoded Secrets Detection";
    evaluate(ast, rawCode) {
        const findings = [];
        const codeLines = rawCode.split("\n");
        traverse(ast, {
            VariableDeclarator: (path) => {
                const node = path.node;
                if (node.id.type === "Identifier" &&
                    node.init?.type === "StringLiteral") {
                    const varName = node.id.name;
                    const stringVal = node.init.value;
                    const isSecretVarName = SECRET_VARIABLE_REGEX.test(varName);
                    const isKnownSecretFormat = SPECIFIC_SECRET_PATTERNS.some((pattern) => pattern.test(stringVal));
                    if ((isSecretVarName && stringVal.length > 5) ||
                        isKnownSecretFormat) {
                        const line = node.loc?.start.line ?? 1;
                        const column = node.loc?.start.column ?? 0;
                        const evidence = codeLines[line - 1]?.trim() ?? rawCode.slice(0, 80);
                        findings.push({
                            id: `secret-${line}-${column}`,
                            type: "HARDCODED_SECRETS",
                            severity: "HIGH",
                            confidence: 0.91,
                            title: "Hardcoded Secret or API Key Exposed",
                            description: "Sensitive credential, API key, or authentication token hardcoded in source code.",
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
//# sourceMappingURL=hardcoded-secrets.rule.js.map