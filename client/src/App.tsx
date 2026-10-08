import React, { useState } from "react";
import { LeftPanel } from "./components/LeftPanel";
import { RightPanel } from "./components/RightPanel";
import { CodeGuardWorkspace } from "./modules/code-guard/CodeGuardWorkspace";
import { PromptFirewallWorkspace } from "./modules/prompt-injection-firewall/PromptFirewallWorkspace";
import { ConfigFixerWorkspace } from "./modules/config-fixer/ConfigFixerWorkspace";
import { DependencyAutopsyWorkspace } from "./modules/dependency-autopsy/DependencyAutopsyWorkspace";
import { LogInvestigatorWorkspace } from "./modules/log-investigator/LogInvestigatorWorkspace";
import { ToolsConfig } from "./data/toolsData";
import { ArrowLeft } from "lucide-react";

export const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const selectedTool = ToolsConfig.list.find((t) => t.id === activeToolId);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-[#0d1117] text-[#e6edf3] overflow-hidden font-sans">
      <LeftPanel />

      {selectedTool ? (
        <main className="flex-1 h-full overflow-y-auto p-6 lg:p-8 bg-[#0d1117]">
          <div className="max-w-6xl mx-auto space-y-4">
            <button
              onClick={() => setActiveToolId(null)}
              className="flex items-center gap-2 text-xs font-mono hover:scale-103 active:scale-95 transition-all  p-2 bg-[#161b22] border border-[#212630] rounded-md cursor-pointer"
              style={{ color: selectedTool.accentColor }}
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
            </button>

            {/* Dynamic Module Routing */}
            {selectedTool.id === "code-guard" || selectedTool.id === "code-firewall" ? (
              <CodeGuardWorkspace />
            ) : selectedTool.id === "prompt-injection-firewall" ? (
              <PromptFirewallWorkspace />
            ) : selectedTool.id === "config-fixer" ? (
              <ConfigFixerWorkspace />
            ) : selectedTool.id === "dependency-autopsy" ? (
              <DependencyAutopsyWorkspace />
            ) : selectedTool.id === "log-investigator" ? (
              <LogInvestigatorWorkspace />
            ) : (
              <div className="p-6 bg-[#131720] border border-[#212630] rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <selectedTool.icon
                    className="w-8 h-8"
                    style={{ color: selectedTool.accentColor }}
                  />
                  <div>
                    <h2 className="text-xl font-bold font-mono text-[#e6edf3]">
                      {selectedTool.title}
                    </h2>
                    <span className="text-xs font-mono text-[#8b949e]">
                      Module ID: {selectedTool.id}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#8b949e]">{selectedTool.description}</p>
                <div className="p-12 border border-dashed border-[#303644] rounded text-center text-xs font-mono text-[#64748b]">
                  [{selectedTool.title.toUpperCase()} SCANNER WORKSPACE READY]
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        <RightPanel onSelectTool={(id) => setActiveToolId(id)} />
      )}
    </div>
  );
};

export default App;