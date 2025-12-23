import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity, Users, Clock, DollarSign } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';

const StatCard = ({ title, value, change, trend, icon: Icon }: any) => (
    <div className="bg-[#0F111A] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-400 bg-green-950/30' : 'text-red-400 bg-red-950/30'}`}>
                {change}
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-gray-500 font-medium">{title}</div>
    </div>
);

export const MonitorView: React.FC = () => {
    const { activeEnvironment } = useWorkspace();

    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">System Performance</h1>
                    <p className="text-gray-400 text-sm">Real-time metrics for {activeEnvironment} environment.</p>
                </div>
                <div className="flex gap-2">
                    {['1h', '24h', '7d', '30d'].map((range) => (
                        <button key={range} className={`px-3 py-1 text-xs rounded-md border ${range === '24h' ? 'bg-white/10 text-white border-white/20' : 'text-gray-500 border-transparent hover:bg-white/5'}`}>
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Requests" value="2.4M" change="+12.5%" trend="up" icon={Activity} />
                <StatCard title="Avg Latency (P95)" value="412ms" change="-5.2%" trend="up" icon={Clock} />
                <StatCard title="Error Rate" value="0.04%" change="+0.01%" trend="down" icon={Users} />
                <StatCard title="Est. Cost" value="$1,240" change="+8.1%" trend="down" icon={DollarSign} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-[#0F111A] border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-300 mb-6">Request Volume vs Latency</h3>
                    <div className="flex-1 flex items-end justify-between gap-1 px-2">
                        {[...Array(40)].map((_, i) => {
                            const h1 = Math.random() * 60 + 20;
                            const h2 = Math.random() * 40 + 10;
                            return (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h1}%` }}
                                        className="w-full bg-indigo-500/20 rounded-t-sm group-hover:bg-indigo-500/40 transition-colors"
                                    />
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h2}%` }}
                                        className="w-full bg-cyan-500/20 rounded-t-sm group-hover:bg-cyan-500/40 transition-colors"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Side Lists */}
                <div className="bg-[#0F111A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-gray-300 mb-4">Top Errors</h3>
                    <div className="space-y-3">
                        {[
                            { code: '429', msg: 'Rate limit exceeded', count: 142 },
                            { code: '500', msg: 'Context length exceeded', count: 89 },
                            { code: '400', msg: 'Bad request format', count: 34 },
                        ].map((err, i) => (
                            <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-white/5 rounded transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <span className="text-red-400 font-mono text-xs bg-red-950/30 px-1.5 py-0.5 rounded">{err.code}</span>
                                    <span className="text-gray-400">{err.msg}</span>
                                </div>
                                <span className="text-gray-500 font-mono text-xs">{err.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};