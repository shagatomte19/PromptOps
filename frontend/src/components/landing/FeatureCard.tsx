import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient?: string;
    delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
    gradient = 'from-indigo-500 to-cyan-500',
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ scale: 1.03, y: -8 }}
            className="group relative"
        >
            {/* Animated glow effect on hover */}
            <motion.div 
                className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur-lg`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.4 }}
                transition={{ duration: 0.3 }}
            />
            
            {/* Card content */}
            <div className="relative bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl p-7 h-full transition-all duration-300 group-hover:border-white/25 group-hover:bg-surface/95">
                {/* Icon container with rotation on hover */}
                <motion.div 
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} p-0.5 mb-5`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                </motion.div>
                
                {/* Title with gradient on hover */}
                <h3 
                    className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                    {title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {description}
                </p>
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div 
                        className={`absolute top-5 right-5 w-1 h-10 bg-gradient-to-b ${gradient} rounded-full`}
                        initial={{ scaleY: 0 }}
                        whileHover={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                        className={`absolute top-5 right-5 w-10 h-1 bg-gradient-to-r ${gradient} rounded-full`}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    />
                </div>

                {/* Bottom shimmer line */}
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden rounded-b-2xl">
                    <motion.div
                        className={`h-full bg-gradient-to-r ${gradient}`}
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.8 }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureCard;
