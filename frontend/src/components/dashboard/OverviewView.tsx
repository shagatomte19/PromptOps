import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    GitBranch,
    Activity,
    TrendingUp,
    Clock,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    Plus
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loading';
import { usePrompts, useLogs } from '@/stores/workspaceStore';
import { metricsService } from '@/services';
import type { MetricsOverview } from '@/types';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string | number;
    subValue?: string;
    color: string;
}> = ({ icon: Icon, label, value, subValue, color }) => (
    <Card className="relative overflow-hidden group">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
            </div>
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
    </Card>
);

export const OverviewView: React.FC = () => {
    const navigate = useNavigate();
    const prompts = usePrompts();
    const logs = useLogs();
    const [metrics, setMetrics] = useState<MetricsOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await metricsService.getOverview(7);
                setMetrics(data);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const recentLogs = logs.slice(0, 5);

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">Overview of your prompt operations</p>
                </div>
                <Button onClick={() => navigate('/dashboard/editor')}>
                    <Plus className="w-4 h-4" />
                    New Prompt
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    <>
                        <Card><Skeleton height={80} /></Card>
                        <Card><Skeleton height={80} /></Card>
                        <Card><Skeleton height={80} /></Card>
                        <Card><Skeleton height={80} /></Card>
                    </>
                ) : (
                    <>
                        <StatCard
                            icon={Zap}
                            label="Total Requests"
                            value={metrics?.total_requests.toLocaleString() || '0'}
                            subValue="Last 7 days"
                            color="text-cyan-400"
                        />
                        <StatCard
                            icon={CheckCircle}
                            label="Success Rate"
                            value={`${metrics?.success_rate || 0}%`}
                            subValue="Last 7 days"
                            color="text-green-400"
                        />
                        <StatCard
                            icon={Clock}
                            label="Avg Latency"
                            value={`${metrics?.avg_latency_ms || 0}ms`}
                            subValue={`P95: ${metrics?.p95_latency_ms || 0}ms`}
                            color="text-yellow-400"
                        />
                        <StatCard
                            icon={DollarSign}
                            label="Total Cost"
                            value={`$${((metrics?.total_cost_cents || 0) / 100).toFixed(2)}`}
                            subValue="Last 7 days"
                            color="text-purple-400"
                        />
                    </>
                )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prompts List */}
                <Card padding="none">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold">Your Prompts</h2>
                        <span className="text-xs text-gray-500">{prompts.length} total</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {prompts.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No prompts yet</p>
                                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/dashboard/editor')}>
                                    Create your first prompt
                                </Button>
                            </div>
                        ) : (
                            prompts.slice(0, 5).map((prompt) => (
                                <motion.div
                                    key={prompt.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/dashboard/editor?prompt=${prompt.id}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{prompt.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {prompt.latest_version || 'No versions'} • {prompt.version_count} version{prompt.version_count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <GitBranch className="w-4 h-4 text-gray-500" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card padding="none">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold">Recent Activity</h2>
                        <Activity className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentLogs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No recent activity</p>
                            </div>
                        ) : (
                            recentLogs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-1 rounded ${log.level === 'success' ? 'bg-green-500/10 text-green-400' :
                                                log.level === 'error' ? 'bg-red-500/10 text-red-400' :
                                                    log.level === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                                                        'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {log.level === 'success' ? <CheckCircle className="w-3 h-3" /> :
                                                log.level === 'error' || log.level === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                                                    <Activity className="w-3 h-3" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{log.message}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OverviewView;
