import React from 'react';
import { PricingSection } from '../components/sections/PricingSection';

export const PricingPage: React.FC = () => {
  return (
    <div className="pt-20">
       <PricingSection />
       <div className="container mx-auto px-6 py-12 mb-20">
         <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
                { q: "Do you charge for API requests?", a: "No, we only charge for the management platform. You pay your LLM provider directly." },
                { q: "Can I host this on-premise?", a: "Yes, the Enterprise plan includes self-hosted options via Docker containers." },
                { q: "What happens if I exceed my limit?", a: "We'll alert you. We never block production requests for overages on paid plans." },
                { q: "Is there a free trial?", a: "Yes, the Startup plan comes with a 14-day free trial, no credit card required." }
            ].map((faq, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="font-bold text-lg mb-2 text-white">{faq.q}</h4>
                    <p className="text-gray-400">{faq.a}</p>
                </div>
            ))}
         </div>
       </div>
    </div>
  );
};