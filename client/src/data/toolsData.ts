import {
  ShieldAlert,
  FileSearch,
  Code2,
  Boxes,
  FileCode2,
  Sliders,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SecurityTool {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
  track: string[];

  // Primary tool identity
  accentColor: string;

  // Badge
  badgeBg: string;
  badgeBorder: string;

  // Card styling
  cardBg: string;
  cardBorder: string;
  glowColor: string;
}

export class ToolsConfig {
  public static readonly list: SecurityTool[] = [
    // {
    //   id: "permission-doctor",
    //   title: "Permission Doctor",
    //   category: "MANIFEST",
    //   description:
    //     "Detect capability mismatches in app manifests, OAuth lists, and extension permissions.",
    //   icon: ShieldAlert,
    //   track: ["OWASP Cybersecurity"],
    //   accentColor: "#5EDDE8",
    //   badgeBg: "rgba(94, 221, 232, 0.09)",
    //   badgeBorder: "rgba(94, 221, 232, 0.24)",
    //   cardBg: "rgba(35, 54, 61, 0.42)",
    //   cardBorder: "rgba(94, 221, 232, 0.16)",
    //   glowColor: "rgba(94, 221, 232, 0.10)",
    // },
    {
      id: "prompt-injection-firewall",
      title: "Prompt Injection Firewall",
      category: "AI SECURITY",
      description:
        "Detect malicious instructions hidden in external content before they reach AI models and agents.",
      icon: ShieldAlert,
      track: ["OWASP Cybersecurity", "Google Gemma"],
      accentColor: "#5EDDE8",
      badgeBg: "rgba(94, 221, 232, 0.09)",
      badgeBorder: "rgba(94, 221, 232, 0.24)",
      cardBg: "rgba(35, 54, 61, 0.42)",
      cardBorder: "rgba(94, 221, 232, 0.16)",
      glowColor: "rgba(94, 221, 232, 0.10)",
    },
    {
      id: "privacy-leak-detective",
      title: "Privacy Leak Detective",
      category: "PII & SECRETS",
      description:
        "Scan documents, logs, and code for exposed credentials with contextual auto-redaction.",
      icon: FileSearch,
      track: ["OWASP Cybersecurity"],
      accentColor: "#F0784F",
      badgeBg: "rgba(240, 120, 79, 0.09)",
      badgeBorder: "rgba(240, 120, 79, 0.24)",
      cardBg: "rgba(58, 42, 38, 0.42)",
      cardBorder: "rgba(240, 120, 79, 0.16)",
      glowColor: "rgba(240, 120, 79, 0.10)",
    },

    {
      id: "code-guard",
      title: "Code Guard",
      category: "AST + GEMMA AI",
      description:
        "Catch dangerous sinks, injection vulnerabilities, and construct execution attack paths.",
      icon: Code2,
      track: ["Google Gemma", "OWASP Cybersecurity"],
      accentColor: "#62D7AE",
      badgeBg: "rgba(98, 215, 174, 0.09)",
      badgeBorder: "rgba(98, 215, 174, 0.24)",
      cardBg: "rgba(34, 57, 49, 0.42)",
      cardBorder: "rgba(98, 215, 174, 0.16)",
      glowColor: "rgba(98, 215, 174, 0.10)",
    },

    {
      id: "dependency-autopsy",
      title: "Dependency Autopsy",
      category: "SUPPLY CHAIN",
      description:
        "Inspect package lockfiles, resolve transitive risk chains, and assess removal impact.",
      icon: Boxes,
      track: ["OWASP Cybersecurity"],
      accentColor: "#E8C66A",
      badgeBg: "rgba(232, 198, 106, 0.09)",
      badgeBorder: "rgba(232, 198, 106, 0.24)",
      cardBg: "rgba(57, 52, 38, 0.42)",
      cardBorder: "rgba(232, 198, 106, 0.16)",
      glowColor: "rgba(232, 198, 106, 0.09)",
    },

    {
      id: "log-investigator",
      title: "Security Log Investigator",
      category: "FORENSICS",
      description:
        "Parse access logs to construct attack timelines and query raw incidents in plain English.",
      icon: FileCode2,
      track: ["OWASP Cybersecurity"],
      accentColor: "#A99AEF",
      badgeBg: "rgba(169, 154, 239, 0.09)",
      badgeBorder: "rgba(169, 154, 239, 0.24)",
      cardBg: "rgba(48, 43, 62, 0.42)",
      cardBorder: "rgba(169, 154, 239, 0.16)",
      glowColor: "rgba(169, 154, 239, 0.10)",
    },

    {
      id: "config-fixer",
      title: "Fix My Security Config",
      category: "INFRA REPAIR",
      description:
        "Spot misconfigurations in Nginx, Docker, and .env files and generate secured diffs.",
      icon: Sliders,
      track: ["OWASP Cybersecurity", "Google Gemma"],
      accentColor: "#6B9FE8",
      badgeBg: "rgba(107, 159, 232, 0.09)",
      badgeBorder: "rgba(107, 159, 232, 0.24)",
      cardBg: "rgba(38, 48, 63, 0.42)",
      cardBorder: "rgba(107, 159, 232, 0.16)",
      glowColor: "rgba(107, 159, 232, 0.10)",
    },
  ];
}
