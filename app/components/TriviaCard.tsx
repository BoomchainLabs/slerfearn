'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  ClockIcon, 
  StarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function TriviaCard() {
  return (
    <motion.div 
      className="interactive-card glass-morphism p-8 rounded-2xl"
      variants={fadeIn}
    >
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <TrophyIcon className="w-8 h-8 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-orbitron font-semibold text-white">Daily Trivia</h3>
          <p className="text-gray-400">Test Your Knowledge</p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-6">
        Answer 3 crypto questions daily and earn up to 3.5M $LERF tokens. Perfect scores get bonus rewards!
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-400">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>3 questions • 5 minute limit</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <StarIcon className="w-4 h-4 mr-2" />
          <span>500K $LERF per correct answer</span>
        </div>
        <div className="flex items-center text-sm text-green-400">
          <TrophyIcon className="w-4 h-4 mr-2" />
          <span>2M $LERF perfect score bonus</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gradient">3.5M $LERF</span>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}