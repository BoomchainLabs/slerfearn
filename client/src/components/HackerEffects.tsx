import React, { useState, useEffect, useRef } from 'react';

export const MatrixRain: React.FC<{ 
  className?: string, 
  density?: number, 
  speed?: number, 
  fontSize?: number,
  opacity?: number
}> = ({
  className = "",
  density = 25,
  speed = 25,
  fontSize = 12,
  opacity = 0.05
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const columns = Math.floor(canvas.width / fontSize);
    
    // Initialize an array for the y-coordinate of each column drop
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start above the canvas at random positions
    }
    
    // Drawing function
    const draw = () => {
      // Apply a semi-transparent black fill to fade out previous characters
      context.fillStyle = `rgba(0, 0, 0, ${1 - opacity})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set the color and font for the characters
      context.fillStyle = '#0F0'; // Matrix green
      context.font = `${fontSize}px monospace`;
      
      // For each column
      for (let i = 0; i < drops.length; i++) {
        // Pick a random character from the array
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // Draw the character
        context.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Move the drop down
        drops[i]++;
        
        // Reset the drop to the top after it passes the bottom of the canvas
        // or randomly reset some drops
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
    };
    
    // Set up the animation loop
    const interval = setInterval(draw, speed);
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [fontSize, speed, opacity, density]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};

export const GlitchText: React.FC<{
  text: string;
  className?: string;
  glitchInterval?: number;
  glitchDuration?: number;
  active?: boolean;
}> = ({
  text,
  className = "",
  glitchInterval = 3000,
  glitchDuration = 200,
  active = true
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    if (!active) return;
    
    const glitchChars = "!<>-_\\/[]{}—=+*^?#$%&@";
    
    const createGlitchedText = () => {
      return text.split('').map(char => {
        return Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char;
      }).join('');
    };
    
    const intervalId = setInterval(() => {
      setIsGlitching(true);
      
      // Rapid changes during glitch period
      const glitchId = setInterval(() => {
        setDisplayText(createGlitchedText());
      }, 50);
      
      // End glitch after duration
      setTimeout(() => {
        clearInterval(glitchId);
        setDisplayText(text);
        setIsGlitching(false);
      }, glitchDuration);
      
    }, glitchInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [text, active, glitchInterval, glitchDuration]);
  
  return (
    <span className={`inline-block ${isGlitching ? 'text-[hsl(var(--cyber-pink))]' : ''} ${className}`}>
      {displayText}
    </span>
  );
};

export const HackerTerminal: React.FC<{
  className?: string;
  lines?: string[];
  typingSpeed?: number;
  children?: React.ReactNode;
}> = ({
  className = "",
  lines = [],
  typingSpeed = 30,
  children
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      return;
    }
    
    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIndex) {
            newLines.push('');
          }
          newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, typingSpeed);
      
      return () => clearTimeout(typingTimeout);
    } else {
      // Line complete, move to next line
      const nextLineTimeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, typingSpeed * 5);
      
      return () => clearTimeout(nextLineTimeout);
    }
  }, [currentLineIndex, currentCharIndex, lines, typingSpeed]);
  
  return (
    <div className={`font-mono text-sm bg-black/80 text-green-500 p-4 rounded-md overflow-auto ${className}`}>
      {displayedLines.map((line, index) => (
        <div key={index} className="mb-1">
          <span className="text-cyan-400">{">"}</span> {line}
        </div>
      ))}
      {!isTyping && children}
    </div>
  );
};

export const CyberFrame: React.FC<{
  className?: string;
  children: React.ReactNode;
  title?: string;
  glowing?: boolean;
  cornerAccents?: boolean;
}> = ({
  className = "",
  children,
  title,
  glowing = true,
  cornerAccents = true
}) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${glowing ? 'shadow-glow' : ''} ${className}`}>
      {/* Border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--cyber-blue))] via-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-purple))] opacity-80"></div>
      
      {/* Inner content */}
      <div className="relative bg-black/90 m-0.5 rounded-md">
        {/* Title bar */}
        {title && (
          <div className="bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-purple))] px-3 py-1 flex items-center justify-between">
            <span className="font-audiowide text-xs text-white">{title}</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
        )}
        
        {/* Corner accents */}
        {cornerAccents && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[hsl(var(--cyber-blue))]"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[hsl(var(--cyber-pink))]"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[hsl(var(--cyber-purple))]"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[hsl(var(--cyber-teal))]"></div>
          </>
        )}
        
        {/* Content */}
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

// Export default component with all effects
const HackerEffects = {
  MatrixRain,
  GlitchText,
  HackerTerminal,
  CyberFrame
};

export default HackerEffects;