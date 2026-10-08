import { parse as parseYaml } from "yaml";
import { ValidationError } from "../../errors/validation.error.js";
import type {
  DependencyFinding,
  LockfileType,
} from "../../types/dependency-autopsy.types.js";

interface DependencyNode {
  id: string;
  name: string;
  version: string;
  dependencies: string[];
}

interface ParsedLockfile {
  nodes: DependencyNode[];
  roots: string[];
}

export interface DependencyScanResult {
  totalDependencies: number;
  findings: DependencyFinding[];
  transitiveGraph: Record<string, string[]>;
}

const VULNERABILITY_RULES = [
  {
    id: "lodash-prototype-pollution",
    packageName: "lodash",
    severity: "HIGH" as const,
    cveId: "CVE-2021-23337",
    fixedVersion: "4.17.21",
    summary: "Affected lodash versions can allow prototype pollution.",
    impactAssessment:
      "Update lodash to 4.17.21 or later. Removing it may break packages that rely on its utility functions; identify the parent dependency first.",
    vulnerable: (version: string) => compareVersions(version, "4.17.21") < 0,
  },
  {
    id: "node-fetch-command-injection",
    packageName: "node-fetch",
    severity: "HIGH" as const,
    cveId: "CVE-2022-0235",
    fixedVersion: (version: string) => (version.startsWith("3.") ? "3.1.1" : "2.6.7"),
    summary:
      "Affected node-fetch versions can forward attacker-controlled URLs across redirects.",
    impactAssessment:
      "Update node-fetch 2.x to 2.6.7 or later. For node-fetch 3.x, use 3.1.1 or later; check the transitive parent before removing it.",
    vulnerable: (version: string) =>
      (version.startsWith("2.") && compareVersions(version, "2.6.7") < 0) ||
      (version.startsWith("3.") && compareVersions(version, "3.1.1") < 0),
  },
  {
    id: "event-stream-backdoor",
    packageName: "event-stream",
    severity: "CRITICAL" as const,
    cveId: "MALICIOUS-PACKAGE-2018-EVENT-STREAM",
    fixedVersion: "3.3.5",
    summary:
      "event-stream 3.3.6 is associated with a malicious dependency chain involving flatmap-stream.",
    impactAssessment:
      "Remove or replace event-stream 3.3.6 and inspect the flatmap-stream dependency chain. Removing it may affect packages that consume its stream APIs.",
    vulnerable: (version: string) =>
      version === "3.3.6",
  },
  {
    id: "flatmap-stream-backdoor",
    packageName: "flatmap-stream",
    severity: "CRITICAL" as const,
    cveId: "MALICIOUS-PACKAGE-2018-FLATMAP-STREAM",
    fixedVersion: "REMOVE",
    summary:
      "flatmap-stream 0.1.1 is associated with the event-stream supply-chain compromise.",
    impactAssessment:
      "Remove flatmap-stream 0.1.1 and update or remove its parent dependency. Validate application behavior after the parent package changes.",
    vulnerable: (version: string) => version === "0.1.1",
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const compareVersions = (left: string, right: string): number => {
  const leftMatch = left.match(/^(\d+)\.(\d+)\.(\d+)(?:-([^+]+))?/);
  const rightMatch = right.match(/^(\d+)\.(\d+)\.(\d+)(?:-([^+]+))?/);
  const leftParts = leftMatch
    ? leftMatch.slice(1, 4).map(Number)
    : left.split(/[.+-]/).map((part) => Number(part) || 0);
  const rightParts = rightMatch
    ? rightMatch.slice(1, 4).map(Number)
    : right.split(/[.+-]/).map((part) => Number(part) || 0);

  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return difference;
  }
  if (leftMatch?.[4] && !rightMatch?.[4]) return -1;
  if (!leftMatch?.[4] && rightMatch?.[4]) return 1;
  return 0;
};

const packageNameFromPath = (path: string): string =>
  path
    .split("/")
    .filter(Boolean)
    .slice(-2)
    .join("/")
    .replace(/^node_modules\//, "");

const readDependencyNames = (value: unknown): string[] =>
  isRecord(value) ? Object.keys(value) : [];

const parseNpmLockfile = (content: string): ParsedLockfile => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new ValidationError("package-lock.json is not valid JSON", {
      reason: (error as Error).message,
    });
  }

  if (!isRecord(parsed)) {
    throw new ValidationError("package-lock.json must contain a JSON object");
  }

  const nodes: DependencyNode[] = [];
  const roots = new Set<string>();
  const packages = parsed.packages;

  if (isRecord(packages)) {
    const rootPackage = packages[""];
    if (isRecord(rootPackage)) {
      for (const field of ["dependencies", "devDependencies", "optionalDependencies"]) {
        for (const name of readDependencyNames(rootPackage[field])) roots.add(name);
      }
    }

    for (const [path, value] of Object.entries(packages)) {
      if (!path || !isRecord(value) || typeof value.version !== "string") continue;
      const name =
        typeof value.name === "string" ? value.name : packageNameFromPath(path);
      nodes.push({
        id: path,
        name,
        version: value.version,
        dependencies: [
          ...readDependencyNames(value.dependencies),
          ...readDependencyNames(value.optionalDependencies),
        ],
      });
    }
  } else if (isRecord(parsed.dependencies)) {
    const visit = (dependencies: unknown, parentName?: string): void => {
      if (!isRecord(dependencies)) return;
      for (const [name, value] of Object.entries(dependencies)) {
        if (!isRecord(value) || typeof value.version !== "string") continue;
        if (!parentName) roots.add(name);
        const id = `${name}@${value.version}:${nodes.length}`;
        nodes.push({
          id,
          name,
          version: value.version,
          dependencies: [
            ...readDependencyNames(value.requires),
            ...readDependencyNames(value.dependencies),
          ],
        });
        visit(value.dependencies, name);
      }
    };
    visit(parsed.dependencies);
  } else {
    throw new ValidationError("package-lock.json has no packages or dependencies map");
  }

  return { nodes, roots: [...roots] };
};

