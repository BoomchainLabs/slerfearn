'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Bars3Icon, 
  XMarkIcon,
  TrophyIcon,
  ChartBarIcon,
  CubeIcon,
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Marketplace', href: '/marketplace', icon: CubeIcon },
    { name: 'Deploy Token', href: '/deploy', icon: SparklesIcon },
    { name: 'Onboarding', href: '/onboarding', icon: TrophyIcon },
    { name: 'Staking', href: '/staking', icon: ChartBarIcon },
    { name: 'Trivia', href: '/trivia', icon: BookOpenIcon },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751272197827.jpeg"
              alt="LERF Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-orbitron font-bold text-gradient">
              $LERF Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Wallet Connect */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass-morphism border-t border-white/10"
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <div className="pt-4 border-t border-white/10">
              <ConnectButton />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}