import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { SpotlightCard } from '../ui/SpotlightCard';

const tiers = [
  {
    name: "Hacker",
    price: "$0",
    description: "For side projects and experiments.",
    features: [
      "1 User",
      "2,000 Prompts / mo",
      "Basic Version History",
      "Community Support",
      "1 Environment"
    ],
    notIncluded: ["A/B Testing", "SSO", "SLA"],
    cta: "Start for Free",
    popular: false
  },
  {
    name: "Startup",
    price: "$49",
    period: "/mo",
    description: "For growing teams building production AI.",
    features: [
      "5 Users",
      "Unlimited Prompts",
      "Advanced Version Control",
      "A/B Testing",
      "3 Environments (Dev, Stage, Prod)",
      "Priority Support"
    ],
    notIncluded: ["SSO", "SLA"],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with strict compliance.",
    features: [
      "Unlimited Users",
      "Unlimited Prompts",
      "SSO & SAML",
      "Audit Logs",
      "99.9% Uptime SLA",
      "VPC Peering",
      "Dedicated Success Manager"
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false
  }
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-[#05050A] relative scroll-mt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Simple, transparent pricing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Start free, upgrade when you hit product-market fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <SpotlightCard 
                key={index} 
                className={`flex flex-col ${tier.popular ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.15)]' : ''}`}
                delay={index * 0.1}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
                  POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-white">{tier.price}</span>
                  {tier.period && <span className="text-gray-400">{tier.period}</span>}
                </div>
                <p className="text-gray-400 text-sm mt-4">{tier.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    {feature}
                  </div>
                ))}
                {tier.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3 text-gray-600" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.popular ? 'primary' : 'secondary'} 
                className="w-full"
                onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {tier.cta}
              </Button>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};