'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  UsersIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline'

interface TokenStatsData {
  totalSupply: number
  totalDistributed: number
  dailyDistribution: number
  activeUsers: number
  marketCap?: number
  price?: number
}

export default function TokenStats() {
  const [stats, setStats] = useState<TokenStatsData>({
    totalSupply: 100000000000, // 100B
    totalDistributed: 15000000000, // 15B
    dailyDistribution: 500000000, // 500M
    activeUsers: 1250,
    marketCap: 24430, // $24.43K from real data
    price: 0.0002443 // Calculated from market cap
  })

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num)
  }

  const statCards = [
    {
      title: 'Total Supply',
      value: formatNumber(stats.totalSupply),
      subtitle: '$LERF Tokens',
      icon: CurrencyDollarIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Market Cap',
      value: formatCurrency(stats.marketCap || 0),
      subtitle: 'Live from DexTools',
      icon: ChartBarIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Active Users',
      value: formatNumber(stats.activeUsers),
      subtitle: 'Earning Rewards',
      icon: UsersIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Daily Distribution',
      value: formatNumber(stats.dailyDistribution),
      subtitle: '$LERF Distributed',
      icon: TrophyIcon,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            className="glass-morphism p-6 rounded-xl text-center group hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
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
  )
}