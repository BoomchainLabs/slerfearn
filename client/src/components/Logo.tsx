import React from 'react';

export const Web3LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C3FF" />
          <stop offset="100%" stopColor="#953BFF" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <polygon 
        points="32,4 60,18 60,46 32,60 4,46 4,18" 
        fill="rgba(0,0,0,0.5)" 
        stroke="url(#logoGradient)" 
        strokeWidth="1.5"
      />
      <polygon 
        points="32,10 52,20 52,40 32,50 12,40 12,20" 
        fill="url(#logoGradient)" 
        fillOpacity="0.3"
        filter="url(#glow)"
      />
      <path 
        d="M21,26 L21,38 L25,40 L25,28 L31,32 L37,28 L37,40 L41,38 L41,26 L32,32 L21,26Z" 
        fill="white" 
      />
      <circle 
        cx="32" 
        cy="32" 
        r="16" 
        fill="transparent" 
        stroke="white" 
        strokeWidth="0.5" 
        strokeDasharray="1 2"
      />
    </svg>
  );
};

export const TokenLogo: React.FC<{ className?: string, symbol?: string }> = ({ 
  className = "w-8 h-8",
  symbol = "W3" 
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C3FF" />
            <stop offset="100%" stopColor="#953BFF" />
          </linearGradient>
          <filter id="tokenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle 
          cx="32" 
          cy="32" 
          r="30" 
          fill="url(#tokenGradient)" 
        />
        <circle 
          cx="32" 
          cy="32" 
          r="28" 
          fill="rgba(0,0,0,0.5)" 
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />
        <circle 
          cx="32" 
          cy="32" 
          r="25" 
          fill="url(#tokenGradient)" 
          fillOpacity="0.3"
          filter="url(#tokenGlow)"
        />
      </svg>
      <span className="absolute text-white font-orbitron font-bold text-xs">{symbol}</span>
    </div>
  );
};

export const BlockchainLogo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C3FF" />
            <stop offset="50%" stopColor="#953BFF" />
            <stop offset="100%" stopColor="#26FF7B" />
          </linearGradient>
          <filter id="chainGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Blockchain network visualization */}
        <g filter="url(#chainGlow)">
          {/* Central node */}
          <circle cx="50" cy="50" r="10" fill="url(#chainGradient)" />
          
          {/* Connecting nodes */}
          <circle cx="20" cy="30" r="6" fill="url(#chainGradient)" fillOpacity="0.9" />
          <circle cx="75" cy="25" r="6" fill="url(#chainGradient)" fillOpacity="0.9" />
          <circle cx="80" cy="65" r="6" fill="url(#chainGradient)" fillOpacity="0.9" />
          <circle cx="30" cy="80" r="6" fill="url(#chainGradient)" fillOpacity="0.9" />
          <circle cx="15" cy="60" r="4" fill="url(#chainGradient)" fillOpacity="0.7" />
          <circle cx="40" cy="15" r="4" fill="url(#chainGradient)" fillOpacity="0.7" />
          <circle cx="85" cy="45" r="4" fill="url(#chainGradient)" fillOpacity="0.7" />
          <circle cx="60" cy="85" r="4" fill="url(#chainGradient)" fillOpacity="0.7" />
          
          {/* Connection lines */}
          <line x1="50" y1="50" x2="20" y2="30" stroke="url(#chainGradient)" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="50" y1="50" x2="75" y2="25" stroke="url(#chainGradient)" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="50" y1="50" x2="80" y2="65" stroke="url(#chainGradient)" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="50" y1="50" x2="30" y2="80" stroke="url(#chainGradient)" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="20" y1="30" x2="40" y2="15" stroke="url(#chainGradient)" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="75" y1="25" x2="85" y2="45" stroke="url(#chainGradient)" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="80" y1="65" x2="60" y2="85" stroke="url(#chainGradient)" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="30" y1="80" x2="15" y2="60" stroke="url(#chainGradient)" strokeWidth="1" strokeOpacity="0.5" />
          
          {/* Blockchain data flow animation */}
          <circle cx="35" cy="40" r="1.5" fill="white">
            <animateMotion
              path="M0,0 L30,10"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="65" cy="40" r="1.5" fill="white">
            <animateMotion
              path="M0,0 L-15,25"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="40" cy="65" r="1.5" fill="white">
            <animateMotion
              path="M0,0 L10,-30"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Hexagon border */}
        <polygon 
          points="50,10 90,30 90,70 50,90 10,70 10,30" 
          fill="transparent" 
          stroke="url(#chainGradient)" 
          strokeWidth="2"
          strokeOpacity="0.7"
        />
      </svg>
    </div>
  );
};