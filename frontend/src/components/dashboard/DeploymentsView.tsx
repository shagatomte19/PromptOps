import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitBranch,
    Clock,
    CheckCircle,
    XCircle,
    RotateCcw,
    ChevronRight,
    Plus,
    X,
    Rocket
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loading';
import { useToast } from '@/stores/toastStore';
import { useWorkspaceStore, usePrompts, useEnvironments } from '@/stores/workspaceStore';
import { deploymentsService, promptsService } from '@/services';
import type { Deployment, Prompt } from '@/types';

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

// New Deployment Modal
const NewDeploymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { version_id: number; environment_id: number; notes?: string }) => void;
    prompts: Array<{ id: number; name: string }>;
    environments: Array<{ id: number; name: string; display_name: string; color: string }>;
}> = ({ isOpen, onClose, onSubmit, prompts, environments }) => {
    const [selectedPromptId, setSelectedPromptId] = useState<number | ''>('');
    const [selectedVersionId, setSelectedVersionId] = useState<number | ''>('');
    const [selectedEnvId, setSelectedEnvId] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [promptDetails, setPromptDetails] = useState<Prompt | null>(null);
    const [loadingPrompt, setLoadingPrompt] = useState(false);

    // Load prompt details when selected
    useEffect(() => {
        if (selectedPromptId) {
            setLoadingPrompt(true);
            promptsService.get(selectedPromptId as number)
                .then(setPromptDetails)
                .catch(() => setPromptDetails(null))
                .finally(() => setLoadingPrompt(false));
        } else {
            setPromptDetails(null);
            setSelectedVersionId('');
        }
    }, [selectedPromptId]);

    const handleSubmit = () => {
        if (!selectedVersionId || !selectedEnvId) return;
        onSubmit({
            version_id: selectedVersionId as number,
            environment_id: selectedEnvId as number,
            notes: notes || undefined
        });
        // Reset
        setSelectedPromptId('');
        setSelectedVersionId('');
        setSelectedEnvId('');
        setNotes('');
        setPromptDetails(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-white/10 rounded-xl w-full max-w-lg overflow-hidden"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Rocket className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold">Deploy Version</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Prompt Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Prompt</label>
                        <select
                            value={selectedPromptId}
                            onChange={(e) => setSelectedPromptId(e.target.value ? parseInt(e.target.value) : '')}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                        >
                            <option value="" className="bg-surface">Choose a prompt...</option>
                            {prompts.map((p) => (
                                <option key={p.id} value={p.id} className="bg-surface">{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Version Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Version</label>
                        <select
                            value={selectedVersionId}
                            onChange={(e) => setSelectedVersionId(e.target.value ? parseInt(e.target.value) : '')}
                            disabled={!selectedPromptId || loadingPrompt}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                        >
                            <option value="" className="bg-surface">
                                {loadingPrompt ? 'Loading versions...' : 'Choose a version...'}
                            </option>
                            {promptDetails?.versions.map((v) => (
                                <option key={v.id} value={v.id} className="bg-surface">
                                    {v.version_tag} - {v.model}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Environment Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Target Environment</label>
                        <div className="grid grid-cols-3 gap-2">
                            {environments.map((env) => (
                                <button
                                    key={env.id}
                                    onClick={() => setSelectedEnvId(env.id)}
                                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                                        selectedEnvId === env.id
                                            ? 'bg-white/10 border-cyan-500'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: env.color }} />
                                    <span className="text-sm font-medium">{env.display_name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Deployment Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Reason for deployment, changes included..."
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none h-20"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedVersionId || !selectedEnvId}
                    >
                        <Rocket className="w-4 h-4 mr-2" />
                        Deploy
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export const DeploymentsView: React.FC = () => {
    const prompts = usePrompts();
    const environments = useEnvironments();
    const fetchEnvironments = useWorkspaceStore((s) => s.fetchEnvironments);
    const fetchPrompts = useWorkspaceStore((s) => s.fetchPrompts);
    const toast = useToast();

    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnv, setSelectedEnv] = useState<number | null>(null);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

    useEffect(() => {
        fetchEnvironments();
        fetchPrompts();
        fetchDeployments();
    }, [fetchEnvironments, fetchPrompts]);

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

    const handleDeploy = async (data: { version_id: number; environment_id: number; notes?: string }) => {
        try {
            await deploymentsService.create(data);
            toast.success('Deployment created successfully');
            setIsDeployModalOpen(false);
            fetchDeployments();
        } catch (error) {
            toast.error('Deployment failed');
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
                <Button onClick={() => setIsDeployModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Deploy Version
                </Button>
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
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => setIsDeployModalOpen(true)}
                        >
                            <Plus className="w-3 h-3 mr-1" /> Create First Deployment
                        </Button>
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

            {/* Deploy Modal */}
            <AnimatePresence>
                {isDeployModalOpen && (
                    <NewDeploymentModal
                        isOpen={isDeployModalOpen}
                        onClose={() => setIsDeployModalOpen(false)}
                        onSubmit={handleDeploy}
                        prompts={prompts}
                        environments={environments}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeploymentsView;

