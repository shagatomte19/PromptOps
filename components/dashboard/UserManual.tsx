import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Terminal, Settings, Play, Code } from 'lucide-react';

interface UserManualProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserManual: React.FC<UserManualProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0B14] border-l border-white/10 z-50 shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Book className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-display font-bold text-white">User Manual</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <section>
                                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-indigo-400" />
                                    1. The Prompt Editor
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                    The Prompt Editor is your main workspace. It allows you to design, test, and refine your LLM prompts before deploying them.
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 ml-2">
                                    <li><strong>System Context:</strong> Define the AI's persona (e.g., "You are a Senior Engineer").</li>
                                    <li><strong>User Message:</strong> The input the AI responds to. Use variables here.</li>
                                    <li><strong>Model Config:</strong> Adjust temperature, token limits, and select specific Gemini models.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-cyan-400" />
                                    2. Using Variables
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                    Make your prompts dynamic by using double curly braces.
                                </p>
                                <div className="bg-[#151720] border border-white/10 rounded p-3 font-mono text-xs text-gray-300 mb-3">
                                    Explain the concept of <span className="text-cyan-400">{'{{topic}}'}</span> to a <span className="text-cyan-400">{'{{audience}}'}</span>.
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    When you define a variable in the prompt, it automatically appears in the <strong>Test Variables</strong> panel on the right. Enter values there to test specific scenarios.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                                    <Play className="w-4 h-4 text-green-400" />
                                    3. Running Tests
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                    Click the <strong>Run</strong> button to execute the prompt against the selected Google Gemini model.
                                </p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    The response will stream in real-time. Metrics for <strong>Latency</strong>, <strong>Tokens</strong>, and estimated <strong>Cost</strong> are calculated after every run to help you optimize.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-yellow-400" />
                                    4. Environments
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Use the environment switcher in the top right (Dev / Staging / Prod) to manage different versions of your prompts. Always test in 'Dev' before promoting to 'Prod'.
                                </p>
                            </section>
                        </div>
                        
                        <div className="p-6 border-t border-white/10 bg-[#0F111A]">
                            <p className="text-xs text-gray-500 text-center">
                                Need more help? Contact support@promptops.cloud
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};