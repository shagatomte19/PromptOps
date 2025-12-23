import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ChevronRight, PlayCircle, Command, GitBranch, Cpu, Database, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import ParticleNetwork from '../three/ParticleNetwork';

const InfiniteMarquee = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 bg-black/20 py-6 backdrop-blur-sm">
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#05050A] to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#05050A] to-transparent" />
      
      <div className="flex w-max animate-scroll gap-20">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-20 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="font-display font-bold text-xl flex items-center gap-2"><Command className="w-6 h-6" /> ACME AI</span>
             <span className="font-display font-bold text-xl flex items-center gap-2"><Cpu className="w-6 h-6" /> NEURAL SYST</span>
             <span className="font-display font-bold text-xl flex items-center gap-2"><Database className="w-6 h-6" /> DATAFLOW</span>
             <span className="font-display font-bold text-xl flex items-center gap-2"><GitBranch className="w-6 h-6" /> PROMPT_LABS</span>
             <span className="font-display font-bold text-xl flex items-center gap-2">OPENAI</span>
             <span className="font-display font-bold text-xl flex items-center gap-2">ANTHROPIC</span>
             <span className="font-display font-bold text-xl flex items-center gap-2">COHERE</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FloatingDashboard = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 50, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 15 });

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        const xPct = clientX / innerWidth - 0.5;
        const yPct = clientY / innerHeight - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

    return (
        <div 
            className="perspective-1000 relative z-20 w-full flex justify-center mt-12 md:mt-20 px-4"
            onMouseMove={handleMouseMove}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, rotateX: 20, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[2/1] rounded-xl border border-white/10 bg-[#0A0B14]/90 backdrop-blur-xl shadow-2xl overflow-hidden group"
            >
                 {/* Scanning Effect */}
                 <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500/30 blur-sm z-30 animate-scan pointer-events-none" />

                 {/* Dashboard Header */}
                <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2 z-20">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="mx-auto text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        dashboard.promptops.cloud
                    </div>
                </div>

                {/* Dashboard Content Mockup */}
                <div className="p-4 pt-14 md:p-8 md:pt-16 grid grid-cols-12 gap-6 h-full font-mono text-xs">
                    {/* Sidebar */}
                    <div className="col-span-2 border-r border-white/10 pr-4 space-y-4 text-gray-400 hidden sm:block">
                        <div className="h-2 w-20 bg-white/10 rounded animate-pulse" />
                        <div className="h-2 w-16 bg-white/10 rounded" />
                        <div className="h-2 w-24 bg-white/10 rounded" />
                        <div className="h-2 w-12 bg-white/10 rounded" />
                        <div className="mt-8 h-2 w-20 bg-white/10 rounded" />
                        <div className="h-2 w-16 bg-white/10 rounded" />
                    </div>
                    
                    {/* Main Area */}
                    <div className="col-span-12 sm:col-span-10 flex flex-col gap-6">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: "Latency", val: "42ms", color: "text-green-400" },
                                { label: "Cost", val: "$1.24", color: "text-white" },
                                { label: "Errors", val: "0.01%", color: "text-cyan-400" }
                            ].map((stat, i) => (
                                <div key={i} className="h-20 md:h-24 rounded-lg bg-white/5 border border-white/10 p-4 relative overflow-hidden flex flex-col justify-between group/card">
                                     <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                     <div className="text-gray-500">{stat.label}</div>
                                     <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.val}</div>
                                     <Activity className="absolute right-2 top-2 w-4 h-4 text-white/10 group-hover/card:text-white/30" />
                                </div>
                            ))}
                        </div>
                        {/* Chart Area */}
                        <div className="flex-1 rounded-lg bg-black/20 border border-white/10 p-4 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors duration-500">
                             <div className="absolute inset-0 flex items-end justify-between px-6 pb-6 pt-12 gap-1 md:gap-2 opacity-50">
                                 {[...Array(30)].map((_, i) => (
                                     <motion.div 
                                        key={i}
                                        initial={{ height: '10%' }}
                                        animate={{ height: `${20 + Math.random() * 60}%` }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                                        className="w-full bg-gradient-to-t from-indigo-500/50 to-cyan-500/50 rounded-t-sm hover:from-cyan-400 hover:to-indigo-400 transition-colors" 
                                     />
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
            </motion.div>
        </div>
    )
}

export const Hero: React.FC = () => {
    const scrollToCTA = () => {
        document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
    };

  return (
    <section className="relative w-full pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden min-h-screen">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <color attach="background" args={['#05050A']} />
            <fog attach="fog" args={['#05050A', 5, 20]} />
            <ambientLight intensity={0.5} />
            <ParticleNetwork />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05050A]/80 to-[#05050A] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-colors cursor-default"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-sm font-medium text-cyan-200">v2.0 Public Beta is Live</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 tracking-tight">
            <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="block">DevOps for</motion.span>
            <motion.span 
                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 animate-gradient bg-300% block pb-2"
            >
              AI Prompts & Agents
            </motion.span>
          </h1>

          <motion.p 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Version, test, deploy, and monitor LLM prompts like production code. 
            Stop managing prompts in spreadsheets and start engineering them.
          </motion.p>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto group shadow-[0_0_40px_rgba(99,102,241,0.3)]" onClick={scrollToCTA}>
              Join the Waitlist
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <PlayCircle className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* 3D Dashboard Mockup */}
        <FloatingDashboard />
      </div>

       {/* Infinite Marquee */}
       <div className="relative z-10 mt-20 w-full">
           <div className="text-center text-sm text-gray-500 mb-6 font-medium tracking-widest uppercase">Trusted by engineering teams at</div>
           <InfiniteMarquee />
       </div>
    </section>
  );
};