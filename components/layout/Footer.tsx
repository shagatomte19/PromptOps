import React from 'react';
import { Command, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020205] border-t border-white/5 py-12 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                 <Command className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg">PromptOps</span>
            </div>
            <p className="text-gray-500 leading-relaxed mb-4">
              The first DevOps platform designed specifically for the era of generative AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-white/5 pt-8 text-center text-gray-600">
          &copy; {new Date().getFullYear()} PromptOps Cloud Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};