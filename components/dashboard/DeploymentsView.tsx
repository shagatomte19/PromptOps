import React from 'react';
import { GitCommit, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const DeploymentsView: React.FC = () => {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-white mb-6">Deployment History</h1>
            
            <div className="space-y-4">
                {[
                    { id: 'dep_1', msg: 'Update system prompt context for support agent', author: 'Sarah C.', time: '10m ago', status: 'live', version: 'v2.1.0' },
                    { id: 'dep_2', msg: 'Fix JSON formatting in SQL generator', author: 'Mike R.', time: '2h ago', status: 'live', version: 'v1.0.4' },
                    { id: 'dep_3', msg: 'Revert "Experimental temperature increase"', author: 'System', time: '1d ago', status: 'rollback', version: 'v2.0.9' },
                ].map((dep, i) => (
                    <div key={dep.id} className="bg-[#0F111A] border border-white/5 rounded-lg p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${dep.status === 'live' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                            {dep.status === 'live' ? <CheckCircle className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-200 truncate">{dep.msg}</span>
                                <span className="text-xs font-mono bg-white/5 px-1.5 py-0.5 rounded text-gray-400">{dep.version}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><GitCommit className="w-3 h-3" /> {dep.id.substring(0,6)}</span>
                                <span>by {dep.author}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {dep.time}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                             {dep.status === 'live' && (
                                 <div className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold border border-green-900/50">
                                     ACTIVE
                                 </div>
                             )}
                             <Button size="sm" variant="secondary" className="h-8 text-xs">
                                {dep.status === 'live' ? 'Rollback' : 'Redeploy'}
                             </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}