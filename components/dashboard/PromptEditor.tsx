import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, GitCommit, History, Zap, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const PromptEditor: React.FC = () => {
    const { addLog, activeEnvironment } = useWorkspace();
    const [isRunning, setIsRunning] = useState(false);
    const [streamedResponse, setStreamedResponse] = useState('');
    const [metrics, setMetrics] = useState({ tokens: 0, latency: '0ms', cost: '$0.00' });
    
    // Editor State
    const [systemPrompt, setSystemPrompt] = useState('You are a senior React engineer.');
    const [userPrompt, setUserPrompt] = useState('Build a component that {{requirement}}.');
    
    // Detected Variables State
    const [variables, setVariables] = useState<Record<string, string>>({});

    // Config State
    const [config, setConfig] = useState({
        temperature: 0.7,
        maxTokens: 1024,
        model: 'gemini-3-flash-preview' // Default to Gemini Flash
    });

    // Initialize Gemini Client safely inside the component
    const ai = useMemo(() => {
        try {
            // Using process.env.API_KEY as strictly required
            const key = process.env.API_KEY;
            if (!key) {
                console.warn("API Key is missing from process.env.API_KEY");
            }
            return new GoogleGenAI({ apiKey: key || 'MISSING_KEY' });
        } catch (error) {
            console.error("Failed to initialize Gemini client:", error);
            return null;
        }
    }, []);

    // Extract variables from user prompt automatically
    useEffect(() => {
        const regex = /{{(.*?)}}/g;
        let match;
        const foundVars: Set<string> = new Set();
        
        while ((match = regex.exec(userPrompt)) !== null) {
            foundVars.add(match[1].trim());
        }

        setVariables(prev => {
            const next = { ...prev };
            // Remove old vars
            Object.keys(next).forEach(key => {
                if (!foundVars.has(key)) delete next[key];
            });
            // Add new vars with default empty string if not exists
            foundVars.forEach(key => {
                if (!next[key]) next[key] = '';
            });
            return next;
        });
    }, [userPrompt]);

    const handleRun = async () => {
        if (!ai) {
            addLog('error', 'Gemini client failed to initialize', 'System');
            return;
        }

        setIsRunning(true);
        setStreamedResponse('');
        const startTime = Date.now();
        addLog('info', `Starting inference on ${config.model}...`, 'Gemini');
        
        try {
            // Interpolate variables
            let finalPrompt = userPrompt;
            Object.entries(variables).forEach(([key, value]) => {
                finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });

            // Call Gemini Stream
            const responseStream = await ai.models.generateContentStream({
                model: config.model,
                contents: finalPrompt,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: config.temperature,
                    maxOutputTokens: config.maxTokens,
                },
            });

            let fullText = '';
            for await (const chunk of responseStream) {
                const c = chunk as GenerateContentResponse;
                const text = c.text;
                if (text) {
                    fullText += text;
                    setStreamedResponse(prev => prev + text);
                }
            }

            const endTime = Date.now();
            const latency = endTime - startTime;
            
            // Basic estimation
            const estimatedTokens = fullText.length / 4; 
            const estimatedCost = (estimatedTokens / 1000000) * 0.10; // Rough dummy pricing

            setMetrics({
                tokens: Math.floor(estimatedTokens),
                latency: `${latency}ms`,
                cost: `$${estimatedCost.toFixed(5)}`
            });

            addLog('success', `Inference completed in ${latency}ms`, 'Gemini');

        } catch (error: any) {
            console.error(error);
            const msg = error.message || error.toString();
            setStreamedResponse(`Error: ${msg}`);
            addLog('error', `Inference failed: ${msg}`, 'Gemini');
        } finally {
            setIsRunning(false);
        }
    };

    const handleSave = () => {
        addLog('success', 'Prompt version v2.1.2 saved successfully', 'Git');
    }

    return (
        <div className="h-full flex flex-col md:flex-row bg-[#05050A]">
            {/* Center: Code Editor */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
                {/* Toolbar */}
                <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-[#0A0B14]">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-gray-500">Customer Support Agent.prompt</span>
                        <div className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            Unsaved Changes
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button size="sm" variant="secondary" className="h-7 text-xs px-3" onClick={handleSave}>
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
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#08090F] select-none flex justify-between items-center">
                            <span>System Context</span>
                            <span className="text-[10px] text-gray-600 font-mono">role: system</span>
                        </div>
                        <div className="relative flex-1 bg-[#05050A]">
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
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#08090F] select-none flex justify-between items-center">
                            <span>User Message</span>
                            <span className="text-[10px] text-gray-600 font-mono">role: user</span>
                        </div>
                        <div className="relative flex-1 bg-[#05050A]">
                            <textarea 
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed selection:bg-indigo-500/30"
                                spellCheck={false}
                            />
                            {/* Variable Overlay Hint */}
                            <div className="absolute bottom-2 right-4 text-[10px] text-gray-600 pointer-events-none bg-black/50 backdrop-blur px-2 py-1 rounded">
                                Use <span className="text-cyan-500">{"{{variable}}"}</span> for dynamic inputs
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Output & Config */}
            <div className="w-full md:w-96 flex flex-col bg-[#0A0B14]">
                {/* Configuration Panel */}
                <div className="p-4 border-b border-white/10 space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gemini Config</h3>
                    
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Model</label>
                            <select 
                                value={config.model}
                                onChange={(e) => setConfig({...config, model: e.target.value})}
                                className="w-full bg-[#151720] border border-white/10 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
                            >
                                <option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
                                <option value="gemini-3-pro-preview">gemini-3-pro-preview</option>
                                <option value="gemini-2.5-flash-latest">gemini-2.5-flash-latest</option>
                                <option value="gemini-2.5-flash-lite-latest">gemini-2.5-flash-lite-latest</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Temperature: {config.temperature}</label>
                                <input 
                                    type="range" 
                                    min="0" max="2" step="0.1"
                                    value={config.temperature}
                                    onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                                    className="w-full accent-cyan-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Max Tokens</label>
                                <input 
                                    type="number" 
                                    value={config.maxTokens}
                                    onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                                    className="w-full bg-[#151720] border border-white/10 rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variables Panel */}
                <div className="p-4 border-b border-white/10 space-y-3 bg-[#08090F]">
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
                <div className="flex-1 flex flex-col min-h-0 bg-[#0A0B14]">
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