import React from 'react';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { History, Split, RotateCcw, Box, LineChart, ShieldCheck, Terminal, Cpu, Network } from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  { icon: History, title: "Semantic Versioning", desc: "Every prompt change is a commit. Tag versions (v1.0.2), rollback instantly, and maintain a changelog automatically." },
  { icon: Split, title: "A/B Testing Engine", desc: "Split traffic between multiple prompt variants. Compare performance on real production data with statistical significance." },
  { icon: RotateCcw, title: "Instant Rollback", desc: "Did a new prompt break the bot? Revert to the last stable version in < 100ms via our edge API." },
  { icon: Box, title: "Environment Management", desc: "Isolate Development, Staging, and Production. Promote prompts through environments with approval gates." },
  { icon: LineChart, title: "Cost & Latency Monitoring", desc: "Real-time dashboards showing token usage, cost per request, and P99 latency across all your models." },
  { icon: ShieldCheck, title: "Compliance & Auditing", desc: "Enterprise-ready audit logs. See exactly who changed a prompt, when, and why. SOC2 compliant infrastructure." },
  { icon: Terminal, title: "CLI & API First", desc: "Integrate into your existing CI/CD. Use `promptops deploy` to push changes from your local editor." },
  { icon: Cpu, title: "Model Agnostic", desc: "Switch between OpenAI, Anthropic, or open-source models without changing your application code." },
  { icon: Network, title: "Edge Caching", desc: "Prompts are cached at the edge for sub-millisecond retrieval times globally." },
];

export const FeaturesPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl font-display font-bold mb-6">Built for the <span className="text-cyan-400">AI Engineer</span></h1>
        <p className="text-xl text-gray-400">
          PromptOps Cloud provides the missing infrastructure layer for Generative AI applications. 
          Stop hardcoding strings and start managing intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <SpotlightCard key={i} delay={i * 0.05} className="h-full">
            <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <f.icon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
          </SpotlightCard>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 rounded-2xl p-12 border border-white/10 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to upgrade your workflow?</h2>
        <Button size="lg">Get Started for Free</Button>
      </div>
    </div>
  );
};