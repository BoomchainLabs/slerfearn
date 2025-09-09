'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { slerfContract } from '@/lib/web3/slerf-contract';
import { Gamepad2, Coins, Target, TrendingUp, ArrowRight, Play, Gift, Star, Zap } from 'lucide-react';

export default function HomePage() {
  // Redirect to landing page for now
  if (typeof window !== 'undefined') {
    window.location.href = '/landing';
    return null;
  }
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
    <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slerf-orange/20 to-orange-600/20"></div>
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <img 
                src="/icons/slerf-logo.png" 
                alt="SLERF Token" 
                className="w-24 h-24 md:w-32 md:h-32 animate-pulse"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-slerf-orange">Slerf</span>Hub
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              The ultimate Web3 rewards platform where you can earn real 
              <span className="text-slerf-orange font-semibold"> $SLERF tokens</span> through 
              gaming, missions, staking, and social activities.
            </p>

            {wallet ? (
              <div className="space-y-6">
                <div className="bg-slerf-dark/50 rounded-xl p-6 inline-block">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-3xl font-bold text-slerf-orange">
                      {isLoading ? '...' : parseFloat(slerfBalance).toFixed(4)}
                    </div>
                    <div className="text-gray-300">SLERF</div>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Your Balance</div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/games"
                    className="bg-slerf-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105"
                  >
                    <Play size={20} />
                    <span>Start Playing</span>
                  </Link>
                  <Link
                    href="/token"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105"
                  >
                    <Coins size={20} />
                    <span>Manage Tokens</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={connectWallet}
                  className="bg-slerf-orange hover:bg-orange-600 text-white px-12 py-4 rounded-lg font-bold text-xl transition-all hover:scale-105 shadow-2xl"
                >
                  Connect Wallet & Start Earning
                </button>
                <p className="text-gray-400">
                  Connect your wallet to start earning real SLERF tokens on Base network
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Earn <span className="text-slerf-orange">SLERF</span> Your Way
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Gamepad2 size={32} />}
              title="Play Games"
              description="Earn SLERF tokens through our collection of fun and engaging games"
              href="/games"
              gradient="from-blue-500 to-purple-600"
              rewards="1-20 SLERF"
            />

            <FeatureCard
              icon={<Target size={32} />}
              title="Daily Missions"
              description="Complete daily challenges and tasks for guaranteed rewards"
              href="/missions"
              gradient="from-green-500 to-teal-600"
              rewards="0.5-10 SLERF"
            />

            <FeatureCard
              icon={<TrendingUp size={32} />}
              title="Stake Tokens"
              description="Stake your SLERF tokens to earn passive rewards with high APY"
              href="/staking"
              gradient="from-purple-500 to-pink-600"
              rewards="12-50% APY"
            />

            <FeatureCard
              icon={<Gift size={32} />}
              title="Social Rewards"
              description="Connect social accounts and invite friends for bonus tokens"
              href="/social"
              gradient="from-orange-500 to-red-600"
              rewards="2-15 SLERF"
            />
          </div>
        </div>
      </section>

      {/* Games Showcase */}
      <section className="py-16 lg:py-24 bg-slerf-dark/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-slerf-orange">Games</span>
            </h2>
            <p className="text-xl text-gray-300">
              Play engaging games and earn real SLERF tokens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameCard
              title="Lucky Spin"
              description="Spin the wheel every 5 minutes to win SLERF tokens"
              image="🎰"
              href="/games/spin"
              rewards="1-10 SLERF"
              color="from-yellow-500 to-orange-600"
            />

            <GameCard
              title="Match Out"
              description="Match patterns and earn tokens based on difficulty"
              image="🧩"
              href="/games/match-out"
              rewards="2-20 SLERF"
              color="from-purple-500 to-pink-600"
            />

            <GameCard
              title="Memory Master"
              description="Test your memory skills for SLERF rewards"
              image="🧠"
              href="/games/memory"
              rewards="1-15 SLERF"
              color="from-blue-500 to-cyan-600"
            />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/games"
              className="bg-slerf-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
            >
              <span>View All Games</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Token Information */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="text-slerf-orange">SLERF Token</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                SLERF is a real token on the Base network that you can earn through various activities 
                on our platform. All rewards are automatically distributed to your connected wallet.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slerf-orange rounded-full"></div>
                  <span>Contract: 0x233df...91ab07</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slerf-orange rounded-full"></div>
                  <span>Network: Base Mainnet</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slerf-orange rounded-full"></div>
                  <span>Verified Contract</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slerf-orange rounded-full"></div>
                  <span>Real Token Rewards</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/token"
                  className="bg-slerf-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Manage Tokens
                </Link>
                <Link
                  href="/token/swap"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Trade SLERF
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slerf-orange/20 to-orange-600/20 rounded-2xl p-8">
                <img 
                  src="/icons/slerf-logo.png" 
                  alt="SLERF Token" 
                  className="w-full max-w-sm mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-slerf-orange to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users earning real SLERF tokens through games, missions, and social activities.
          </p>
          
          {!wallet && (
            <button
              onClick={connectWallet}
              className="bg-white text-slerf-orange hover:bg-gray-100 px-12 py-4 rounded-lg font-bold text-xl transition-all hover:scale-105 shadow-2xl"
            >
              Connect Wallet Now
            </button>
          )}
          
          {wallet && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="bg-white text-slerf-orange hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
              >
                Start Playing Games
              </Link>
              <Link
                href="/missions"
                className="bg-slerf-dark hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
              >
                View Daily Missions
              </Link>
            </div>
          )}
        </div>
      </section>
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