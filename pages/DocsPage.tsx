import React from 'react';
import { Book, Code, FileText, Terminal } from 'lucide-react';

export const DocsPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 flex flex-col md:flex-row gap-12">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 space-y-8">
        <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Getting Started</h4>
            <ul className="space-y-2 text-sm text-gray-400 border-l border-white/10">
                <li className="pl-4 border-l border-cyan-400 text-cyan-400 font-medium">Introduction</li>
                <li className="pl-4 hover:text-white cursor-pointer">Quickstart</li>
                <li className="pl-4 hover:text-white cursor-pointer">Installation</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Core Concepts</h4>
            <ul className="space-y-2 text-sm text-gray-400 border-l border-white/10">
                <li className="pl-4 hover:text-white cursor-pointer">Prompts</li>
                <li className="pl-4 hover:text-white cursor-pointer">Variables</li>
                <li className="pl-4 hover:text-white cursor-pointer">Environments</li>
            </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl">
        <h1 className="text-4xl font-display font-bold mb-6">Introduction to PromptOps</h1>
        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            PromptOps is a version control and deployment platform for Large Language Model (LLM) prompts. 
            It allows developers to decouple prompts from their codebase, enabling faster iteration and safer deployments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-colors cursor-pointer">
                <Terminal className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="font-bold mb-2">CLI Reference</h3>
                <p className="text-sm text-gray-400">Manage resources from your terminal.</p>
            </div>
            <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-colors cursor-pointer">
                <Code className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="font-bold mb-2">SDK Guide</h3>
                <p className="text-sm text-gray-400">Integrate with Node.js, Python, or Go.</p>
            </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <div className="bg-[#0A0B14] rounded-lg border border-white/10 p-4 font-mono text-sm mb-8 relative group">
            <span className="text-gray-500"># Install the CLI tool</span><br/>
            <span className="text-cyan-400">npm</span> install -g @promptops/cli
            <button className="absolute top-4 right-4 text-xs bg-white/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>
        </div>
      </div>
    </div>
  );
};