const parseYarnV1Lockfile = (content: string): ParsedLockfile => {
  const nodes: DependencyNode[] = [];
  const records = content.split(/\r?\n/);
  let selectors: string[] = [];
  let version = "";
  let dependencies: string[] = [];

  const flush = (): void => {
    if (!version) return;
    for (const selector of selectors) {
      const key = selector.replace(/^["']|["']$/g, "");
      const delimiter = key.lastIndexOf("@");
      if (delimiter <= 0) continue;
      const name = key.slice(0, delimiter);
      nodes.push({
        id: `${name}@${version}`,
        name,
        version,
        dependencies: [...dependencies],
      });
    }
  };

  for (const line of records) {
    if (line && !/^\s/.test(line) && line.endsWith(":")) {
      flush();
      selectors = line.slice(0, -1).split(/,\s*/);
      version = "";
      dependencies = [];
      continue;
    }
    const versionMatch = line.match(/^\s{2}version\s+["']?([^"'\s]+)["']?/);
    if (versionMatch?.[1]) {
      version = versionMatch[1];
      continue;
    }
    if (/^\s{2}dependencies:\s*$/.test(line)) continue;
    const dependencyMatch = line.match(/^\s{4}(@?[^"' ]+(?:\/[^"' ]+)?)\s+["'][^"']+["']/);
    if (dependencyMatch?.[1]) dependencies.push(dependencyMatch[1]);
  }
  flush();

  if (nodes.length === 0) {
    throw new ValidationError("yarn.lock did not contain any parseable package entries");
  }
  return { nodes, roots: [] };
};

const parseYarnLockfile = (content: string): ParsedLockfile => {
  if (/^__metadata:\s*$/m.test(content)) {
    return parseYamlLockfile(content, "yarn.lock");
  }
  return parseYarnV1Lockfile(content);
};

const packageNameFromPnpmKey = (key: string): { name: string; version: string } | null => {
  const normalized = key.replace(/^\/+/, "");
  const delimiter =
    normalized.startsWith("@")
      ? normalized.indexOf("@", normalized.indexOf("/") + 1)
      : normalized.indexOf("@");
  if (delimiter <= 0) return null;
  const name = normalized.slice(0, delimiter);
  const version = normalized.slice(delimiter + 1).split("(")[0];
  return version ? { name, version } : null;
};

const parseYamlLockfile = (
  content: string,
  lockfileType: "yarn.lock" | "pnpm-lock.yaml",
): ParsedLockfile => {
  let parsed: unknown;
  try {
    parsed = parseYaml(content);
  } catch (error) {
    throw new ValidationError(`${lockfileType} is not valid YAML`, {
      reason: (error as Error).message,
    });
  }
  if (!isRecord(parsed)) {
    throw new ValidationError(`${lockfileType} must contain a YAML object`);
  }

  const nodes: DependencyNode[] = [];
  const roots = new Set<string>();
  const packages = parsed.packages;
  const snapshots = parsed.snapshots;

  if (lockfileType === "pnpm-lock.yaml") {
    const importers = parsed.importers;
    if (isRecord(importers)) {
      for (const importer of Object.values(importers)) {
        if (!isRecord(importer)) continue;
        for (const section of ["dependencies", "devDependencies", "optionalDependencies"]) {
          for (const name of readDependencyNames(importer[section])) roots.add(name);
        }
      }
    }

    if (!isRecord(packages)) {
      throw new ValidationError("pnpm-lock.yaml has no packages map");
    }
    const snapshotMap = isRecord(snapshots) ? snapshots : {};
    for (const [key, value] of Object.entries(packages)) {
      if (!isRecord(value)) continue;
      const identity = packageNameFromPnpmKey(key);
      if (!identity) continue;
      const snapshotKey = key.replace(/^\/+/, "");
      const snapshot = snapshotMap[snapshotKey];
      const dependencyMap = isRecord(snapshot) ? snapshot.dependencies : value.dependencies;
      nodes.push({
        id: key,
        name: identity.name,
        version:
          typeof value.version === "string"
            ? value.version
            : identity.version,
        dependencies: readDependencyNames(dependencyMap),
      });
    }
  } else {
    const yarnPackages = isRecord(packages)
      ? Object.entries(packages)
      : Object.entries(parsed).filter(([key]) => key !== "__metadata");
    if (yarnPackages.length === 0) {
      throw new ValidationError("yarn.lock has no package entries");
    }
    for (const [key, value] of yarnPackages) {
      if (!isRecord(value) || typeof value.version !== "string") continue;
      const name =
        key.replace(/^["']|["']$/g, "").split("@npm:")[0] ?? "";
      if (!name) continue;
      nodes.push({
        id: `${name}@${value.version}`,
        name,
        version: value.version,
        dependencies: readDependencyNames(value.dependencies),
      });
    }
  }

  return { nodes, roots: [...roots] };
};

const createTransitiveGraph = (
  nodes: DependencyNode[],
  roots: string[],
): Record<string, string[]> => {
  const graph: Record<string, Set<string>> = {};
  for (const name of roots) {
    graph.root ??= new Set<string>();
    graph.root.add(name);
  }
  for (const node of nodes) {
    graph[node.name] ??= new Set<string>();
    for (const dependency of node.dependencies) {
      graph[node.name]?.add(dependency);
    }
  }
  return Object.fromEntries(
    Object.entries(graph).map(([name, children]) => [
      name,
      [...children].sort(),
    ]),
  );
};

const findDependencyChain = (
  target: DependencyNode,
  nodes: DependencyNode[],
  roots: string[],
): string[] => {
  const incoming = new Map<string, string[]>();
  const nodesByName = new Map<string, DependencyNode[]>();
  for (const node of nodes) {
    const matchingNodes = nodesByName.get(node.name);
    if (matchingNodes) matchingNodes.push(node);
    else nodesByName.set(node.name, [node]);
  }
  for (const node of nodes) {
    for (const dependency of node.dependencies) {
      const candidates = nodesByName.get(dependency) ?? [];
      for (const candidate of candidates) {
        incoming.set(candidate.id, [...(incoming.get(candidate.id) ?? []), node.id]);
      }
    }
  }

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const queue: Array<{ node: DependencyNode; path: string[] }> = [
    { node: target, path: [target.name] },
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.node.id)) continue;
    visited.add(current.node.id);
    if (roots.includes(current.node.name)) return current.path.reverse();

    for (const parentId of incoming.get(current.node.id) ?? []) {
      const parent = byId.get(parentId);
      if (parent) queue.push({ node: parent, path: [...current.path, parent.name] });
    }
  }
  return [target.name];
};

const inferRootPackages = (nodes: DependencyNode[]): string[] => {
  const referencedNames = new Set(nodes.flatMap((node) => node.dependencies));
  return [
    ...new Set(
      nodes
        .filter((node) => !referencedNames.has(node.name))
        .map((node) => node.name),
    ),
  ];
};

export class DependencyGuardScanner {
  public scan(content: string, lockfileType: LockfileType): DependencyScanResult {
    const parsed =
      lockfileType === "package-lock.json"
        ? parseNpmLockfile(content)
        : lockfileType === "yarn.lock"
          ? parseYarnLockfile(content)
          : parseYamlLockfile(content, "pnpm-lock.yaml");

    const roots =
      parsed.roots.length > 0 ? parsed.roots : inferRootPackages(parsed.nodes);

    const findings: DependencyFinding[] = [];
    const seen = new Set<string>();
    for (const node of parsed.nodes) {
      for (const rule of VULNERABILITY_RULES) {
        if (node.name !== rule.packageName || !rule.vulnerable(node.version)) continue;
        const findingKey = `${rule.id}:${node.name}:${node.version}`;
        if (seen.has(findingKey)) continue;
        seen.add(findingKey);
        findings.push({
          id: findingKey,
          packageName: node.name,
          currentVersion: node.version,
          fixedVersion:
            typeof rule.fixedVersion === "function"
              ? rule.fixedVersion(node.version)
              : rule.fixedVersion,
          cveId: rule.cveId,
          severity: rule.severity,
          transitiveChain: findDependencyChain(node, parsed.nodes, roots),
          impactAssessment: rule.impactAssessment,
          summary: rule.summary,
        });
      }
    }

    return {
      totalDependencies: parsed.nodes.length,
      findings,
      transitiveGraph: createTransitiveGraph(parsed.nodes, roots),
    };
  }
}
