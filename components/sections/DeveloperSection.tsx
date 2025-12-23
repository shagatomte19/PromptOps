import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Terminal } from 'lucide-react';

const TerminalLine: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            {children}
        </motion.div>
    )
}

const TypewriterText: React.FC<{ text: string; startDelay?: number }> = ({ text, startDelay = 0 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, startDelay);
        return () => clearTimeout(startTimeout);
    }, [startDelay]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Typing speed

        return () => clearInterval(interval);
    }, [text, started]);

    return (
        <span>
            {displayedText}
            {started && displayedText.length < text.length && <span className="animate-cursor inline-block w-2 h-4 bg-cyan-400 align-middle ml-1" />}
        </span>
    );
};

export const DeveloperSection: React.FC = () => {
  return (
    <section id="docs" className="py-24 bg-[#0A0B14] overflow-hidden relative scroll-mt-20">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 order-2 lg:order-1 w-full">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="rounded-xl overflow-hidden bg-[#0F111A] border border-white/10 shadow-2xl font-mono text-sm relative group"
             >
                {/* Glow effect on hover */}
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

               <div className="flex items-center px-4 py-3 bg-[#1A1C25] border-b border-white/5 gap-2 relative z-10">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 <div className="ml-auto text-xs text-gray-500">bash — 80x24</div>
               </div>
               <div className="p-6 text-gray-300 space-y-4 relative z-10 min-h-[300px]">
                 
                 <div className="flex gap-2">
                   <span className="text-green-400">➜</span>
                   <span className="text-cyan-400">~</span>
                   <TypewriterText text="npm install @promptops/sdk" startDelay={500} />
                 </div>
                 
                 <TerminalLine delay={2500}>
                    <div className="text-gray-500">
                    added 1 package in 2s
                    </div>
                 </TerminalLine>

                 <TerminalLine delay={3000}>
                    <div className="flex gap-2">
                        <span className="text-green-400">➜</span>
                        <span className="text-cyan-400">~</span>
                        <TypewriterText text="promptops init" startDelay={3500} />
                    </div>
                 </TerminalLine>

                 <TerminalLine delay={5000}>
                    <div className="text-gray-500">
                    Initialized .promptops.json
                    </div>
                 </TerminalLine>

                 <TerminalLine delay={5500}>
                    <div className="flex gap-2">
                        <span className="text-green-400">➜</span>
                        <span className="text-cyan-400">~</span>
                        <TypewriterText text="promptops deploy --env production" startDelay={6000} />
                    </div>
                 </TerminalLine>
                 
                 <TerminalLine delay={8500}>
                    <div className="text-indigo-400">
                    ○ Compiling prompts... <span className="text-green-400">Done</span>
                    </div>
                 </TerminalLine>
                 <TerminalLine delay={9000}>
                    <div className="text-indigo-400">
                    ○ Running regression tests... <span className="text-green-400">14/14 Passed</span>
                    </div>
                 </TerminalLine>
                 <TerminalLine delay={9500}>
                    <div className="text-indigo-400">
                    ○ Syncing to edge... <span className="text-green-400">Success (142ms)</span>
                    </div>
                 </TerminalLine>
                 
                 <TerminalLine delay={10000}>
                    <div className="mt-2 text-green-400 font-bold border-l-2 border-green-400 pl-2">
                    Deployed v2.1.0 to production 🚀
                    </div>
                 </TerminalLine>
                 
                 <TerminalLine delay={10500}>
                    <div className="flex gap-2 mt-4">
                        <span className="text-green-400">➜</span>
                        <span className="text-cyan-400">~</span>
                        <span className="animate-cursor inline-block w-2 h-4 bg-gray-500" />
                    </div>
                 </TerminalLine>
               </div>
             </motion.div>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-300">Developer First</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Built for <span className="text-white">your workflow</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We know you hate clicking buttons in a UI. That's why PromptOps is API-first and CLI-native. 
                Integrate directly into your existing CI/CD pipelines (GitHub Actions, GitLab CI) and deploy prompts automatically.
                </p>
                
                <div className="bg-[#1A1C25] p-4 rounded-lg border border-white/10 flex items-center justify-between group cursor-pointer hover:border-cyan-500/30 transition-colors">
                <code className="text-cyan-400">npm i @promptops/react</code>
                <Copy className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};