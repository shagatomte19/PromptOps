import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, Star, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const taglines = [
    'Version control for prompts',
    'Deploy to any environment',
    'A/B test your AI features',
    'Monitor costs & latency',
    'Ship AI faster'
];

// Animated counter component
const AnimatedCounter: React.FC<{ value: string; label: string; delay: number }> = ({ value, label, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);
    
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    
    useEffect(() => {
        if (!isInView) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = numericValue / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                setCount(numericValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, [isInView, numericValue]);
    
    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay }}
            className="text-center group"
        >
            <div className="text-3xl md:text-4xl font-bold font-display bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all duration-500">
                {count}{suffix}
            </div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
        </motion.div>
    );
};

export const HeroSection: React.FC = () => {
    const [currentTagline, setCurrentTagline] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const tagline = taglines[currentTagline];
        
        if (isTyping) {
            if (displayText.length < tagline.length) {
                const timeout = setTimeout(() => {
                    setDisplayText(tagline.slice(0, displayText.length + 1));
                }, 40);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 2500);
                return () => clearTimeout(timeout);
            }
        } else {
            if (displayText.length > 0) {
                const timeout = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1));
                }, 25);
                return () => clearTimeout(timeout);
            } else {
                setCurrentTagline((prev) => (prev + 1) % taglines.length);
                setIsTyping(true);
            }
        }
    }, [displayText, isTyping, currentTagline]);

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            <div className="max-w-6xl mx-auto text-center z-10">
                {/* Floating badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 backdrop-blur-xl"
                    >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-gray-200">DevOps for AI Prompts & Agents</span>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20"
                    >
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-yellow-300">4.9/5 Rating</span>
                    </motion.div>
                </div>

                {/* Main headline with gradient animation */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold mb-6 leading-[1.1] tracking-tight"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                    <span className="text-white">Ship AI Features</span>
                    <br />
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text animate-gradient bg-[length:300%_auto]">
                            Like Production Code
                        </span>
                        {/* Shimmer overlay */}
                        <motion.span 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        />
                    </span>
                </motion.h1>

                {/* Typing tagline with enhanced styling */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="h-10 mb-8 flex items-center justify-center"
                >
                    <div className="px-4 py-2 rounded-lg bg-surface/50 border border-white/5 backdrop-blur-sm">
                        <span className="text-lg md:text-xl text-cyan-400 font-mono tracking-wide">
                            {'> '}{displayText}
                            <span className="animate-pulse text-cyan-300">|</span>
                        </span>
                    </div>
                </motion.div>

                {/* Description with better typography */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                >
                    PromptOps gives you <span className="text-white font-medium">version control</span>, <span className="text-white font-medium">testing</span>, <span className="text-white font-medium">deployment</span>, and <span className="text-white font-medium">monitoring</span> for your LLM prompts. Treat your AI like the production code it is.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="flex flex-wrap items-center justify-center gap-3 mb-10"
                >
                    {[
                        { icon: Zap, text: 'Instant Deployment' },
                        { icon: Shield, text: 'Enterprise Security' },
                        { icon: Users, text: 'Team Collaboration' }
                    ].map((pill, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-white/20 hover:bg-white/10 transition-all cursor-default"
                        >
                            <pill.icon className="w-4 h-4 text-indigo-400" />
                            {pill.text}
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Buttons with enhanced styling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/register">
                        <motion.button 
                            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl text-white font-semibold text-lg overflow-hidden transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Animated gradient overlay */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </motion.button>
                    </Link>
                    
                    <Link to="/login">
                        <motion.button 
                            whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-white/15 text-white font-medium text-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                        >
                            <Play className="w-5 h-5 text-cyan-400" />
                            Watch Demo
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500"
                >
                    <div className="flex -space-x-2">
                        {['🟣', '🔵', '🟢', '🟡'].map((emoji, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-sm">
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <span>Join <span className="text-white font-medium">2,500+</span> developers shipping AI</span>
                </motion.div>

                {/* Stats with animated counters */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/10"
                >
                    <AnimatedCounter value="99.9%" label="Uptime SLA" delay={0} />
                    <AnimatedCounter value="50ms" label="Avg Latency" delay={0.1} />
                    <AnimatedCounter value="10M+" label="Prompts Served" delay={0.2} />
                    <AnimatedCounter value="500+" label="Teams Trust Us" delay={0.3} />
                </motion.div>
            </div>

            {/* Enhanced floating decorative elements */}
            <motion.div
                animate={{ 
                    y: [0, -25, 0], 
                    rotate: [0, 8, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 left-8 w-24 h-24 border border-cyan-500/20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm hidden lg:block"
            />
            <motion.div
                animate={{ 
                    y: [0, 20, 0], 
                    rotate: [0, -6, 0],
                    scale: [1, 0.95, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-1/4 right-8 w-20 h-20 border border-indigo-500/20 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-sm hidden lg:block"
            />
            <motion.div
                animate={{ 
                    y: [0, -15, 0], 
                    x: [0, 10, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/3 right-1/4 w-16 h-16 border border-purple-500/20 rounded-xl bg-gradient-to-br from-purple-500/5 to-transparent backdrop-blur-sm hidden xl:block"
            />
        </section>
    );
};

export default HeroSection;
