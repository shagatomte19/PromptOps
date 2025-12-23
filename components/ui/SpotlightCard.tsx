import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className, delay = 0 }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-glass backdrop-blur-md px-8 py-8 shadow-2xl",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6,182,212,0.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6,182,212,0.4), transparent 40%)`,
          maskImage: `radial-gradient(600px circle at ${position.x}px ${position.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(600px circle at ${position.x}px ${position.y}px, black, transparent)`,
          // Use a border-box approach for the border spotlight
          zIndex: 1
        }}
      >
          <div className="absolute inset-0 border border-cyan-500/50 rounded-xl" />
      </div>
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};