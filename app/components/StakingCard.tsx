'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CubeIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function StakingCard() {
  return (
    <motion.div 
      className="interactive-card glass-morphism p-8 rounded-2xl"
      variants={fadeIn}
    >
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <CubeIcon className="w-8 h-8 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-orbitron font-semibold text-white">Multi-Vault Staking</h3>
          <p className="text-gray-400">Earn While You Hold</p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-6">
        Stake your $LERF tokens in our premium vaults with APR rates up to 40%. Enhanced rewards with NFT boosters.
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center">
            <BanknotesIcon className="w-4 h-4 mr-2" />
            Basic Vault
          </span>
          <span className="text-green-400 font-semibold">18% APR</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Enhanced Vault
          </span>
          <span className="text-blue-400 font-semibold">25% APR</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center">
            <CubeIcon className="w-4 h-4 mr-2" />
            Premium Vault
          </span>
          <span className="text-purple-400 font-semibold">40% APR</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gradient">Up to 40% APR</span>
        <button className="text-purple-400 hover:text-purple-300 transition-colors">
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}