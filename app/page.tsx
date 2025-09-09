'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { slerfContract } from '@/lib/web3/slerf-contract';

export default function HomePage() {
  const { wallet, connectWallet } = useWallet();
  const [slerfBalance, setSlerfBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBalance = async () => {
      if (wallet) {
        try {
          setIsLoading(true);
          const balance = await slerfContract.getBalance(wallet);
          setSlerfBalance(balance.formatted);
        } catch (error) {
          console.error('Error loading SLERF balance:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadBalance();
  }, [wallet]);

  return (
    <div className="min-h-screen bg-blue-600 text-white overflow-x-hidden">
      {/* Header */}
      <div className="text-center pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-yellow-400 tracking-wider drop-shadow-lg">
          SLERF
        </h1>
      </div>

      {/* Character Section */}
      <div className="flex justify-center mb-6 sm:mb-8 px-4">
        <div className="relative">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 sm:border-8 border-yellow-400 overflow-hidden bg-gradient-to-b from-sky-300 to-sky-500 flex items-center justify-center">
            <img 
              src="/icons/slerf-logo.png" 
              alt="SLERF" 
              className="w-36 h-36 sm:w-48 sm:h-48 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-center px-4 sm:px-6 mb-8 sm:mb-12">
        <p className="text-lg sm:text-xl font-medium leading-relaxed">
          SLERF the Sloth is the chillest token on base
          <br />
          spreading good vibes on the base chain
        </p>
      </div>

      {/* Wallet Section */}
      {wallet ? (
        <div className="text-center px-4 sm:px-6 mb-8 sm:mb-12">
          <div className="bg-white/10 rounded-xl p-4 inline-block backdrop-blur-sm min-w-[280px]">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                {isLoading ? '...' : parseFloat(slerfBalance).toFixed(4)}
              </div>
              <div className="text-white">SLERF</div>
            </div>
            <div className="text-sm text-white/80 mt-1">Your Balance</div>
          </div>
        </div>
      ) : (
        <div className="text-center px-4 sm:px-6 mb-8 sm:mb-12">
          <button
            onClick={connectWallet}
            className="bg-yellow-400 text-blue-600 font-bold text-base sm:text-lg py-3 px-6 sm:px-8 rounded-full hover:bg-yellow-300 transition-colors active:scale-95 touch-manipulation"
          >
            Connect Wallet to Earn SLERF
          </button>
        </div>
      )}

      {/* Earning Games Section */}
      <div className="px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 tracking-wider drop-shadow-lg">
            EARN SLERF TOKENS
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto mb-6 sm:mb-8">
          {/* Spin Game */}
          <Link 
            href="/games/spin"
            className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white py-4 sm:py-5 px-3 sm:px-4 rounded-xl flex flex-col items-center justify-center gap-2 font-bold text-xs sm:text-sm active:scale-95 hover:scale-105 transition-transform touch-manipulation"
          >
            <div className="text-2xl sm:text-3xl">🎰</div>
            <div className="text-center">LUCKY SPIN</div>
            <div className="text-xs opacity-90">1-10 SLERF</div>
          </Link>
          
          {/* Match Out Game */}
          <Link 
            href="/games/match-out"
            className="bg-gradient-to-br from-purple-500 to-pink-600 text-white py-4 sm:py-5 px-3 sm:px-4 rounded-xl flex flex-col items-center justify-center gap-2 font-bold text-xs sm:text-sm active:scale-95 hover:scale-105 transition-transform touch-manipulation"
          >
            <div className="text-2xl sm:text-3xl">🧩</div>
            <div className="text-center">MATCH OUT</div>
            <div className="text-xs opacity-90">2-20 SLERF</div>
          </Link>
          
          {/* All Games */}
          <Link 
            href="/games"
            className="bg-gradient-to-br from-green-500 to-teal-600 text-white py-4 sm:py-5 px-3 sm:px-4 rounded-xl flex flex-col items-center justify-center gap-2 font-bold text-xs sm:text-sm active:scale-95 hover:scale-105 transition-transform touch-manipulation"
          >
            <div className="text-2xl sm:text-3xl">🎮</div>
            <div className="text-center">ALL GAMES</div>
            <div className="text-xs opacity-90">Play More</div>
          </Link>
          
          {/* Token Hub */}
          <Link 
            href="/token"
            className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-4 sm:py-5 px-3 sm:px-4 rounded-xl flex flex-col items-center justify-center gap-2 font-bold text-xs sm:text-sm active:scale-95 hover:scale-105 transition-transform touch-manipulation"
          >
            <div className="text-2xl sm:text-3xl">💰</div>
            <div className="text-center">TOKEN HUB</div>
            <div className="text-xs opacity-90">Manage SLERF</div>
          </Link>
        </div>
      </div>

      {/* Social Links Grid */}
      <div className="px-6 mb-16">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {/* ApeStore */}
          <a 
            href="#" 
            className="bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            🍌 APESTORE
          </a>
          
          {/* DexScreener */}
          <a 
            href="https://dexscreener.com/base/0x233df63325933fa3f2dac8e695cd84bb2f91ab07" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            📊 DEXSCREENER
          </a>
          
          {/* Telegram */}
          <a 
            href="https://t.me/Boomtokn" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            📱 TELEGRAM
          </a>
          
          {/* Uniswap */}
          <a 
            href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            🦄 UNISWAP
          </a>
          
          {/* Token Swap */}
          <Link 
            href="/token/swap"
            className="bg-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            🔄 SWAP
          </Link>
          
          {/* Twitter */}
          <a 
            href="https://twitter.com/slerf00" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-400 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            🐦 @slerf00
          </a>
        </div>
      </div>

      {/* Tokenomics Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-yellow-400 tracking-wider drop-shadow-lg">
            TOKENOMICS
          </h2>
        </div>
        
        <div className="px-6">
          <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-6 max-w-sm mx-auto relative overflow-hidden">
            <div className="relative z-10">
              <img 
                src="/icons/slerf-logo.png" 
                alt="SLERF Tokenomics" 
                className="w-full h-32 object-contain mb-4"
              />
            </div>
          </div>
        </div>
        
        {/* Tokenomics Info */}
        <div className="px-6 mt-8">
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="text-yellow-400 font-bold text-lg mb-2">LAUNCH</h3>
              <p className="leading-relaxed">
                SLERF the Sloth is the chillest token on Base with 1 billion token 
                supply. SLERF is 100% rug-free with liquidity locked, providing 
                investor confidence and protection. The most laid-back token experience 
                on the Base network.
              </p>
            </div>
            
            <div>
              <h3 className="text-yellow-400 font-bold text-lg mb-2">VISION</h3>
              <p className="leading-relaxed">
                SLERF the Sloth aims to be the chillest and most trusted 
                meme token on the Base blockchain, fostering a transparent, 
                community-driven ecosystem that prioritizes chill vibes and 
                positive engagement.
              </p>
            </div>
            
            <div>
              <h3 className="text-yellow-400 font-bold text-lg mb-2">PLAN</h3>
              <p className="leading-relaxed">
                Establish SLERF the Sloth as the chillest meme token on the 
                Base blockchain, known for its integrity, community focus, and 
                ability to bring people together in a chill, positive space 
                on Base.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Buy Section */}
      <div className="px-6 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white">
            How to Buy SLERF
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {/* Step 1 */}
          <div className="bg-white text-black rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-lg mb-2">GET A WALLET</h3>
            <p className="text-sm leading-relaxed">
              DOWNLOAD METAMASK OR YOUR PREFERRED CRYPTO WALLET
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white text-black rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-lg mb-2">CONNECT TO DEX</h3>
            <p className="text-sm leading-relaxed">
              CONNECT YOUR WALLET TO UNISWAP OR PANCAKESWAP
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white text-black rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-lg mb-2">BUY ETH</h3>
            <p className="text-sm leading-relaxed">
              PURCHASE ETHEREUM FROM ANY MAJOR EXCHANGE
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="bg-white text-black rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-bold text-lg mb-2">SWAP FOR SLERF</h3>
            <p className="text-sm leading-relaxed">
              EXCHANGE YOUR ETH FOR SLERF TOKENS
            </p>
          </div>
        </div>
      </div>

      {/* Buy Button */}
      <div className="text-center pb-16">
        <a
          href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-600 font-bold text-xl py-4 px-12 rounded-full hover:bg-gray-100 transition-colors inline-block"
        >
          BUY $SLERF
        </a>
      </div>
      
      {/* Contract Address */}
      <div className="text-center pb-8 px-6">
        <p className="text-sm opacity-80">
          Contract: 0x233df63325933fa3f2dac8e695cd84bb2f91ab07
        </p>
        <p className="text-xs opacity-60 mt-1">
          Base Network
        </p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
  rewards: string;
}

function FeatureCard({ icon, title, description, href, gradient, rewards }: FeatureCardProps) {
  return (
    <Link href={href} className="group">
      <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
        <div className="text-white mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/90 mb-4 text-sm leading-relaxed">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm">Earn: {rewards}</span>
          <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  rewards: string;
  color: string;
}

function GameCard({ title, description, image, href, rewards, color }: GameCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-slerf-dark/50 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className={`bg-gradient-to-br ${color} p-8 text-center`}>
          <div className="text-6xl mb-4">{image}</div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300 mb-4 text-sm">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-slerf-orange font-semibold">{rewards}</span>
            <span className="text-gray-400 group-hover:text-white transition-colors text-sm">
              Play Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}