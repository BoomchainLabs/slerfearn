'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  WalletIcon, 
  TrophyIcon, 
  CalendarIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline'

interface UserStats {
  lerfBalance: number
  totalEarned: number
  dailyMissionsCompleted: number
  triviaCorrect: number
  triviaTotal: number
  walletsConnected: number
  socialConnections: number
}

interface RewardsOverviewProps {
  address?: string
}

export default function RewardsOverview({ address }: RewardsOverviewProps) {
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: !!address,
  })

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toLocaleString()
  }

  if (!address || isLoading) {
    return null
  }

  const stats = userStats as UserStats

  const overviewCards = [
    {
      title: 'Current Balance',
      value: formatNumber(stats?.lerfBalance || 0),
      subtitle: '$LERF Tokens',
      icon: WalletIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Earned',
      value: formatNumber(stats?.totalEarned || 0),
      subtitle: 'All Time',
      icon: TrophyIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Daily Missions',
      value: stats?.dailyMissionsCompleted || 0,
      subtitle: 'Completed',
      icon: CalendarIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Trivia Score',
      value: `${stats?.triviaCorrect || 0}/${stats?.triviaTotal || 0}`,
      subtitle: 'Correct Answers',
      icon: UsersIcon,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
            Your <span className="text-gradient">Rewards Dashboard</span>
          </h2>
          <p className="text-gray-300">
            Connected wallet: {address?.substring(0, 6)}...{address?.substring(38)}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {overviewCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                className="glass-morphism p-6 rounded-xl text-center group hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${card.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {card.value}
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  {card.title}
                </div>
                <div className="text-xs text-gray-500">
                  {card.subtitle}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}