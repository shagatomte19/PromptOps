import React from 'react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { TerminalSquare, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OverviewView: React.FC = () => {
    const { prompts, activeEnvironment } = useWorkspace();
    const navigate = useNavigate();

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold mb-2">Welcome back, Engineer</h1>
                    <p className="text-gray-400">You are viewing the <span className="text-white font-medium capitalize">{activeEnvironment}</span> workspace.</p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard/editor')}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 rounded-lg font-medium hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    New Prompt
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-[#0F111A] border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TerminalSquare className="w-24 h-24 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-4">Recent Prompts</h3>
                    <div className="space-y-3 relative z-10">
                        {prompts.map((p) => (
                            <div key={p.id} onClick={() => navigate('/dashboard/editor')} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${p.status === 'prod' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="font-medium text-gray-200">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                                    <span>{p.version}</span>
                                    <span>{p.updatedAt}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0F111A] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
                        <p className="text-gray-400 text-sm mb-6">Common tasks for your workflow.</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {['Deploy to Production', 'Run Regression Test', 'View Audit Logs', 'Manage API Keys'].map((action) => (
                                <button key={action} className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors border border-transparent hover:border-white/5">
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5">
                        <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                            Read the documentation <ArrowRight className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}