import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '../ui/Button';
import { Menu, X, Command } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Solution', path: '/solution' },
    { name: 'Docs', path: '/docs' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-[#05050A]/80 backdrop-blur-md border-white/10 py-3 shadow-lg" 
          : "bg-transparent border-transparent py-6"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link 
            to="/" 
            className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-shadow">
             <Command className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            PromptOps
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors relative",
                location.pathname === item.path ? "text-cyan-400" : "text-gray-400 hover:text-white"
              )}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div 
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400" 
                />
              )}
            </Link>
          ))}
          <div className="h-6 w-px bg-white/10 mx-2" />
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate('/dashboard')}>
            Get Access
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-[#05050A] border-b border-white/10 overflow-hidden"
        >
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={cn(
                    "py-2 text-lg font-medium border-b border-white/5",
                    location.pathname === item.path ? "text-cyan-400" : "text-gray-300"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Button variant="secondary" className="w-full" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>Sign In</Button>
              <Button className="w-full" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>
                  Get Access
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};