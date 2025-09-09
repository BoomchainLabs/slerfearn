'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { slerfContract } from '@/lib/web3/slerf-contract';
import { GAME_REWARDS } from '@/lib/contracts/slerf';

export default function GamesPage() {
  const { wallet, connectWallet } = useWallet();
  const [slerfBalance, setSlerfBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  // Load SLERF balance
  useEffect(() => {
    const loadBalance = async () => {
      if (wallet) {
        try {
          const balance = await slerfContract.getBalance(wallet);
          setSlerfBalance(balance.formatted);
        } catch (error) {
          console.error('Error loading SLERF balance:', error);
        }
      }
    };

    loadBalance();
  }, [wallet]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/icons/slerf-logo.png" 
              alt="SLERF Token" 
              className="w-16 h-16 mr-3"
            />
            <h1 className="text-4xl font-bold text-slerf-orange">SLERF Games</h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">
            Play games and earn real SLERF tokens!
          </p>
          
          {wallet ? (
            <div className="bg-slerf-dark/50 rounded-lg p-4 inline-block">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-slerf-orange font-mono text-xl">
                  {slerfBalance} SLERF
                </div>
                <div className="text-sm text-gray-400">
                  Your Balance
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-slerf-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Connect Wallet to Play
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Spin Game */}
          <GameCard
            title="Lucky Spin"
            description="Spin the wheel every 5 minutes to earn SLERF tokens!"
            rewards="1-10 SLERF"
            cooldown="5 minutes"
            href="/games/spin"
            icon="🎰"
            gradient="from-yellow-500 to-orange-600"
          />

          {/* Match Out Game */}
          <GameCard
            title="Match Out"
            description="Match patterns and shapes to earn big SLERF rewards!"
            rewards="2-20 SLERF"
            cooldown="No limit"
            href="/games/match-out"
            icon="🧩"
            gradient="from-purple-500 to-pink-600"
          />

          {/* Memory Game */}
          <GameCard
            title="Memory Master"
            description="Test your memory and earn SLERF for perfect recall!"
            rewards="1-15 SLERF"
            cooldown="10 minutes"
            href="/games/memory"
            icon="🧠"
            gradient="from-blue-500 to-cyan-600"
          />

          {/* Quiz Game */}
          <GameCard
            title="Crypto Quiz"
            description="Answer crypto questions and earn SLERF tokens!"
            rewards="0.5-5 SLERF"
            cooldown="1 hour"
            href="/games/quiz"
            icon="❓"
            gradient="from-green-500 to-teal-600"
          />

          {/* Daily Challenge */}
          <GameCard
            title="Daily Challenge"
            description="Complete daily missions for guaranteed SLERF rewards!"
            rewards="2-10 SLERF"
            cooldown="24 hours"
            href="/games/daily"
            icon="⭐"
            gradient="from-red-500 to-pink-600"
          />

          {/* Coming Soon */}
          <GameCard
            title="Battle Arena"
            description="PvP battles with SLERF token stakes - Coming Soon!"
            rewards="TBA"
            cooldown="Coming Soon"
            href="#"
            icon="⚔️"
            gradient="from-gray-500 to-gray-700"
            comingSoon
          />
        </div>

        {/* Token Info */}
        <div className="mt-12 bg-slerf-dark/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-slerf-orange mb-4">About SLERF Token</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Token Details</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Contract: 0x233df...91ab07</li>
                <li>• Network: Base</li>
                <li>• Symbol: SLERF</li>
                <li>• Decimals: 18</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How It Works</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Connect your wallet</li>
                <li>• Play games to earn SLERF</li>
                <li>• Tokens sent directly to your wallet</li>
                <li>• Trade on DEXs or hold for rewards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GameCardProps {
  title: string;
  description: string;
  rewards: string;
  cooldown: string;
  href: string;
  icon: string;
  gradient: string;
  comingSoon?: boolean;
}

function GameCard({ title, description, rewards, cooldown, href, icon, gradient, comingSoon }: GameCardProps) {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl ${comingSoon ? 'opacity-60' : 'cursor-pointer'}`}>
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded text-xs">
          Coming Soon
        </div>
      )}
      
      <div className="text-4xl mb-4">{icon}</div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90 mb-4">{description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs opacity-75">Rewards:</span>
          <span className="font-semibold">{rewards}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs opacity-75">Cooldown:</span>
          <span className="text-sm">{cooldown}</span>
        </div>
      </div>
      
      {!comingSoon && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 font-semibold transition-colors">
            Play Now
          </button>
        </div>
      )}
    </div>
  );
}