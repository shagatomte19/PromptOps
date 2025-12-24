import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    GitBranch,
    Layers,
    FlaskConical,
    Activity,
    Zap,
    Shield,
    Code2,
    Box,
    ArrowRight,
    Github,
    Twitter,
    Mail,
    ChevronRight
} from 'lucide-react';

import { AnimatedBackground } from '@/components/landing/AnimatedBackground';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { MockupPreview } from '@/components/landing/MockupPreview';
import { PricingSection } from '@/components/landing/PricingSection';
import { Button } from '@/components/ui/Button';

const features = [
    {
        icon: GitBranch,
        title: 'Version Control',
        description: 'Git-like version control for your prompts. Track changes, compare diffs, and rollback instantly.',
        gradient: 'from-violet-500 to-purple-500'
    },
    {
        icon: Layers,
        title: 'Multi-Environment',
        description: 'Deploy to dev, staging, and production independently. No more copy-pasting prompts.',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: FlaskConical,
        title: 'A/B Testing',
        description: 'Run experiments with traffic splitting. Get statistical significance for your prompt changes.',
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Activity,
        title: 'Real-time Monitoring',
        description: 'Track latency, costs, tokens, and success rates. Know exactly how your AI is performing.',
        gradient: 'from-orange-500 to-amber-500'
    },
    {
        icon: Zap,
        title: 'Streaming Inference',
        description: 'Execute prompts with SSE streaming. Build responsive AI experiences for your users.',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        icon: Shield,
        title: 'Audit Logging',
        description: 'Full audit trail of all operations. Know who changed what and when.',
        gradient: 'from-indigo-500 to-blue-500'
    }
];

const integrations = [
    { name: 'OpenAI', icon: '🤖' },
    { name: 'Gemini', icon: '✨' },
    { name: 'Claude', icon: '🎭' },
    { name: 'Mistral', icon: '🌬️' },
    { name: 'LLaMA', icon: '🦙' },
    { name: 'Cohere', icon: '🔗' }
];

const trustedCompanies = [
    'Stripe', 'Notion', 'Linear', 'Vercel', 'Supabase', 'Railway'
];

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-white relative overflow-hidden">
            {/* Animated 3D Background */}
            <AnimatedBackground />

            {/* Navigation */}
            <nav className="relative z-20 px-6 py-4 backdrop-blur-sm border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Box className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        <span className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>PromptOps</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                            Features
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all" />
                        </a>
                        <a href="#demo" className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                            Demo
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all" />
                        </a>
                        <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                            Pricing
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all" />
                        </a>
                        <a href="#integrations" className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                            Integrations
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all" />
                        </a>
                        <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Log In
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 text-gray-400 hover:text-white">
                        <Code2 className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection />

            {/* Trusted By Section */}
            <section className="relative z-10 py-12 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-sm text-gray-500 mb-6"
                    >
                        Trusted by innovative teams at
                    </motion.p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {trustedCompanies.map((company, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="text-xl font-semibold text-gray-600 hover:text-gray-400 transition-colors cursor-default"
                                style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
                                {company}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4"
                        >
                            Powerful Features
                        </motion.span>
                        <h2 
                            className="text-4xl md:text-5xl font-bold mb-4"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                            Everything You Need for
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                                {' '}Production AI
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto text-lg">
                            Stop treating prompts like config files. Give them the infrastructure they deserve.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard
                                key={i}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                gradient={feature.gradient}
                                delay={i * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="relative z-10">
                <MockupPreview />
            </section>

            {/* Pricing Section */}
            <PricingSection />

            {/* Integrations Section */}
            <section id="integrations" className="relative z-10 py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4"
                        >
                            Integrations
                        </motion.span>
                        <h2 
                            className="text-4xl md:text-5xl font-bold mb-4"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                            Works With Your Stack
                        </h2>
                        <p className="text-gray-400 mb-12 text-lg">
                            Connect to any LLM provider. Swap models without changing your code.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {integrations.map((integration, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.08, y: -3 }}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-white/25 hover:bg-white/10 transition-all cursor-default"
                            >
                                <span className="text-2xl">{integration.icon}</span>
                                <span className="text-base font-medium">{integration.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 opacity-90" />
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        <div className="relative px-8 py-20 text-center">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-bold mb-6"
                                style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
                                Ready to Ship AI Like a Pro?
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-white/85 mb-10 max-w-xl mx-auto text-lg"
                            >
                                Join thousands of teams using PromptOps to version, test, and deploy their AI features with confidence.
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Start Free Trial
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <a 
                                    href="https://github.com/promptops"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-4 text-white/90 hover:text-white transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                    Star on GitHub
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Box className="w-7 h-7 text-cyan-400" />
                                <span className="font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>PromptOps</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">
                                The infrastructure layer for production AI. Version, test, and deploy your prompts with confidence.
                            </p>
                            <div className="flex items-center gap-3">
                                <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <Mail className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-3">
                                {['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                            <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Resources</h4>
                            <ul className="space-y-3">
                                {['Documentation', 'API Reference', 'Blog', 'Tutorials', 'Community'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                            <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-3">
                                {['About', 'Careers', 'Privacy', 'Terms', 'Contact'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                            <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2024 PromptOps. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-sm">
                            Built with ❤️ for the AI community
                        </p>
                    </div>
                </div>
            </footer>

            {/* Speed lines decoration */}
            <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />
        </div>
    );
};

export default LandingPage;
