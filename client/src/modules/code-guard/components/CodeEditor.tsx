import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  language: "javascript" | "typescript";
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
}) => {
  return (
    <div className="h-full w-full py-2 bg-[#0d1117]">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(val) => onChange(val || "")}
        options={{
          fontSize: 13,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};
