import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

export const CTA: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus('success');
        setEmail('');
    };

  return (
    <section id="cta" className="py-32 relative overflow-hidden bg-[#05050A]">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-lg shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Ready to stabilize your <br />
            AI stack?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join 5,000+ developers shipping reliable AI agents. 
            Get early access to the platform today.
          </p>

          <div className="max-w-md mx-auto h-16">
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                     <motion.div 
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2 text-green-400 font-medium h-full bg-green-400/10 rounded-lg border border-green-400/20"
                     >
                        <CheckCircle className="w-5 h-5" />
                        <span>You're on the list! We'll be in touch soon.</span>
                     </motion.div>
                ) : (
                    <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col sm:flex-row gap-4 h-full" 
                        onSubmit={handleSubmit}
                    >
                        <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your work email" 
                        disabled={status === 'loading'}
                        className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                        />
                        <Button className="whitespace-nowrap w-full sm:w-auto min-w-[140px]" disabled={status === 'loading'}>
                            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Early Access"}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required. Free tier available for hackers.
          </p>
        </motion.div>
      </div>
    </section>
  );
};