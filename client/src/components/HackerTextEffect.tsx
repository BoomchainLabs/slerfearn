import React, { useState, useEffect } from 'react';

interface HackerTextEffectProps {
  text: string;
  className?: string;
  speed?: number;
  glitchProbability?: number;
}

const HackerTextEffect: React.FC<HackerTextEffectProps> = ({
  text,
  className = "",
  speed = 50,
  glitchProbability = 0.03
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Characters used for the glitch effect
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';

  // Function to generate a random character from the glitch set
  const getRandomGlitchChar = () => {
    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
  };

  // Function to decide whether to show a glitch at a specific position
  const shouldGlitch = () => {
    return Math.random() < glitchProbability;
  };

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setIsComplete(false);
    
    // If text is empty, do nothing
    if (!text) return;

    let currentIndex = 0;
    let intervalId: number;

    // Start the animation only once the component is mounted
    const timeoutId = setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (currentIndex < text.length) {
          // Add the next character to the display text
          setDisplayText(prevText => {
            // If the animation is still in progress, occasionally add a glitch character
            if (shouldGlitch() && !isComplete) {
              return prevText + getRandomGlitchChar();
            } else {
              return text.substring(0, currentIndex + 1);
            }
          });
          
          currentIndex++;
        } else {
          // Animation is complete
          clearInterval(intervalId);
          setIsComplete(true);
          setDisplayText(text); // Ensure final text is correct without glitches
        }
      }, speed);
    }, 500); // Short delay before starting

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, glitchProbability]);

  return <span className={className}>{displayText}</span>;
};

export default HackerTextEffect;