import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, GitBranch, Zap, Check } from 'lucide-react';

const codeSnippets = [
    {
        title: 'prompts/summarize.yaml',
        language: 'yaml',
        code: `name: article-summarizer
version: 2.3.1
model: gemini-pro

template: |
  Summarize the following article in 
  {{style}} style, keeping it under
  {{max_words}} words.
  
  Article: {{content}}

variables:
  style: ["brief", "detailed"]
  max_words: [100, 250, 500]`
    },
    {
        title: 'Terminal',
        language: 'bash',
        code: `$ promptops deploy summarize --env production
→ Validating prompt schema... ✓
→ Running test suite (12 cases)... ✓
→ Creating version 2.3.1... ✓
→ Deploying to production... ✓

✨ Deployed successfully!
   Endpoint: /v1/prompts/summarize
   Latency: 245ms (p95)
   Cost: $0.0012/call`
    },
    {
        title: 'Metrics Dashboard',
        language: 'json',
        code: `{
  "prompt": "article-summarizer",
  "environment": "production",
  "period": "24h",
  "metrics": {
    "requests": 45892,
    "success_rate": 99.7,
    "avg_latency_ms": 234,
    "p99_latency_ms": 567,
    "total_cost_usd": 54.23,
    "tokens_used": 2847291
  }
}`
    }
];

const MockCodeEditor: React.FC<{ snippet: typeof codeSnippets[0]; isActive: boolean }> = ({ snippet, isActive }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isActive ? 1 : 0.5, x: 0, scale: isActive ? 1 : 0.95 }}
            className="bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        >
            {/* Editor header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-sm text-gray-400 ml-2 font-mono">{snippet.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {snippet.language === 'bash' && <Terminal className="w-4 h-4 text-gray-500" />}
                    {snippet.language === 'yaml' && <GitBranch className="w-4 h-4 text-gray-500" />}
                    {snippet.language === 'json' && <Zap className="w-4 h-4 text-gray-500" />}
                </div>
            </div>
            
            {/* Code content */}
            <div className="p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
                    {snippet.code.split('\n').map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex"
                        >
                            <span className="text-gray-600 w-6 text-right mr-4 select-none">{i + 1}</span>
                            <span className={
                                line.includes('✓') || line.includes('✨') ? 'text-green-400' :
                                line.includes('$') ? 'text-cyan-400' :
                                line.includes(':') && !line.includes('http') ? 'text-indigo-400' :
                                'text-gray-300'
                            }>
                                {line}
                            </span>
                        </motion.div>
                    ))}
                </pre>
            </div>
        </motion.div>
    );
};

export const MockupPreview: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                        See It In Action
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        From prompt definition to production deployment in minutes, not days
                    </p>
                </motion.div>

                {/* Interactive demo */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Step indicators */}
                    <div className="space-y-4">
                        {[
                            { icon: GitBranch, title: 'Define Your Prompt', desc: 'Write prompts with version control, variables, and schema validation' },
                            { icon: Terminal, title: 'Deploy Anywhere', desc: 'One command to deploy to dev, staging, or production' },
                            { icon: Zap, title: 'Monitor Everything', desc: 'Real-time metrics on latency, costs, and success rates' }
                        ].map((step, i) => (
                            <motion.button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    activeIndex === i
                                        ? 'bg-white/5 border-cyan-500/50'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        activeIndex === i 
                                            ? 'bg-gradient-to-br from-cyan-500 to-indigo-500' 
                                            : 'bg-white/10'
                                    }`}>
                                        <step.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                                        <p className="text-sm text-gray-400">{step.desc}</p>
                                    </div>
                                    {activeIndex === i && (
                                        <Check className="w-5 h-5 text-cyan-400 ml-auto" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Right: Code preview */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <MockCodeEditor
                                key={activeIndex}
                                snippet={codeSnippets[activeIndex]}
                                isActive={true}
                            />
                        </AnimatePresence>
                        
                        {/* Decorative blur */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-2xl blur-3xl -z-10 opacity-50" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MockupPreview;
