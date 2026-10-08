import type { DependencyPreset } from "../types/dependency-autopsy.types";

export const DEPENDENCY_PRESETS: DependencyPreset[] = [
  {
    id: "compromised-npm-lock",
    name: "Compromised npm lockfile",
    description: "Nested lodash prototype pollution via api-client.",
    lockfileType: "package-lock.json",
    lockfileContent: JSON.stringify(
      {
        name: "aegis-demo",
        version: "1.0.0",
        lockfileVersion: 3,
        packages: {
          "": {
            name: "aegis-demo",
            version: "1.0.0",
            dependencies: { "api-client": "^2.0.0" },
          },
          "node_modules/api-client": {
            version: "2.1.0",
            dependencies: { lodash: "^4.17.0" },
          },
          "node_modules/lodash": { version: "4.17.20" },
        },
      },
      null,
      2,
    ),
  },
  {
    id: "vulnerable-yarn-lock",
    name: "Vulnerable Yarn lockfile",
    description: "An outdated node-fetch dependency nested under web-client.",
    lockfileType: "yarn.lock",
    lockfileContent: `# yarn lockfile v1

web-client@^1.0.0:
  version "1.0.0"
  dependencies:
    node-fetch "^2.6.0"

node-fetch@^2.6.0:
  version "2.6.6"
  dependencies:
    whatwg-url "^5.0.0"

whatwg-url@^5.0.0:
  version "5.0.0"
`,
  },
  {
    id: "malicious-pnpm-lock",
    name: "Event-stream compromise",
    description: "A pnpm dependency chain includes compromised event-stream.",
    lockfileType: "pnpm-lock.yaml",
    lockfileContent: `lockfileVersion: '9.0'
importers:
  .:
    dependencies:
      legacy-logger:
        specifier: ^1.0.0
        version: 1.0.2
packages:
  legacy-logger@1.0.2:
    resolution: {integrity: sha512-demo}
  event-stream@3.3.6:
    resolution: {integrity: sha512-demo}
snapshots:
  legacy-logger@1.0.2:
    dependencies:
      event-stream: 3.3.6
  event-stream@3.3.6: {}
`,
  },
];
