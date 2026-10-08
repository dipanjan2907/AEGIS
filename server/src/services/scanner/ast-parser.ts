import { parse } from "@babel/parser";
import type { File } from "@babel/types";
import { ScannerError } from "../../errors/scanner.error.js";

export class ASTParser {
  public parseCode(code: string, language: "javascript" | "typescript"): File {
    try {
      return parse(code, {
        sourceType: "module",
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        plugins: [
          "jsx",
          ...(language === "typescript" ? (["typescript"] as const) : []),
        ],
      });
    } catch (error) {
      const err = error as Error & { loc?: { line: number; column: number } };
      throw new ScannerError(
        `Failed to parse source code AST: ${err.message}`,
        {
          line: err.loc?.line ?? 1,
          column: err.loc?.column ?? 0,
        },
      );
    }
  }
}
