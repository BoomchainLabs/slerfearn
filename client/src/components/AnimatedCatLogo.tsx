import React, { useState, useEffect, useRef } from 'react';
import slerfLogo from '@/assets/slerf-logo.svg';

interface AnimatedCatLogoProps {
  size?: number;
  interval?: number;
  className?: string;
}

const AnimatedCatLogo: React.FC<AnimatedCatLogoProps> = ({
  size = 120,
  interval = 5000,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Track mouse position for eye movement
  useEffect(() => {
    const trackMouse = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate relative position (0-100)
        const relX = Math.min(100, Math.max(0, ((e.clientX - centerX) / window.innerWidth * 200) + 50));
        const relY = Math.min(100, Math.max(0, ((e.clientY - centerY) / window.innerHeight * 200) + 50));
        
        setMousePosition({ x: relX, y: relY });
      }
    };
    
    window.addEventListener('mousemove', trackMouse);
    
    return () => {
      window.removeEventListener('mousemove', trackMouse);
    };
  }, []);
  
  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      const shouldBlink = Math.random() > 0.7;
      
      if (shouldBlink) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, interval);
    
    return () => clearInterval(blinkInterval);
  }, [interval]);
  
  // Calculate eye position based on mouse
  const leftEyeStyle = {
    transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`
  };
  
  const rightEyeStyle = {
    transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Base logo */}
      <img 
        src={slerfLogo}
        alt="SLERF Cat Logo"
        className="w-full h-full"
      />
      
      {/* Left eye */}
      <div 
        className="absolute rounded-full bg-black"
        style={{ 
          width: size * 0.08, 
          height: isBlinking ? size * 0.01 : size * 0.08,
          top: size * 0.38, 
          left: size * 0.34,
          transition: isBlinking ? 'height 0.1s' : 'transform 0.1s',
          ...leftEyeStyle
        }}
      >
        {!isBlinking && (
          <div 
            className="absolute rounded-full bg-[hsl(var(--cyber-blue))]"
            style={{ 
              width: size * 0.03, 
              height: size * 0.03,
              top: size * 0.025, 
              left: size * 0.025,
            }}
          />
        )}
      </div>
      
      {/* Right eye */}
      <div 
        className="absolute rounded-full bg-black"
        style={{ 
          width: size * 0.08, 
          height: isBlinking ? size * 0.01 : size * 0.08,
          top: size * 0.38, 
          left: size * 0.58,
          transition: isBlinking ? 'height 0.1s' : 'transform 0.1s',
          ...rightEyeStyle
        }}
      >
        {!isBlinking && (
          <div 
            className="absolute rounded-full bg-[hsl(var(--cyber-blue))]"
            style={{ 
              width: size * 0.03, 
              height: size * 0.03,
              top: size * 0.025, 
              left: size * 0.025,
            }}
          />
        )}
      </div>
      
      {/* Glowing effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{ 
          boxShadow: `0 0 ${size * 0.2}px ${size * 0.1}px rgba(69, 211, 255, 0.5)`,
          animation: 'pulse 3s infinite alternate'
        }}
      />
    </div>
  );
};

export default AnimatedCatLogo;