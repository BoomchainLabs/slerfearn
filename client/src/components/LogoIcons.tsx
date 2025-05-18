import React from 'react';

export const Web3Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className || 'w-8 h-8'} rounded-full bg-gradient-to-r from-cyan-500 to-purple-600`}>
      <span className="font-orbitron text-white text-xs font-bold">W3</span>
    </div>
  );
};

export const TokenIcon: React.FC<{ className?: string, symbol?: string }> = ({ 
  className,
  symbol = "W3" 
}) => {
  return (
    <div className={`flex items-center justify-center ${className || 'w-8 h-8'} rounded-full bg-gradient-to-r from-cyan-500 to-purple-600`}>
      <span className="font-orbitron text-white text-xs font-bold">{symbol}</span>
    </div>
  );
};

export const BlockchainIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className || 'w-16 h-16'} rounded-full bg-gradient-to-r from-cyan-500 via-purple-600 to-emerald-500 flex items-center justify-center`}>
      <div className="absolute inset-1.5 rounded-full bg-black/40 flex items-center justify-center">
        <span className="font-orbitron text-white text-lg font-bold">W3</span>
      </div>
    </div>
  );
};