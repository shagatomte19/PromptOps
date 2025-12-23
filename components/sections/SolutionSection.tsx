import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, FlaskConical, Gauge, Rocket } from 'lucide-react';

const steps = [
  { icon: GitBranch, label: "Version" },
  { icon: FlaskConical, label: "Test" },
  { icon: Gauge, label: "Monitor" },
  { icon: Rocket, label: "Deploy" },
];

export const SolutionSection: React.FC = () => {
  return (
    <section id="solution" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#05050A] to-[#0A0B14] scroll-mt-20">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-display font-bold mb-6"
            >
              The Full-Stack <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Prompt Pipeline
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg mb-8 leading-relaxed"
            >
              PromptOps Cloud introduces a standard software lifecycle for your generative AI features. 
              Treat your prompts with the same rigor as your backend code.
            </motion.p>
            
            <div className="space-y-4">
              {[
                "Git-based workflow for prompts",
                "Automated regression testing",
                "Latency & Cost attribution",
                "Instant rollbacks with one click"
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full relative">
            {/* Animated Connecting Beam */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden md:block z-0 pointer-events-none">
                <svg className="w-full h-20 overflow-visible">
                    <defs>
                        <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Background Line */}
                    <path d="M0,40 L600,40" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                    
                    {/* Moving Beam */}
                    <motion.path 
                        d="M0,40 L100,40" 
                        stroke="url(#beamGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0, x: -100, opacity: 0 }}
                        animate={{ 
                            pathLength: [0.1, 0.3, 0.1], 
                            x: [0, 500, 600],
                            opacity: [0, 1, 0] 
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                    />
                </svg>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    <div className="aspect-square rounded-2xl bg-[#0F111A] border border-white/10 flex flex-col items-center justify-center gap-3 hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)]">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                        <Icon className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <span className="font-display font-medium text-sm text-gray-300 group-hover:text-white">{step.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};