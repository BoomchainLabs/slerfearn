'use client';

import React from 'react';

export default function SLERFLandingPage() {
  return (
    <div className="min-h-screen bg-blue-600 text-white overflow-x-hidden">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-6xl font-bold text-yellow-400 tracking-wider drop-shadow-lg">
          SLERF
        </h1>
      </div>

      {/* Character Section */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-64 h-64 rounded-full border-8 border-yellow-400 overflow-hidden bg-gradient-to-b from-sky-300 to-sky-500 flex items-center justify-center">
            <img 
              src="/icons/slerf-logo.png" 
              alt="SLERF" 
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-center px-6 mb-12">
        <p className="text-xl font-medium leading-relaxed">
          SLERF the Sloth is a laid back sloth
          <br />
          spreading good vibes on the base chain
        </p>
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
            href="#" 
            className="bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            📊 DEXSCREENER
          </a>
          
          {/* Telegram */}
          <a 
            href="#" 
            className="bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            📱 TELEGRAM
          </a>
          
          {/* Uniswap */}
          <a 
            href="#" 
            className="bg-pink-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            🦄 UNISWAP
          </a>
          
          {/* Phantom */}
          <a 
            href="#" 
            className="bg-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            👻 phantom
          </a>
          
          {/* Twitter */}
          <a 
            href="#" 
            className="bg-sky-400 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm"
          >
            🐦 twitter
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
                SLERF the Sloth is fair launched on Base with 1 billion token 
                supply with 30% team allocation. SLERF is 100% rug-free with 
                liquidity locked, providing investor confidence and protection 
                against dumps.
              </p>
            </div>
            
            <div>
              <h3 className="text-yellow-400 font-bold text-lg mb-2">VISION</h3>
              <p className="leading-relaxed">
                SLERF the Sloth aims to be the most trusted and approachable 
                meme token on the Base blockchain, fostering a transparent, 
                community-driven ecosystem that prioritizes security and 
                positive engagement.
              </p>
            </div>
            
            <div>
              <h3 className="text-yellow-400 font-bold text-lg mb-2">PLAN</h3>
              <p className="leading-relaxed">
                Establish SLERF the Sloth as the leading meme token on the 
                Base blockchain, known for its integrity, community focus, and 
                ability to bring people together in a secure, positive space.
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
        <button className="bg-white text-blue-600 font-bold text-xl py-4 px-12 rounded-full hover:bg-gray-100 transition-colors">
          BUY $SLERF
        </button>
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