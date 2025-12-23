import React from 'react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { History, Split, RotateCcw, Box, LineChart, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <History className="w-6 h-6 text-blue-400" />,
    title: "Semantic Versioning",
    desc: "Track every change. Diff versions. Branch and merge prompt changes just like git."
  },
  {
    icon: <Split className="w-6 h-6 text-violet-400" />,
    title: "A/B Testing",
    desc: "Run variants in production to 1% of traffic. Measure conversion, not just accuracy."
  },
  {
    icon: <RotateCcw className="w-6 h-6 text-red-400" />,
    title: "Instant Rollback",
    desc: "Bad deployment? Revert to the previous stable prompt version in < 100ms."
  },
  {
    icon: <Box className="w-6 h-6 text-amber-400" />,
    title: "Environment Separation",
    desc: "Dev, Staging, Prod. Keep your experiments isolated from paying customers."
  },
  {
    icon: <LineChart className="w-6 h-6 text-emerald-400" />,
    title: "Cost Tracking",
    desc: "Real-time dashboard for token usage and costs per model, per prompt, per user."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    title: "Audit Logs",
    desc: "Enterprise-grade compliance. Know exactly who pushed what prompt and when."
  }
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#05050A] scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Everything you need to <br/> scale AI in production</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <SpotlightCard key={idx} delay={idx * 0.05}>
              <div className="flex flex-col h-full">
                <div className="mb-6 p-3 bg-white/5 w-fit rounded-lg border border-white/5 group-hover:bg-cyan-500/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};