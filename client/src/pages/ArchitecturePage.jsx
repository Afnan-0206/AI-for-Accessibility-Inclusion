import React, { useState } from 'react';
import { ExternalLink, Layers, GitFork, Cpu, Shield, Database, Sparkles, Code2 } from 'lucide-react';

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState('interactive');

  const mermaidSource = `flowchart TD

subgraph group_client["Client experience"]
  node_app["App and routes<br/>[App.jsx]"]
  node_dashboard["Document dashboard<br/>[DashboardPage.jsx]"]
  node_result["Analysis and Q&A"]
  node_history["Document history<br/>[HistoryPage.jsx]"]
  node_accessibility["Accessibility controls"]
  node_voice["Voice input<br/>[useVoiceInput.js]"]
  node_readaloud["Read aloud"]
  node_api["API client<br/>[client.js]"]
end

subgraph group_identity["Identity"]
  node_authui["Auth state<br/>[AuthContext.jsx]"]
  node_authpages["Sign-in pages<br/>[LoginPage.jsx]"]
  node_register["Registration page<br/>[RegisterPage.jsx]"]
  node_authroutes["Auth routes<br/>[authRoutes.js]"]
  node_authmiddleware["Token authentication<br/>[auth.js]"]
  node_jwt["JWT utilities<br/>[jwt.js]"]
end

subgraph group_document["Document services"]
  node_backend["HTTP API server<br/>[index.js]"]
  node_docroutes["Document routes<br/>[documentRoutes.js]"]
  node_upload["File upload<br/>[upload.js]"]
  node_docservice["Document operations<br/>[documentService.js]"]
end

subgraph group_ai["AI analysis"]
  node_analysis["AI analysis service<br/>[aiService.js]"]
  node_prompt["AI prompts<br/>[documentPrompt.js]"]
  node_schema["Analysis schema<br/>[aiSchema.js]"]
  node_aierrors["AI parse errors<br/>[aiErrors.js]"]
end

subgraph group_persistence["Persistence"]
  node_users["User records<br/>[User.js]"]
  node_documents["Document records<br/>[Document.js]"]
  node_supabase[("Supabase database<br/>[db.js]")]
end

node_person(("Document user"))
node_gemini["Google Gemini"]

node_person -->|"uses"| node_app
node_app -->|"routes"| node_authpages
node_app -->|"routes"| node_register
node_app -->|"protects route"| node_dashboard
node_app -->|"protects route"| node_result
node_app -->|"protects route"| node_history
node_app -->|"provides state"| node_authui
node_app -->|"provides controls"| node_accessibility
node_authpages -->|"uses"| node_authui
node_register -->|"uses"| node_authui
node_authui -->|"calls auth"| node_api
node_dashboard -->|"requests documents"| node_api
node_history -->|"loads history"| node_api
node_result -->|"loads and asks"| node_api
node_result -->|"uses input"| node_voice
node_result -->|"renders summary"| node_readaloud
node_api -->|"sends API requests"| node_backend
node_backend -->|"mounts auth"| node_authroutes
node_backend -->|"mounts documents"| node_docroutes
node_authroutes -->|"reads and writes"| node_users
node_authroutes -->|"issues tokens"| node_jwt
node_authroutes -->|"protects profile"| node_authmiddleware
node_authmiddleware -->|"verifies tokens"| node_jwt
node_docroutes -->|"authenticates"| node_authmiddleware
node_docroutes -->|"accepts file"| node_upload
node_docroutes -->|"calls operations"| node_docservice
node_docservice -->|"analyzes and answers"| node_analysis
node_docservice -->|"stores and retrieves"| node_documents
node_analysis -->|"generates content"| node_gemini
node_analysis -->|"gets instructions"| node_prompt
node_analysis -->|"validates output"| node_schema
node_analysis -->|"reports parse failure"| node_aierrors
node_users -->|"uses database"| node_supabase
node_documents -->|"uses database"| node_supabase`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Archify Interactive Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Samajh Architecture & Data Flow Map
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              End-to-end trace from Citizen Client interaction through Express backend, Gemini AI vision parsing, and Supabase persistence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('interactive')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'interactive'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Interactive Map
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mermaid')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'mermaid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Mermaid Flow
              </button>
            </div>

            <a
              href="/architecture.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'interactive' ? (
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl relative min-h-[680px]">
            <iframe
              src="/architecture.html"
              title="Samajh Archify Interactive Architecture"
              className="w-full h-full absolute inset-0 border-0"
            />
          </div>
        ) : (
          <div className="flex-1 w-full rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-2xl overflow-auto font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                Raw Mermaid Architecture Definition
              </span>
              <a
                href="https://gitdiagram.com/afnan-0206/ai-for-accessibility-inclusion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View on GitDiagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <pre className="whitespace-pre overflow-x-auto leading-relaxed">{mermaidSource}</pre>
          </div>
        )}

        {/* Architectural Layers Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1">
              <Layers className="w-4 h-4" />
              <span>Client Experience</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              React 18 + Vite SPA, WCAG AAA accessibility engine (dyslexia font, scaling, high contrast), voice input and speech synthesis.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
              <Shield className="w-4 h-4" />
              <span>Identity & Security</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              JWT bearer token authentication, bcrypt password hashing, role-based route guard and owner-isolated document isolation.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
              <Cpu className="w-4 h-4" />
              <span>AI Analysis Engine</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini 1.5 Flash multimodal vision OCR, strict JSON schema validation with fallback parsing and 5th-grade simplification.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
              <Database className="w-4 h-4" />
              <span>Persistence & Storage</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supabase PostgreSQL database storing document metadata, analyses, and history with zero persistent disk file storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
