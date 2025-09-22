'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { slerfContract } from '@/lib/web3/slerf-contract';

const SPIN_REWARDS = [
  { tokens: 1, probability: 40, color: 'from-yellow-400 to-yellow-600', emoji: '🪙' },
  { tokens: 2, probability: 25, color: 'from-orange-400 to-orange-600', emoji: '💰' },
  { tokens: 3, probability: 15, color: 'from-red-400 to-red-600', emoji: '💎' },
  { tokens: 5, probability: 10, color: 'from-purple-400 to-purple-600', emoji: '⭐' },
  { tokens: 8, probability: 7, color: 'from-blue-400 to-blue-600', emoji: '🚀' },
  { tokens: 10, probability: 3, color: 'from-pink-400 to-pink-600', emoji: '👑' },
];

export default function SpinGamePage() {
  const { wallet, connectWallet } = useWallet();
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState(0);
  const [result, setResult] = useState<typeof SPIN_REWARDS[0] | null>(null);
  const [rotation, setRotation] = useState(0);
  const [slerfBalance, setSlerfBalance] = useState('0');
  const [totalEarned, setTotalEarned] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const loadData = async () => {
      if (wallet) {
        try {
          const balance = await slerfContract.getBalance(wallet);
          setSlerfBalance(balance.formatted);
        } catch (error) {
          console.error('Error loading SLERF balance:', error);
        }
      }

      // Check last spin time from localStorage
      const lastSpin = localStorage.getItem(`lastSpin_${wallet}`);
      if (lastSpin) {
        const nextTime = parseInt(lastSpin) + COOLDOWN_TIME;
        if (Date.now() < nextTime) {
          setCanSpin(false);
          setNextSpinTime(nextTime);
        }
      }

      // Load session stats
      const sessionStats = localStorage.getItem(`spinStats_${wallet}`);
      if (sessionStats) {
        const stats = JSON.parse(sessionStats);
        setTotalEarned(stats.totalEarned || 0);
        setSpinCount(stats.spinCount || 0);
      }
    };

    loadData();
  }, [wallet]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!canSpin && nextSpinTime > 0) {
      interval = setInterval(() => {
        if (Date.now() >= nextSpinTime) {
          setCanSpin(true);
          setNextSpinTime(0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canSpin, nextSpinTime]);

  const selectRandomReward = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const reward of SPIN_REWARDS) {
      cumulative += reward.probability;
      if (random <= cumulative) {
        return reward;
      }
    }
    return SPIN_REWARDS[0]; // Fallback
  };

  const handleSpin = async () => {
    if (!wallet || !canSpin || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Calculate result before spinning for animation
    const selectedReward = selectRandomReward();
    const rewardIndex = SPIN_REWARDS.indexOf(selectedReward);
    const segmentAngle = 360 / SPIN_REWARDS.length;
    const targetAngle = (rewardIndex * segmentAngle) + (segmentAngle / 2);
    const finalRotation = rotation + 1800 + (360 - targetAngle); // 5 full spins + target

    setRotation(finalRotation);

    // Wait for spin animation
    setTimeout(async () => {
      setResult(selectedReward);
      setIsSpinning(false);
      setCanSpin(false);
      
      // Update stats
      const newTotalEarned = totalEarned + selectedReward.tokens;
      const newSpinCount = spinCount + 1;
      setTotalEarned(newTotalEarned);
      setSpinCount(newSpinCount);

      // Save to localStorage
      const now = Date.now();
      localStorage.setItem(`lastSpin_${wallet}`, now.toString());
      setNextSpinTime(now + COOLDOWN_TIME);

      localStorage.setItem(`spinStats_${wallet}`, JSON.stringify({
        totalEarned: newTotalEarned,
        spinCount: newSpinCount,
      }));

      // Distribute real SLERF tokens via API
      try {
        const response = await fetch('/api/games/spin/reward', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: wallet,
            rewardTokens: selectedReward.tokens
          })
        });
        
        const rewardResult = await response.json();
        if (rewardResult.success) {
          console.log(`Successfully distributed ${selectedReward.tokens} SLERF tokens to ${wallet}`);
        } else {
          console.error('Failed to distribute reward:', rewardResult.message);
        }
      } catch (error) {
        console.error('Error distributing reward:', error);
      }
    }, 3000);
  };

  const formatTimeRemaining = () => {
    if (canSpin) return '';
    const remaining = Math.max(0, nextSpinTime - Date.now());
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <img src="/icons/slerf-logo.png" alt="SLERF" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Lucky Spin</h1>
          <p className="text-gray-300 mb-6">Connect your wallet to start spinning for SLERF tokens!</p>
          <button
            onClick={connectWallet}
            className="bg-slerf-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img src="/icons/slerf-logo.png" alt="SLERF" className="w-12 h-12 mr-3" />
            <h1 className="text-3xl font-bold text-slerf-orange">Lucky Spin</h1>
          </div>
          <a 
            href="/games"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Games
          </a>
        </div>

        {/* Stats Bar */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slerf-dark/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slerf-orange">{slerfBalance}</div>
            <div className="text-sm text-gray-300">SLERF Balance</div>
          </div>
          <div className="bg-slerf-dark/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{totalEarned}</div>
            <div className="text-sm text-gray-300">Session Earned</div>
          </div>
          <div className="bg-slerf-dark/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{spinCount}</div>
            <div className="text-sm text-gray-300">Spins Today</div>
          </div>
          <div className="bg-slerf-dark/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {canSpin ? 'Ready!' : formatTimeRemaining()}
            </div>
            <div className="text-sm text-gray-300">Next Spin</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Spin Wheel */}
            <div className="relative">
              <div className="relative spin-wheel-mobile">
                {/* Wheel */}
                <div 
                  className="w-full h-full rounded-full border-8 border-yellow-400 relative overflow-hidden transition-transform duration-3000 ease-out"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: isSpinning ? '3s' : '0s'
                  }}
                >
                  {SPIN_REWARDS.map((reward, index) => {
                    const segmentAngle = 360 / SPIN_REWARDS.length;
                    const startAngle = index * segmentAngle;
                    
                    return (
                      <div
                        key={index}
                        className={`absolute w-full h-full bg-gradient-to-r ${reward.color}`}
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + segmentAngle - 90) * Math.PI / 180)}%)`,
                        }}
                      >
                        <div 
                          className="absolute text-2xl font-bold text-white flex flex-col items-center justify-center"
                          style={{
                            top: '20%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${startAngle + segmentAngle/2}deg)`,
                            width: '60px',
                            height: '60px',
                          }}
                        >
                          <div className="text-3xl">{reward.emoji}</div>
                          <div className="text-sm">{reward.tokens}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
                </div>

                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slerf-orange rounded-full border-4 border-yellow-400 flex items-center justify-center z-10">
                  <img src="/icons/slerf-logo.png" alt="SLERF" className="w-8 h-8" />
                </div>
              </div>

              {/* Spin Button */}
              <div className="text-center mt-8">
                <button
                  onClick={handleSpin}
                  disabled={!canSpin || isSpinning}
                  className={`mobile-game-button touch-target touch-feedback px-12 py-4 rounded-xl font-bold text-xl ${
                    canSpin && !isSpinning
                      ? 'bg-slerf-orange hover:bg-orange-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSpinning ? 'Spinning...' : canSpin ? 'SPIN NOW!' : `Wait ${formatTimeRemaining()}`}
                </button>
                
                {!canSpin && !isSpinning && (
                  <p className="text-sm text-gray-400 mt-2">
                    You can spin again in {formatTimeRemaining()}
                  </p>
                )}
              </div>
            </div>

            {/* Rewards Table & Result */}
            <div className="space-y-6">
              {/* Current Result */}
              {result && (
                <div className="bg-gradient-to-r from-slerf-orange to-orange-600 rounded-xl p-6 text-center">
                  <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
                  <div className="text-4xl mb-2">{result.emoji}</div>
                  <div className="text-3xl font-bold">
                    +{result.tokens} SLERF
                  </div>
                  <p className="text-sm opacity-90 mt-2">
                    Tokens will be credited to your wallet!
                  </p>
                </div>
              )}

              {/* Rewards Table */}
              <div className="bg-slerf-dark/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Possible Rewards</h3>
                <div className="space-y-3">
                  {SPIN_REWARDS.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{reward.emoji}</div>
                        <div className="font-semibold">{reward.tokens} SLERF</div>
                      </div>
                      <div className="text-sm text-gray-300">
                        {reward.probability}% chance
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Play */}
              <div className="bg-slerf-dark/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">How to Play</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Spin the wheel to win SLERF tokens</li>
                  <li>• Higher rewards have lower chances</li>
                  <li>• You can spin every 5 minutes</li>
                  <li>• Tokens are credited automatically</li>
                  <li>• Keep your session stats in the browser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}