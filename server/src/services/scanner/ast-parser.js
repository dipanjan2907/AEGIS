import { parse } from "@babel/parser";
import { ScannerError } from "../../errors/scanner.error.js";
export class ASTParser {
    parseCode(code, language) {
        try {
            return parse(code, {
                sourceType: "module",
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true,
                plugins: [
                    "jsx",
                    ...(language === "typescript" ? ["typescript"] : []),
                ],
            });
        }
        catch (error) {
            const err = error;
            throw new ScannerError(`Failed to parse source code AST: ${err.message}`, {
                line: err.loc?.line ?? 1,
                column: err.loc?.column ?? 0,
            });
        }
    }
}
//# sourceMappingURL=ast-parser.js.map