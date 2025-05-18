import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cyberCatLogo from '@/assets/cyber-cat-logo.svg';

interface AnimatedCatLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  interval?: number;
  colors?: string[];
}

const AnimatedCatLogo: React.FC<AnimatedCatLogoProps> = ({
  className = "",
  size = 80,
  animated = true,
  interval = 6000,
  colors = [
    'from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-purple))]',
    'from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-teal))]',
    'from-[hsl(var(--cyber-yellow))] to-[hsl(var(--cyber-pink))]',
    'from-[hsl(var(--cyber-purple))] to-[hsl(var(--cyber-blue))]',
  ]
}) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!animated) return;
    
    // Change color gradient every interval
    const colorTimer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
      
      // Add random rotation between -20 and 20 degrees
      setRotation(Math.random() * 40 - 20);
    }, interval);
    
    return () => clearInterval(colorTimer);
  }, [animated, interval, colors.length]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={colorIndex}
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors[colorIndex]} flex items-center justify-center shadow-lg overflow-hidden`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: rotation
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            damping: 15,
            stiffness: 200
          }}
        >
          <motion.img 
            src={cyberCatLogo} 
            alt="Cyber Cat" 
            className="w-[80%] h-[80%] object-contain"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
          />
          
          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r opacity-30 animate-pulse" 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${colorIndex === 0 ? '#ff00ea' : colorIndex === 1 ? '#00e1ff' : colorIndex === 2 ? '#ffbb00' : '#953bff'}, ${colorIndex === 0 ? '#953bff' : colorIndex === 1 ? '#26ff7b' : colorIndex === 2 ? '#ff00ea' : '#00e1ff'})`,
              animationDuration: '3s'
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedCatLogo;