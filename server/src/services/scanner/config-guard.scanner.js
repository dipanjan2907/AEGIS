const NGINX_RULES = [
    {
        id: "NGINX_AUTOINDEX_ON",
        title: "Directory Listing Enabled (autoindex on)",
        severity: "HIGH",
        pattern: /autoindex\s+on\s*;/i,
        description: "Enabling autoindex exposes directory contents to public view.",
        recommendation: "Set 'autoindex off;' in your Nginx server or location block.",
    },
    {
        id: "NGINX_MISSING_SSL_PROTOCOLS",
        title: "Weak or Missing SSL/TLS Protocols",
        severity: "CRITICAL",
        pattern: /ssl_protocols\s+.*?(SSLv2|SSLv3|TLSv1|TLSv1\.1)/i,
        description: "Using outdated TLS versions leaves connections vulnerable to POODLE/BEAST attacks.",
        recommendation: "Use 'ssl_protocols TLSv1.2 TLSv1.3;' only.",
    },
    {
        id: "NGINX_SERVER_TOKENS_ON",
        title: "Server Version Information Disclosure",
        severity: "LOW",
        pattern: /server_tokens\s+on\s*;/i,
        description: "Broadcasting exact Nginx version strings simplifies targeted vulnerability research.",
        recommendation: "Add 'server_tokens off;' to hide Nginx version information.",
    },
];
const DOCKERFILE_RULES = [
    {
        id: "DOCKER_ROOT_USER",
        title: "Container Running as Root User",
        severity: "HIGH",
        pattern: /^USER\s+root\b/im,
        description: "Running processes as root increases the risk of container escape attacks.",
        recommendation: "Create and switch to an unprivileged user (e.g., USER node or USER appuser).",
    },
    {
        id: "DOCKER_LATEST_TAG",
        title: "Mutable ':latest' Image Tag",
        severity: "MEDIUM",
        pattern: /^FROM\s+[\w\/-]+:latest\b/im,
        description: "Using :latest makes builds non-reproducible and risks pulling untested breaking changes.",
        recommendation: "Pin explicit base image digest or version tag (e.g., node:20-alpine).",
    },
    {
        id: "DOCKER_SENSITIVE_ADD",
        title: "Potentially Dangerous ADD Instruction",
        severity: "LOW",
        pattern: /^ADD\s+https?:\/\//im,
        description: "Fetching remote URLs via ADD can allow untrusted binary downloads during build.",
        recommendation: "Use COPY or explicit curl/wget verifying checksums.",
    },
];
const ENV_RULES = [
    {
        id: "ENV_EXPOSED_SECRET_KEY",
        title: "Hardcoded High-Entropy Secret Key",
        severity: "CRITICAL",
        pattern: /(?:SECRET|PRIVATE|API_KEY|PASSWORD|TOKEN|JWT)\s*=\s*['"]?[a-zA-Z0-9_\-\.]{16,}['"]?/i,
        description: "Directly storing plaintext secrets in version-controlled env files causes leaks.",
        recommendation: "Inject secrets using dynamic secret vaults or store references securely.",
    },
    {
        id: "ENV_DEBUG_ENABLED",
        title: "Production Debug Mode Enabled",
        severity: "HIGH",
        pattern: /(?:DEBUG|NODE_ENV)\s*=\s*['"]?(?:true|1|development)['"]?/i,
        description: "Running with DEBUG=true in production leaks verbose stack traces and system variables.",
        recommendation: "Set NODE_ENV=production and disable verbose debug flags.",
    },
];
export class ConfigGuardScanner {
    scan(configText, configType) {
        const findings = [];
        const lines = configText.split("\n");
        const rules = configType === "nginx"
            ? NGINX_RULES
            : configType === "dockerfile"
                ? DOCKERFILE_RULES
                : ENV_RULES;
        for (const rule of rules) {
            lines.forEach((lineText, index) => {
                if (rule.pattern.test(lineText)) {
                    findings.push({
                        id: `${rule.id.toLowerCase()}-${index + 1}`,
                        ruleId: rule.id,
                        severity: rule.severity,
                        title: rule.title,
                        description: rule.description,
                        lineNumber: index + 1,
                        evidence: lineText.trim(),
                        recommendation: rule.recommendation,
                    });
                }
            });
        }
        return findings;
    }
}
//# sourceMappingURL=config-guard.scanner.js.map