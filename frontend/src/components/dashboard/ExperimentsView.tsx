import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FlaskConical,
    Play,
    Pause,
    Square,
    Plus,
    Trash2,
    ChevronRight,
    TrendingUp,
    Clock,
    Zap,
    CheckCircle,
    AlertCircle,
    X,
    Percent,
    BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loading';
import { useToast } from '@/stores/toastStore';
import { usePrompts } from '@/stores/workspaceStore';
import { experimentsService } from '@/services';
import type { Experiment, ExperimentStatus, ExperimentVariant } from '@/types';
import { cn } from '@/utils/cn';

// Status configuration
const statusConfig: Record<ExperimentStatus, { color: string; bg: string; icon: React.ElementType }> = {
    draft: { color: 'text-gray-400', bg: 'bg-gray-500/10', icon: FlaskConical },
    running: { color: 'text-green-400', bg: 'bg-green-500/10', icon: Play },
    paused: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Pause },
    completed: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: CheckCircle },
};

// Create Experiment Modal
const CreateExperimentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        prompt_id: number;
        name: string;
        description: string;
        variants: Array<{
            name: string;
            system_prompt: string;
            user_prompt: string;
            model: string;
            temperature: number;
            traffic_weight: number;
        }>;
    }) => void;
    prompts: Array<{ id: number; name: string }>;
}> = ({ isOpen, onClose, onSubmit, prompts }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPromptId, setSelectedPromptId] = useState<number | ''>('');
    const [variants, setVariants] = useState([
        { name: 'Control', system_prompt: '', user_prompt: '{{input}}', model: 'gemini-2.0-flash', temperature: 0.7, traffic_weight: 50 },
        { name: 'Variant A', system_prompt: '', user_prompt: '{{input}}', model: 'gemini-2.0-flash', temperature: 0.7, traffic_weight: 50 },
    ]);

    const handleAddVariant = () => {
        const totalWeight = variants.reduce((sum, v) => sum + v.traffic_weight, 0);
        const newWeight = Math.max(0, 100 - totalWeight);
        setVariants([...variants, {
            name: `Variant ${String.fromCharCode(65 + variants.length - 1)}`,
            system_prompt: '',
            user_prompt: '{{input}}',
            model: 'gemini-2.0-flash',
            temperature: 0.7,
            traffic_weight: newWeight
        }]);
    };

    const handleRemoveVariant = (index: number) => {
        if (variants.length > 2) {
            setVariants(variants.filter((_, i) => i !== index));
        }
    };

    const handleVariantChange = (index: number, field: string, value: string | number) => {
        setVariants(variants.map((v, i) => i === index ? { ...v, [field]: value } : v));
    };

    const handleSubmit = () => {
        if (!name.trim() || !selectedPromptId) return;
        onSubmit({
            prompt_id: selectedPromptId as number,
            name,
            description,
            variants
        });
        // Reset form
        setName('');
        setDescription('');
        setSelectedPromptId('');
        setVariants([
            { name: 'Control', system_prompt: '', user_prompt: '{{input}}', model: 'gemini-2.0-flash', temperature: 0.7, traffic_weight: 50 },
            { name: 'Variant A', system_prompt: '', user_prompt: '{{input}}', model: 'gemini-2.0-flash', temperature: 0.7, traffic_weight: 50 },
        ]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-white/10 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Create New Experiment</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Experiment Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Temperature Optimization"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Base Prompt</label>
                            <select
                                value={selectedPromptId}
                                onChange={(e) => setSelectedPromptId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                            >
                                <option value="" className="bg-surface">Select a prompt...</option>
                                {prompts.map((p) => (
                                    <option key={p.id} value={p.id} className="bg-surface">{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What are you testing? Why?"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none h-20"
                        />
                    </div>

                    {/* Variants */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-gray-300">Variants</label>
                            <Button size="sm" variant="secondary" onClick={handleAddVariant}>
                                <Plus className="w-3 h-3 mr-1" /> Add Variant
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                            className="bg-transparent text-sm font-medium focus:outline-none border-b border-transparent focus:border-cyan-500"
                                        />
                                        {variants.length > 2 && (
                                            <button
                                                onClick={() => handleRemoveVariant(index)}
                                                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500">Model</label>
                                            <select
                                                value={variant.model}
                                                onChange={(e) => handleVariantChange(index, 'model', e.target.value)}
                                                className="w-full mt-1 px-2 py-1.5 bg-surface border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-500"
                                            >
                                                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                                                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                                                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Temperature: {variant.temperature}</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="2"
                                                step="0.1"
                                                value={variant.temperature}
                                                onChange={(e) => handleVariantChange(index, 'temperature', parseFloat(e.target.value))}
                                                className="w-full mt-2 accent-cyan-500 h-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Traffic: {variant.traffic_weight}%</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={variant.traffic_weight}
                                                onChange={(e) => handleVariantChange(index, 'traffic_weight', parseInt(e.target.value))}
                                                className="w-full mt-2 accent-cyan-500 h-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500">System Prompt</label>
                                            <textarea
                                                value={variant.system_prompt}
                                                onChange={(e) => handleVariantChange(index, 'system_prompt', e.target.value)}
                                                placeholder="System context..."
                                                className="w-full mt-1 px-2 py-1.5 bg-surface border border-white/10 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none h-16 font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">User Prompt Template</label>
                                            <textarea
                                                value={variant.user_prompt}
                                                onChange={(e) => handleVariantChange(index, 'user_prompt', e.target.value)}
                                                placeholder="{{input}}"
                                                className="w-full mt-1 px-2 py-1.5 bg-surface border border-white/10 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none h-16 font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        Total traffic: {variants.reduce((sum, v) => sum + v.traffic_weight, 0)}%
                        {variants.reduce((sum, v) => sum + v.traffic_weight, 0) !== 100 && (
                            <span className="text-yellow-500 ml-2">Should equal 100%</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!name.trim() || !selectedPromptId || variants.reduce((sum, v) => sum + v.traffic_weight, 0) !== 100}
                        >
                            <FlaskConical className="w-4 h-4 mr-2" />
                            Create Experiment
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Experiment Card
const ExperimentCard: React.FC<{
    experiment: Experiment;
    onStart: () => void;
    onStop: () => void;
    onDelete: () => void;
}> = ({ experiment, onStart, onStop, onDelete }) => {
    const config = statusConfig[experiment.status];
    const StatusIcon = config.icon;

    const totalRequests = experiment.variants.reduce((sum, v) => sum + v.request_count, 0);
    const avgLatency = experiment.variants.length > 0
        ? experiment.variants.reduce((sum, v) => sum + v.avg_latency_ms, 0) / experiment.variants.length
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-white/10 rounded-xl bg-surface-light hover:bg-white/5 transition-colors"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg", config.bg)}>
                        <StatusIcon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{experiment.name}</h3>
                        {experiment.description && (
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{experiment.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <FlaskConical className="w-3 h-3" />
                                {experiment.variants.length} variants
                            </span>
                            <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {totalRequests.toLocaleString()} requests
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {avgLatency.toFixed(0)}ms avg
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-1 rounded text-xs font-medium capitalize", config.bg, config.color)}>
                        {experiment.status}
                    </span>
                </div>
            </div>

            {/* Variants Preview */}
            <div className="mb-4 space-y-2">
                {experiment.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center gap-3 text-sm">
                        <div className="w-24 truncate text-gray-400">{variant.name}</div>
                        <div className="flex-1">
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                                    style={{ width: `${variant.traffic_weight}%` }}
                                />
                            </div>
                        </div>
                        <div className="w-12 text-right text-xs text-gray-500">{variant.traffic_weight}%</div>
                        <div className="w-20 text-right text-xs text-gray-500">
                            {variant.success_count}/{variant.request_count}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                {experiment.status === 'draft' && (
                    <Button size="sm" onClick={onStart} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-3 h-3 mr-1" /> Start
                    </Button>
                )}
                {experiment.status === 'running' && (
                    <Button size="sm" variant="secondary" onClick={onStop}>
                        <Square className="w-3 h-3 mr-1" /> Stop
                    </Button>
                )}
                {experiment.status === 'paused' && (
                    <Button size="sm" onClick={onStart}>
                        <Play className="w-3 h-3 mr-1" /> Resume
                    </Button>
                )}
                {(experiment.status === 'completed' || experiment.status === 'draft') && (
                    <Button size="sm" variant="ghost" onClick={onDelete} className="text-gray-400 hover:text-red-400">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                )}
                <Button size="sm" variant="ghost" className="ml-auto">
                    <BarChart3 className="w-3 h-3 mr-1" /> View Results
                    <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </motion.div>
    );
};

export const ExperimentsView: React.FC = () => {
    const toast = useToast();
    const prompts = usePrompts();

    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState<ExperimentStatus | 'all'>('all');

    useEffect(() => {
        fetchExperiments();
    }, []);

    const fetchExperiments = async () => {
        setLoading(true);
        try {
            const data = await experimentsService.list();
            setExperiments(data);
        } catch (error) {
            console.error('Failed to fetch experiments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: Parameters<typeof experimentsService.create>[0]) => {
        try {
            await experimentsService.create(data);
            toast.success('Experiment created successfully');
            setIsCreateModalOpen(false);
            fetchExperiments();
        } catch (error) {
            toast.error('Failed to create experiment');
        }
    };

    const handleStart = async (experimentId: number) => {
        try {
            await experimentsService.start(experimentId);
            toast.success('Experiment started');
            fetchExperiments();
        } catch (error) {
            toast.error('Failed to start experiment');
        }
    };

    const handleStop = async (experimentId: number) => {
        try {
            await experimentsService.stop(experimentId);
            toast.success('Experiment stopped');
            fetchExperiments();
        } catch (error) {
            toast.error('Failed to stop experiment');
        }
    };

    const handleDelete = async (experimentId: number) => {
        try {
            await experimentsService.delete(experimentId);
            toast.success('Experiment deleted');
            fetchExperiments();
        } catch (error) {
            toast.error('Failed to delete experiment');
        }
    };

    const filteredExperiments = filter === 'all'
        ? experiments
        : experiments.filter(e => e.status === filter);

    const statusCounts = {
        all: experiments.length,
        draft: experiments.filter(e => e.status === 'draft').length,
        running: experiments.filter(e => e.status === 'running').length,
        paused: experiments.filter(e => e.status === 'paused').length,
        completed: experiments.filter(e => e.status === 'completed').length,
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Experiments</h1>
                    <p className="text-gray-400 text-sm mt-1">A/B test your prompts to find the best performing variants</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Experiment
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'draft', 'running', 'paused', 'completed'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                            filter === status
                                ? "bg-white/10 text-white"
                                : "text-gray-400 hover:bg-white/5"
                        )}
                    >
                        <span className="capitalize">{status}</span>
                        <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
                            {statusCounts[status]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Experiments List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i}><Skeleton height={180} /></Card>
                    ))}
                </div>
            ) : filteredExperiments.length === 0 ? (
                <Card className="text-center py-12">
                    <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-semibold mb-2">No experiments yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Create your first experiment to A/B test different prompt configurations and find the best performing variants.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Experiment
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredExperiments.map((experiment) => (
                            <ExperimentCard
                                key={experiment.id}
                                experiment={experiment}
                                onStart={() => handleStart(experiment.id)}
                                onStop={() => handleStop(experiment.id)}
                                onDelete={() => handleDelete(experiment.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreateExperimentModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSubmit={handleCreate}
                        prompts={prompts}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExperimentsView;
