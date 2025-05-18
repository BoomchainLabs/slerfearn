import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import cyberCatLogo from '@/assets/cyber-cat-logo.svg';

interface AnimatedCatLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  interval?: number;
  colors?: string[];
  interactive?: boolean;
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
  ],
  interactive = true
}) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isWinking, setIsWinking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [randomEyeMovement, setRandomEyeMovement] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track cursor movement
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
        
        eyeControls.start({
          x: [0, randomX, 0],
          y: [0, randomY, 0],
          transition: { duration: 1.5, ease: "easeInOut" }
        });
      }
      
    }, interval);
    
    // Occasional random eye movements
    const blinkTimer = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 150);
    }, 5000 + Math.random() * 5000);
    
    return () => {
      clearInterval(colorTimer);
      clearInterval(blinkTimer);
    };
  }, [animated, interval, colors.length, eyeControls]);

  // Custom SVG for interactive cat with animated eyes
  const CatSvg = () => (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="catGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor={colorIndex === 0 ? '#ff00ea' : colorIndex === 1 ? '#00e1ff' : colorIndex === 2 ? '#ffbb00' : '#953bff'} offset="0%"></stop>
          <stop stopColor={colorIndex === 0 ? '#953bff' : colorIndex === 1 ? '#26ff7b' : colorIndex === 2 ? '#ff00ea' : '#00e1ff'} offset="100%"></stop>
        </linearGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#00FFFF" stopOpacity="1"/>
          <stop offset="100%" stopColor="#00FFFF" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      {/* Cat face and outline */}
      <path 
        fill="url(#catGradient)" 
        d="M50,0 C22.386,0 0,22.386 0,50 C0,77.614 22.386,100 50,100 C77.614,100 100,77.614 100,50 C100,22.386 77.614,0 50,0 Z M83.333,25 L70.833,27.083 L70.833,35.417 L83.333,33.333 L83.333,25 Z M16.667,25 L16.667,33.333 L29.167,35.417 L29.167,27.083 L16.667,25 Z M50,25 C61.506,25 70.833,34.327 70.833,45.833 C70.833,57.34 61.506,66.667 50,66.667 C38.494,66.667 29.167,57.34 29.167,45.833 C29.167,34.327 38.494,25 50,25 Z M27.083,54.167 L18.75,62.5 L27.083,70.833 L35.417,62.5 L27.083,54.167 Z M72.917,54.167 L64.583,62.5 L72.917,70.833 L81.25,62.5 L72.917,54.167 Z M50,70.833 L43.75,77.083 L37.5,70.833 L33.333,75 L37.5,79.167 L43.75,85.417 L50,79.167 L56.25,85.417 L62.5,79.167 L66.667,75 L62.5,70.833 L56.25,77.083 L50,70.833 Z"
      />
      
      {/* Eye sockets */}
      <circle fill="#220033" cx="35.417" cy="37.5" r="8.333" />
      <circle fill="#220033" cx="64.583" cy="37.5" r="8.333" />
      
      {/* Eye glow effects */}
      <circle fill="url(#eyeGlow)" cx="35.417" cy="37.5" r="6.5" opacity="0.7" />
      <circle fill="url(#eyeGlow)" cx="64.583" cy="37.5" r="6.5" opacity="0.7" />
      
      {/* Left eye with animations */}
      <motion.g
        animate={{
          x: isWinking ? 0 : eyePosition.x + eyeControls.x,
          y: isWinking ? 0 : eyePosition.y + eyeControls.y
        }}
      >
        <circle 
          fill="#00FFFF" 
          cx="35.417" 
          cy="37.5" 
          r={isWinking ? 0.5 : 4.167} 
          style={{
            transition: isWinking ? 'r 0.1s ease-out' : 'r 0.2s ease-in'
          }}
        />
        <circle 
          fill="#000000" 
          cx="35.417" 
          cy="37.5" 
          r={isWinking ? 0.2 : 2} 
          style={{
            transition: isWinking ? 'r 0.1s ease-out' : 'r 0.2s ease-in'
          }}
        />
      </motion.g>
      
      {/* Right eye with animations */}
      <motion.g
        animate={{
          x: eyePosition.x + eyeControls.x,
          y: eyePosition.y + eyeControls.y
        }}
      >
        <circle 
          fill="#00FFFF" 
          cx="64.583" 
          cy="37.5" 
          r="4.167" 
        />
        <circle 
          fill="#000000" 
          cx="64.583" 
          cy="37.5" 
          r="2" 
        />
      </motion.g>
    </svg>
  );

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
          {/* Custom SVG with interactive eyes */}
          <CatSvg />
          
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