import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, Building2, ArrowRight } from 'lucide-react';

interface PricingTier {
    name: string;
    description: string;
    monthlyPrice: number | null;
    yearlyPrice: number | null;
    priceLabel?: string;
    icon: React.FC<{ className?: string }>;
    features: string[];
    highlighted?: boolean;
    cta: string;
    gradient: string;
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Free',
        description: 'Perfect for exploring and personal projects',
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: Sparkles,
        features: [
            'Up to 5 prompts',
            '1,000 API calls/month',
            'Single environment',
            'Basic analytics',
            'Community support',
            '7-day version history'
        ],
        cta: 'Start Free',
        gradient: 'from-gray-500 to-gray-600'
    },
    {
        name: 'Pro',
        description: 'For teams shipping production AI features',
        monthlyPrice: 49,
        yearlyPrice: 39,
        icon: Zap,
        features: [
            'Unlimited prompts',
            '100,000 API calls/month',
            'Multi-environment deploy',
            'A/B testing & experiments',
            'Advanced analytics',
            'Priority support',
            '90-day version history',
            'Team collaboration (5 seats)',
            'Custom model integrations'
        ],
        highlighted: true,
        cta: 'Start Free Trial',
        gradient: 'from-indigo-500 to-cyan-500'
    },
    {
        name: 'Enterprise',
        description: 'Custom solutions for large organizations',
        monthlyPrice: null,
        yearlyPrice: null,
        priceLabel: 'Custom',
        icon: Building2,
        features: [
            'Everything in Pro',
            'Unlimited API calls',
            'Unlimited team seats',
            'SSO & SAML',
            'Dedicated support',
            'Custom SLAs',
            'On-premise deployment',
            'Audit logs & compliance',
            'Custom integrations'
        ],
        cta: 'Contact Sales',
        gradient: 'from-purple-500 to-pink-500'
    }
];

const PricingCard: React.FC<{ tier: PricingTier; isYearly: boolean; index: number }> = ({ tier, isYearly, index }) => {
    const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`relative group ${tier.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}`}
        >
            {/* Glow effect for highlighted */}
            {tier.highlighted && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            )}
            
            {/* Popular badge */}
            {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full text-sm font-semibold text-white shadow-lg">
                        Most Popular
                    </div>
                </div>
            )}
            
            <div className={`relative h-full flex flex-col p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                tier.highlighted 
                    ? 'bg-surface/90 border-white/20' 
                    : 'bg-surface/60 border-white/10 hover:border-white/20'
            }`}>
                {/* Header */}
                <div className="mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} p-0.5 mb-4`}>
                        <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
                            <tier.icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {tier.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{tier.description}</p>
                </div>
                
                {/* Price */}
                <div className="mb-8">
                    {price !== null ? (
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                ${price}
                            </span>
                            <span className="text-gray-400">/month</span>
                        </div>
                    ) : (
                        <div className="text-4xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {tier.priceLabel}
                        </div>
                    )}
                    {isYearly && price !== null && price > 0 && (
                        <div className="text-sm text-cyan-400 mt-1">
                            Save ${(tier.monthlyPrice! - tier.yearlyPrice!) * 12}/year
                        </div>
                    )}
                </div>
                
                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + i * 0.05 }}
                            className="flex items-start gap-3 text-gray-300 text-sm"
                        >
                            <Check className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-cyan-400' : 'text-gray-500'}`} />
                            {feature}
                        </motion.li>
                    ))}
                </ul>
                
                {/* CTA Button */}
                <Link to={tier.name === 'Enterprise' ? '#contact' : '/register'}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                            tier.highlighted
                                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                    >
                        {tier.cta}
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
};

export const PricingSection: React.FC = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="relative z-10 py-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4"
                    >
                        Simple Pricing
                    </motion.span>
                    <h2 
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        <span className="text-white">Start Free,</span>{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                            Scale as You Grow
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-lg">
                        No credit card required. Upgrade anytime as your AI features grow.
                    </p>
                </motion.div>

                {/* Billing toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-4 mb-12"
                >
                    <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                            isYearly ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' : 'bg-gray-700'
                        }`}
                    >
                        <motion.div
                            animate={{ x: isYearly ? 28 : 4 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                        />
                    </button>
                    <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                        Yearly
                    </span>
                    {isYearly && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/20">
                            Save 20%
                        </span>
                    )}
                </motion.div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
                    {pricingTiers.map((tier, index) => (
                        <PricingCard key={tier.name} tier={tier} isYearly={isYearly} index={index} />
                    ))}
                </div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-500 text-sm mt-12"
                >
                    All plans include SSL encryption, 99.9% uptime SLA, and GDPR compliance.
                </motion.p>
            </div>
        </section>
    );
};

export default PricingSection;
