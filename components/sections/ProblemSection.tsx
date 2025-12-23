import React from 'react';
import { AlertTriangle, GitMerge, DollarSign, Activity } from 'lucide-react';
import { Card } from '../ui/Card';

const problems = [
  {
    icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
    title: "Prompt Chaos",
    description: "Prompts scattered across codebases, Slack, and spreadsheets with no single source of truth."
  },
  {
    icon: <GitMerge className="w-8 h-8 text-red-500" />,
    title: "No Version Control",
    description: "Who changed the system prompt? When? Why did the retrieval accuracy drop 15%?"
  },
  {
    icon: <Activity className="w-8 h-8 text-yellow-500" />,
    title: "Silent Failures",
    description: "Models drift. Prompts break. You only find out when users start complaining."
  },
  {
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    title: "Cost Explosions",
    description: "Unoptimized token usage and lack of caching leading to surprising cloud bills."
  }
];

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#05050A] relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">The AI Engineering Gap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Building reliable AI applications is hard when you treat prompts like magic strings instead of software artifacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => (
            <Card key={index} delay={index * 0.1} className="hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-shadow duration-300">
              <div className="mb-4 bg-white/5 w-16 h-16 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};