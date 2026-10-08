import type { File } from "@babel/types";
import type { SecurityFinding } from "../../../types/finding.types.js";

export interface ISecurityRule {
  readonly id: string;
  readonly name: string;
  evaluate(ast: File, rawCode: string): SecurityFinding[];
}
