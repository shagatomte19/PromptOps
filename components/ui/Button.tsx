import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const baseStyles = "font-display font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-transparent",
    secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10",
    outline: "bg-transparent border border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.button>
  );
};