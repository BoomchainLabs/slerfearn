import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import slerfLogo from '@/assets/slerf-logo.svg';

interface SLERFAnimatedLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  interval?: number;
  colors?: string[];
  interactive?: boolean;
}

const SLERFAnimatedLogo: React.FC<SLERFAnimatedLogoProps> = ({
  className = "",
  size = 80,
  animated = true,
  interval = 6000,
  colors = [
    'from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-purple))]',
    'from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-teal))]',
    'from-[hsl(var(--cyber-yellow))] to-[hsl(var(--cyber-pink))]',
    'from-[hsl(var(--cyber-purple))] to-[hsl(var(--cyber-blue))]',
  ],
  interactive = true
}) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isWinking, setIsWinking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [randomEyeMovement, setRandomEyeMovement] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track cursor movement for eye following
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Get container position
      const rect = containerRef.current.getBoundingClientRect();
      const containerCenterX = rect.left + rect.width / 2;
      const containerCenterY = rect.top + rect.height / 2;
      
      // Calculate relative position (-1 to 1 range)
      const maxDistance = Math.min(rect.width, rect.height) * 0.2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - containerCenterX) / maxDistance));
      const dy = Math.max(-1, Math.min(1, (e.clientY - containerCenterY) / maxDistance));
      
      // Update eye position
      setEyePosition({ x: dx * 3, y: dy * 3 });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);
  
  // Eye animations and color changes
  useEffect(() => {
    if (!animated) return;
    
    // Change color gradient every interval
    const colorTimer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
      
      // Add random rotation between -15 and 15 degrees
      setRotation(Math.random() * 30 - 15);
      
      // Random eye animations
      const randomEyeAction = Math.random();
      if (randomEyeAction < 0.3) {
        // Wink animation
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 300);
      } else if (randomEyeAction < 0.6) {
        // Look around animation
        const randomX = Math.random() * 6 - 3;
        const randomY = Math.random() * 6 - 3;
        
        setRandomEyeMovement({
          x: randomX,
          y: randomY
        });
        
        // Reset after animation
        setTimeout(() => {
          setRandomEyeMovement({ x: 0, y: 0 });
        }, 1500);
      }
      
    }, interval);
    
    // Occasional random eye movements - blink every 3-8 seconds
    const blinkTimer = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 150);
    }, 3000 + Math.random() * 5000);
    
    return () => {
      clearInterval(colorTimer);
      clearInterval(blinkTimer);
    };
  }, [animated, interval, colors.length]);

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
      ref={containerRef}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={colorIndex}
          className="absolute inset-0 rounded-full bg-black flex items-center justify-center shadow-lg overflow-hidden"
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
          {/* SLERF Logo Image */}
          <img
            src={slerfLogo}
            alt="SLERF Logo"
            className="w-full h-full"
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

export default SLERFAnimatedLogo;