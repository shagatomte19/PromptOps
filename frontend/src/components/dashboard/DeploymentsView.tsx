import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    GitBranch,
    Clock,
    CheckCircle,
    XCircle,
    RotateCcw,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loading';
import { useToast } from '@/stores/toastStore';
import { useWorkspaceStore, usePrompts, useEnvironments } from '@/stores/workspaceStore';
import { deploymentsService } from '@/services';
import type { Deployment } from '@/types';

const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/10',
    deploying: 'text-blue-400 bg-blue-500/10',
    active: 'text-green-400 bg-green-500/10',
    rolled_back: 'text-orange-400 bg-orange-500/10',
    failed: 'text-red-400 bg-red-500/10',
};

const statusIcons = {
    pending: Clock,
    deploying: GitBranch,
    active: CheckCircle,
    rolled_back: RotateCcw,
    failed: XCircle,
};

export const DeploymentsView: React.FC = () => {
    const prompts = usePrompts();
    const environments = useEnvironments();
    const fetchEnvironments = useWorkspaceStore((s) => s.fetchEnvironments);
    const toast = useToast();

    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnv, setSelectedEnv] = useState<number | null>(null);

    useEffect(() => {
        fetchEnvironments();
        fetchDeployments();
    }, [fetchEnvironments]);

    const fetchDeployments = async () => {
        setLoading(true);
        try {
            const data = await deploymentsService.list(selectedEnv || undefined);
            setDeployments(data);
        } catch (error) {
            console.error('Failed to fetch deployments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeployments();
    }, [selectedEnv]);

    const handleRollback = async (deploymentId: number) => {
        try {
            await deploymentsService.rollback(deploymentId, 'Manual rollback from UI');
            toast.success('Rollback initiated');
            fetchDeployments();
        } catch (error) {
            toast.error('Rollback failed');
        }
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Deployments</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage prompt deployments across environments</p>
                </div>
            </div>

            {/* Environment Filter */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedEnv(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedEnv === null ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'
                        }`}
                >
                    All Environments
                </button>
                {environments.map((env) => (
                    <button
                        key={env.id}
                        onClick={() => setSelectedEnv(env.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedEnv === env.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'
                            }`}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: env.color }} />
                        {env.display_name}
                    </button>
                ))}
            </div>

            {/* Deployments List */}
            <Card padding="none">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="font-semibold">Deployment History</h2>
                    <span className="text-xs text-gray-500">{deployments.length} deployments</span>
                </div>

                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} height={60} />)}
                    </div>
                ) : deployments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No deployments yet</p>
                        <p className="text-xs mt-1">Deploy a prompt version to see it here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {deployments.map((deployment) => {
                            const StatusIcon = statusIcons[deployment.status];
                            return (
                                <motion.div
                                    key={deployment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${statusColors[deployment.status]}`}>
                                            <StatusIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{deployment.prompt_name || 'Unknown Prompt'}</span>
                                                <ChevronRight className="w-3 h-3 text-gray-600" />
                                                <span className="text-cyan-400 font-mono text-sm">{deployment.version_tag}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: environments.find(e => e.id === deployment.environment_id)?.color || '#666' }}
                                                    />
                                                    {deployment.environment_name}
                                                </span>
                                                <span>•</span>
                                                <span>{deployment.deployed_at ? new Date(deployment.deployed_at).toLocaleString() : 'Pending'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[deployment.status]}`}>
                                            {deployment.status.replace('_', ' ')}
                                        </span>
                                        {deployment.status === 'active' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs"
                                                onClick={() => handleRollback(deployment.id)}
                                            >
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                Rollback
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DeploymentsView;
