'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Image from 'next/image'
import { 
  TrophyIcon, 
  ChartBarIcon, 
  CubeIcon, 
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  GiftIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Navigation from './components/Navigation'
import TokenStats from './components/TokenStats'
import RewardsOverview from './components/RewardsOverview'
import TriviaCard from './components/TriviaCard'
import StakingCard from './components/StakingCard'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const [activeSection, setActiveSection] = useState('rewards')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751272197827.jpeg"
              alt="LERF Token Logo"
              width={120}
              height={120}
              className="mx-auto rounded-full neon-glow"
            />
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-orbitron font-bold mb-6"
            {...fadeIn}
          >
            <span className="text-gradient neon-text">$LERF</span>
            <br />
            <span className="text-white">Rewards Hub</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            Professional Web3 platform offering authentic{' '}
            <span className="text-gradient font-semibold">$LERF token rewards</span>{' '}
            through daily trivia, staking, and community engagement
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            {...fadeIn}
            transition={{ delay: 0.4 }}
          >
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                const ready = mounted
                const connected = ready && account && chain

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="btn-cyber text-lg px-8 py-4 group"
                          >
                            <span className="flex items-center gap-2">
                              <SparklesIcon className="w-5 h-5" />
                              Connect Wallet & Earn
                              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </button>
                        )
                      }

                      return (
                        <div className="flex items-center gap-4">
                          <button
                            onClick={openAccountModal}
                            className="glass-morphism px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-colors"
                          >
                            {account.displayName}
                          </button>
                          
                          <button
                            onClick={openChainModal}
                            className="glass-morphism px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                          >
                            {chain.hasIcon && (
                              <div className="w-6 h-6">
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    className="w-6 h-6"
                                  />
                                )}
                              </div>
                            )}
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>
            
            <a
              href="#features"
              className="glass-morphism px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Learn More
            </a>
          </motion.div>

          <TokenStats />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
              Earn Real <span className="text-gradient">$LERF Tokens</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple ways to earn authentic cryptocurrency rewards in our professional Web3 ecosystem
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <TriviaCard />
            <StakingCard />
            
            <motion.div 
              className="interactive-card glass-morphism p-8 rounded-2xl"
              variants={fadeIn}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <GiftIcon className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-orbitron font-semibold text-white">Social Rewards</h3>
                  <p className="text-gray-400">Connect & Earn</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Connect your social accounts and earn up to 200K $LERF tokens for GitHub, Twitter, and Discord engagement.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gradient">200K $LERF</span>
                <button className="text-green-400 hover:text-green-300 transition-colors">
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="interactive-card glass-morphism p-8 rounded-2xl"
              variants={fadeIn}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <FireIcon className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-orbitron font-semibold text-white">Referral Program</h3>
                  <p className="text-gray-400">Invite Friends</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Refer friends and earn 1M $LERF tokens for each successful referral. Build your network and earn together.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gradient">1M $LERF</span>
                <button className="text-orange-400 hover:text-orange-300 transition-colors">
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="interactive-card glass-morphism p-8 rounded-2xl"
              variants={fadeIn}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-orbitron font-semibold text-white">NFT Boosters</h3>
                  <p className="text-gray-400">Enhance Earnings</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Mint special NFTs that boost your earnings by up to 25%. Rare collectibles with real utility.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gradient">+25% Boost</span>
                <button className="text-pink-400 hover:text-pink-300 transition-colors">
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="interactive-card glass-morphism p-8 rounded-2xl md:col-span-2 lg:col-span-3"
              variants={fadeIn}
            >
              <div className="text-center">
                <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
                  Total Distribution Pool
                </h3>
                <div className="text-6xl font-bold text-gradient mb-4">
                  100B $LERF
                </div>
                <p className="text-gray-300 text-lg">
                  Authentic tokens distributed across community rewards, trivia challenges, staking pools, and social engagement
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Rewards Overview */}
      {isConnected && <RewardsOverview address={address} />}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            $LERF Rewards Hub - Professional Web3 Platform
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>Contract: 0x233df63325933fa3f2dac8e695cd84bb2f91ab07</span>
            <span>Network: Base</span>
            <span>Supply: 100B</span>
          </div>
        </div>
      </footer>
    </div>
  )
}