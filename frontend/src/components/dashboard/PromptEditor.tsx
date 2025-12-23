import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Play, Save, GitCommit, History, Loader2, AlertTriangle, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useWorkspaceStore, usePrompts } from '@/stores/workspaceStore';
import { useToast } from '@/stores/toastStore';
import { promptsService, inferenceService } from '@/services';
import type { Prompt, PromptVersion } from '@/types';

export const PromptEditor: React.FC = () => {
    const [searchParams] = useSearchParams();
    const prompts = usePrompts();
    const addLog = useWorkspaceStore((s) => s.addLog);
    const fetchPrompts = useWorkspaceStore((s) => s.fetchPrompts);
    const toast = useToast();

    const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);

    const [isRunning, setIsRunning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [streamedResponse, setStreamedResponse] = useState('');
    const [metrics, setMetrics] = useState({ tokens: 0, latency: '0ms', cost: '$0.00' });

    // Editor State
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
    const [userPrompt, setUserPrompt] = useState('{{input}}');
    const [promptName, setPromptName] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // Detected Variables
    const [variables, setVariables] = useState<Record<string, string>>({});

    // Config State
    const [config, setConfig] = useState({
        temperature: 0.7,
        maxTokens: 1024,
        model: 'gemini-2.0-flash'
    });

    // Load prompt from URL param
    useEffect(() => {
        const promptId = searchParams.get('prompt');
        if (promptId) {
            setSelectedPromptId(parseInt(promptId));
        }
    }, [searchParams]);

    // Fetch selected prompt details
    useEffect(() => {
        const loadPrompt = async () => {
            if (selectedPromptId) {
                try {
                    const prompt = await promptsService.get(selectedPromptId);
                    setSelectedPrompt(prompt);
                    setPromptName(prompt.name);

                    if (prompt.versions.length > 0) {
                        const latestVersion = prompt.versions[0];
                        setSelectedVersion(latestVersion);
                        setSystemPrompt(latestVersion.system_prompt);
                        setUserPrompt(latestVersion.user_prompt);
                        setConfig({
                            temperature: latestVersion.temperature,
                            maxTokens: latestVersion.max_tokens,
                            model: latestVersion.model
                        });
                    }
                    setHasChanges(false);
                } catch (error) {
                    toast.error('Failed to load prompt');
                }
            }
        };
        loadPrompt();
    }, [selectedPromptId, toast]);

    // Extract variables from user prompt
    useEffect(() => {
        const regex = /{{(.*?)}}/g;
        let match;
        const foundVars: Set<string> = new Set();

        while ((match = regex.exec(userPrompt)) !== null) {
            foundVars.add(match[1].trim());
        }

        setVariables(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(key => {
                if (!foundVars.has(key)) delete next[key];
            });
            foundVars.forEach(key => {
                if (!next[key]) next[key] = '';
            });
            return next;
        });
    }, [userPrompt]);

    // Track changes
    useEffect(() => {
        if (selectedVersion) {
            const changed =
                systemPrompt !== selectedVersion.system_prompt ||
                userPrompt !== selectedVersion.user_prompt ||
                config.temperature !== selectedVersion.temperature ||
                config.maxTokens !== selectedVersion.max_tokens ||
                config.model !== selectedVersion.model;
            setHasChanges(changed);
        }
    }, [systemPrompt, userPrompt, config, selectedVersion]);

    const handleRun = useCallback(async () => {
        setIsRunning(true);
        setStreamedResponse('');
        addLog('info', `Starting inference on ${config.model}...`, 'Gemini');

        const startTime = Date.now();
        let fullText = '';

        const abort = inferenceService.runStream(
            {
                system_prompt: systemPrompt,
                user_prompt: userPrompt,
                variables,
                model: config.model,
                temperature: config.temperature,
                max_tokens: config.maxTokens,
                prompt_id: selectedPromptId || undefined,
                version_id: selectedVersion?.id,
            },
            (chunk) => {
                fullText += chunk;
                setStreamedResponse(prev => prev + chunk);
            },
            (stats) => {
                const latencyMs = Date.now() - startTime;
                const estimatedTokens = Math.floor(fullText.length / 4);
                const estimatedCost = (estimatedTokens / 1000000) * 0.10;

                setMetrics({
                    tokens: estimatedTokens,
                    latency: `${latencyMs}ms`,
                    cost: `$${estimatedCost.toFixed(5)}`
                });

                addLog('success', `Inference completed in ${latencyMs}ms`, 'Gemini');
                setIsRunning(false);
            },
            (error) => {
                setStreamedResponse(`Error: ${error}`);
                addLog('error', `Inference failed: ${error}`, 'Gemini');
                setIsRunning(false);
            }
        );
    }, [systemPrompt, userPrompt, variables, config, selectedPromptId, selectedVersion, addLog]);

    const handleSave = async () => {
        if (!promptName.trim()) {
            toast.error('Please enter a prompt name');
            return;
        }

        setIsSaving(true);

        try {
            if (selectedPromptId && selectedPrompt) {
                // Create new version
                const versionNumber = selectedPrompt.versions.length + 1;
                await promptsService.createVersion(selectedPromptId, {
                    version_tag: `v${versionNumber}.0.0`,
                    system_prompt: systemPrompt,
                    user_prompt: userPrompt,
                    model: config.model,
                    temperature: config.temperature,
                    max_tokens: config.maxTokens,
                    commit_message: 'Updated from editor'
                });
                toast.success('Version saved successfully');
                addLog('success', `Saved version v${versionNumber}.0.0`, 'Git');
            } else {
                // Create new prompt with initial version
                const newPrompt = await promptsService.create({
                    name: promptName,
                    initial_version: {
                        version_tag: 'v1.0.0',
                        system_prompt: systemPrompt,
                        user_prompt: userPrompt,
                        model: config.model,
                        temperature: config.temperature,
                        max_tokens: config.maxTokens
                    }
                });
                setSelectedPromptId(newPrompt.id);
                toast.success('Prompt created successfully');
                addLog('success', `Created prompt "${promptName}"`, 'Git');
            }

            setHasChanges(false);
            fetchPrompts();
        } catch (error) {
            toast.error('Failed to save prompt');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-background">
            {/* Left: Prompt Selector */}
            <div className="w-full md:w-56 border-r border-white/10 bg-surface flex-shrink-0">
                <div className="p-3 border-b border-white/10">
                    <Button size="sm" variant="secondary" className="w-full" onClick={() => {
                        setSelectedPromptId(null);
                        setSelectedPrompt(null);
                        setSelectedVersion(null);
                        setSystemPrompt('You are a helpful AI assistant.');
                        setUserPrompt('{{input}}');
                        setPromptName('');
                        setHasChanges(false);
                    }}>
                        <Plus className="w-3 h-3" />
                        New Prompt
                    </Button>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                    {prompts.map((prompt) => (
                        <button
                            key={prompt.id}
                            onClick={() => setSelectedPromptId(prompt.id)}
                            className={`w-full text-left px-3 py-2 text-sm border-b border-white/5 hover:bg-white/5 transition-colors ${selectedPromptId === prompt.id ? 'bg-cyan-950/30 border-l-2 border-l-cyan-400' : ''
                                }`}
                        >
                            <div className="font-medium truncate">{prompt.name}</div>
                            <div className="text-xs text-gray-500">{prompt.latest_version || 'No version'}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Center: Code Editor */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
                {/* Toolbar */}
                <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-surface">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={promptName}
                            onChange={(e) => setPromptName(e.target.value)}
                            placeholder="Prompt name..."
                            className="bg-transparent text-sm font-mono text-gray-300 focus:outline-none"
                        />
                        {hasChanges && (
                            <div className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                Unsaved Changes
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" className="h-7 text-xs px-3" onClick={handleSave} isLoading={isSaving}>
                            <Save className="w-3 h-3 mr-1.5" /> Save
                        </Button>
                        <Button size="sm" className="h-7 text-xs px-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-none" onClick={handleRun} disabled={isRunning}>
                            {isRunning ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Play className="w-3 h-3 mr-1.5 fill-current" />}
                            Run
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* System Prompt Block */}
                    <div className="flex-1 flex flex-col border-b border-white/10 min-h-[150px]">
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-surface-light select-none flex justify-between items-center">
                            <span>System Context</span>
                            <span className="text-[10px] text-gray-600 font-mono">role: system</span>
                        </div>
                        <div className="relative flex-1 bg-background">
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed selection:bg-indigo-500/30"
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {/* User Prompt Block */}
                    <div className="flex-1 flex flex-col min-h-[150px]">
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-surface-light select-none flex justify-between items-center">
                            <span>User Message</span>
                            <span className="text-[10px] text-gray-600 font-mono">role: user</span>
                        </div>
                        <div className="relative flex-1 bg-background">
                            <textarea
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed selection:bg-indigo-500/30"
                                spellCheck={false}
                            />
                            <div className="absolute bottom-2 right-4 text-[10px] text-gray-600 pointer-events-none bg-black/50 backdrop-blur px-2 py-1 rounded">
                                Use <span className="text-cyan-500">{"{{variable}}"}</span> for dynamic inputs
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Output & Config */}
            <div className="w-full md:w-96 flex flex-col bg-surface">
                {/* Configuration Panel */}
                <div className="p-4 border-b border-white/10 space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Model Config</h3>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Model</label>
                            <select
                                value={config.model}
                                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                                className="w-full bg-surface-light border border-white/10 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
                            >
                                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Temperature: {config.temperature}</label>
                                <input
                                    type="range"
                                    min="0" max="2" step="0.1"
                                    value={config.temperature}
                                    onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                    className="w-full accent-cyan-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Max Tokens</label>
                                <input
                                    type="number"
                                    value={config.maxTokens}
                                    onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                                    className="w-full bg-surface-light border border-white/10 rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variables Panel */}
                <div className="p-4 border-b border-white/10 space-y-3 bg-surface-light">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Test Variables</h3>
                    {Object.keys(variables).length > 0 ? (
                        Object.keys(variables).map(key => (
                            <div key={key} className="flex items-center gap-2">
                                <span className="font-mono text-xs text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">{key}</span>
                                <input
                                    type="text"
                                    value={variables[key]}
                                    onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="flex-1 bg-transparent border-b border-white/10 text-sm text-gray-300 focus:outline-none focus:border-cyan-500 px-1 py-0.5"
                                    placeholder="Value..."
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-600 italic">No variables detected in User Message</div>
                    )}
                </div>

                {/* Output Panel */}
                <div className="flex-1 flex flex-col min-h-0 bg-surface">
                    <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Output</h3>
                        {streamedResponse && <span className="text-[10px] text-green-400">200 OK</span>}
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                        {streamedResponse ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {streamedResponse}
                                {isRunning && <span className="inline-block w-1.5 h-3 bg-cyan-500 ml-1 animate-pulse align-middle" />}
                            </motion.div>
                        ) : (
                            <div className="text-gray-600 italic text-center mt-10 text-xs">
                                Ready to generate...
                            </div>
                        )}
                    </div>

                    {/* Metrics Footer */}
                    {streamedResponse && (
                        <div className="p-2 border-t border-white/10 grid grid-cols-3 text-center text-[10px] text-gray-500 font-mono">
                            <div className="border-r border-white/5">
                                <div className="text-gray-400">{metrics.tokens}</div>
                                <div>TOKENS</div>
                            </div>
                            <div className="border-r border-white/5">
                                <div className="text-gray-400">{metrics.latency}</div>
                                <div>LATENCY</div>
                            </div>
                            <div>
                                <div className="text-gray-400">{metrics.cost}</div>
                                <div>COST</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromptEditor;
