import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MultiWalletConnect from '@/components/MultiWalletConnect';
import GitHubConnect from '@/components/GitHubConnect';
import TokenTradingChart from '@/components/TokenTradingChart';
import TokenVisualization from '@/components/TokenVisualization';
import CrossChainLiquidity from '@/components/CrossChainLiquidity';
import { useWallet } from '@/hooks/useWallet';
import slerfLogo from '@/assets/slerf-logo.svg';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Real Stats
const dashboardStats = {
  tokenPrice: 0.00000873,
  marketCap: 8730000,
  totalUsers: 24580,
  totalLocked: 3450000,
  lerfDistributed: 152300000,
  dailyVolume: 650000,
  holders: 18670,
  totalTransactions: 428560,
  liquidity: 2340000,
  burnedTokens: 6200000
};

// Top holders
const topHolders = [
  { rank: 1, address: '0x7a25E...3A8b', amount: 12500000, percentage: 12.5, change: 2.3 },
  { rank: 2, address: '0x18bF1...9C4a', amount: 9800000, percentage: 9.8, change: -1.2 },
  { rank: 3, address: '0x0F3d2...6E1c', amount: 7500000, percentage: 7.5, change: 0.5 },
  { rank: 4, address: '0xA230B...7D5b', amount: 5200000, percentage: 5.2, change: 3.7 },
  { rank: 5, address: '0x63a9C...8F1d', amount: 4100000, percentage: 4.1, change: 0.0 },
];

// Top players this week
const topPlayers = [
  { 
    rank: 1, 
    username: 'crypto_king', 
    address: '0x7a25E...3A8b', 
    score: 12500, 
    earnedTokens: 15000, 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=crypto_king&backgroundColor=b6e3f4'
  },
  { 
    rank: 2, 
    username: 'lerf_master', 
    address: '0x18bF1...9C4a', 
    score: 11200, 
    earnedTokens: 13500, 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=lerf_master&backgroundColor=c0aede'
  },
  { 
    rank: 3, 
    username: 'token_whale', 
    address: '0x0F3d2...6E1c', 
    score: 9800, 
    earnedTokens: 11000, 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=token_whale&backgroundColor=d1d4f9'
  },
  { 
    rank: 4, 
    username: 'blockchain_guru', 
    address: '0xA230B...7D5b', 
    score: 8500, 
    earnedTokens: 10200, 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=blockchain_guru&backgroundColor=ffdfbf'
  },
  { 
    rank: 5, 
    username: 'defi_degen', 
    address: '0x63a9C...8F1d', 
    score: 7200, 
    earnedTokens: 8500, 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=defi_degen&backgroundColor=c0e7c0'
  },
];

// Recent activity
const recentActivity = [
  { 
    type: 'transfer', 
    from: '0x7a25E...3A8b', 
    to: '0x18bF1...9C4a', 
    amount: 250000, 
    time: '2 minutes ago',
    txHash: '0x8a3d...7b2c' 
  },
  { 
    type: 'game_reward', 
    from: 'System', 
    to: 'defi_degen', 
    amount: 8500, 
    time: '15 minutes ago',
    txHash: '0x9c4f...3e1d' 
  },
  { 
    type: 'stake', 
    from: '0xA230B...7D5b', 
    to: 'Staking Pool', 
    amount: 180000, 
    time: '27 minutes ago',
    txHash: '0x2b7a...9f3e' 
  },
  { 
    type: 'liquidity', 
    from: '0x0F3d2...6E1c', 
    to: 'Uniswap Pool', 
    amount: 125000, 
    time: '42 minutes ago',
    txHash: '0x6e5d...1a7b' 
  },
  { 
    type: 'reward', 
    from: 'GitHub Connect', 
    to: 'crypto_king', 
    amount: 75, 
    time: '1 hour ago',
    txHash: '0xf2e1...8d4c' 
  },
];

// Project timeline
const projectTimeline = [
  { date: 'May 2025', title: 'Initial Exchange Listings', status: 'upcoming' },
  { date: 'April 2025', title: 'Ecosystem Expansion', status: 'upcoming' },
  { date: 'March 2025', title: 'Mobile App Beta Launch', status: 'upcoming' },
  { date: 'February 2025', title: 'Cross-Chain Integration', status: 'in-progress' },
  { date: 'January 2025', title: 'Social Gaming Features', status: 'completed' },
  { date: 'December 2024', title: 'Platform Public Launch', status: 'completed' },
  { date: 'November 2024', title: 'Token Presale Event', status: 'completed' },
  { date: 'October 2024', title: 'Website & Whitepaper', status: 'completed' },
];

// Format numbers for display
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { wallet } = useWallet();
  const [userLevel, setUserLevel] = useState(3);
  const [userXP, setUserXP] = useState(2450);
  const [nextLevelXP, setNextLevelXP] = useState(3000);
  
  useEffect(() => {
    // Simulating user data loading
    // This would come from API in a real implementation
  }, [wallet]);
  
  // Calculate XP progress percentage
  const xpProgress = (userXP / nextLevelXP) * 100;
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-10"
    >
      {/* Dashboard Header with Stats */}
      <div className="glass p-8 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          <div className="flex items-center">
            <img src={slerfLogo} alt="$LERF Logo" className="h-16 w-16 mr-5" />
            <div>
              <h1 className="text-4xl font-bold font-space">$LERF Dashboard</h1>
              <p className="text-gray-400 text-lg mt-1">Engage, Earn, and Explore the $LERF Ecosystem</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <MultiWalletConnect />
            <GitHubConnect />
            
            {wallet && (
              <Button variant="outline" className="border-slerf-orange text-slerf-orange h-11 px-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm text-gray-400">$LERF Price</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-xl font-bold">${dashboardStats.tokenPrice.toFixed(8)}</div>
              <div className="text-xs text-green-500">+12.4% (24h)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm text-gray-400">Market Cap</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-xl font-bold">${formatNumber(dashboardStats.marketCap)}</div>
              <div className="text-xs text-green-500">+5.2% (24h)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm text-gray-400">Users</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-xl font-bold">{formatNumber(dashboardStats.totalUsers)}</div>
              <div className="text-xs text-green-500">+124 (24h)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm text-gray-400">TVL</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-xl font-bold">${formatNumber(dashboardStats.totalLocked)}</div>
              <div className="text-xs text-green-500">+8.7% (24h)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm text-gray-400">$LERF Distributed</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-xl font-bold">{formatNumber(dashboardStats.lerfDistributed)}</div>
              <div className="text-xs text-green-500">+215K (24h)</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* User Stats and Level */}
      {wallet && (
        <div className="glass p-8 rounded-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slerf-dark-light border-2 border-slerf-cyan/30">
                  <img 
                    src="https://api.dicebear.com/7.x/personas/svg?seed=lerf_user&backgroundColor=d1d4f9" 
                    alt="User Avatar"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slerf-cyan text-slerf-dark font-bold text-sm p-1 rounded-full w-9 h-9 flex items-center justify-center shadow-lg">
                  Lv{userLevel}
                </div>
              </div>
              
              <div className="ml-5">
                <h2 className="text-2xl font-bold">Welcome back, {wallet.address?.substring(0, 6)}...</h2>
                <div className="flex items-center text-base text-gray-300 mt-1">
                  <span>Level {userLevel} • {userXP}/{nextLevelXP} XP</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
              <div className="text-center">
                <div className="text-3xl font-bold text-slerf-cyan">2,450</div>
                <div className="text-sm text-gray-300 mt-1">$LERF Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slerf-purple">12</div>
                <div className="text-sm text-gray-300 mt-1">Quests Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slerf-orange">3</div>
                <div className="text-sm text-gray-300 mt-1">NFT Boosters</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-base mb-3">
              <span>Progress to Level {userLevel + 1}</span>
              <span className="font-medium">{userXP}/{nextLevelXP} XP</span>
            </div>
            <Progress value={xpProgress} className="h-3" />
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Button className="bg-slerf-cyan text-slerf-dark hover:bg-slerf-cyan/90 h-12 px-6 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4l2 2"></path>
              </svg>
              Daily Missions
            </Button>
            <Button variant="outline" className="h-12 px-6 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              Weekly Quests
            </Button>
            <Button variant="outline" className="h-12 px-6 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              Staking Vaults
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="glass p-8 rounded-xl">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 w-full mb-8 p-1.5">
          <TabsTrigger value="overview" className="px-5 py-3 text-base">Overview</TabsTrigger>
          <TabsTrigger value="trading" className="px-5 py-3 text-base">Trading</TabsTrigger>
          <TabsTrigger value="network" className="px-5 py-3 text-base">Network</TabsTrigger>
          <TabsTrigger value="liquidity" className="px-5 py-3 text-base">Liquidity</TabsTrigger>
          <TabsTrigger value="social" className="hidden md:flex px-5 py-3 text-base">Social</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-slerf-dark-light border-slerf-dark-lighter h-full">
                <CardHeader>
                  <CardTitle>$LERF Token Performance</CardTitle>
                  <CardDescription>Price and volume analytics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mini version of TokenTradingChart would go here */}
                  <div className="bg-slerf-dark rounded-lg p-6 flex flex-col items-center justify-center h-72">
                    <div className="text-2xl font-bold text-slerf-cyan mb-2">${dashboardStats.tokenPrice.toFixed(8)}</div>
                    <div className="text-green-500 mb-4">+12.4% (24h)</div>
                    <div className="w-full h-40 relative overflow-hidden">
                      <svg viewBox="0 0 100 30" className="w-full h-full">
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(30, 144, 255, 0.5)" />
                            <stop offset="100%" stopColor="rgba(30, 144, 255, 0)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,30 L0,20 C5,17 10,22 15,18 C20,15 25,10 30,17 C35,24 40,21 45,19 C50,17 55,21 60,19 C65,17 70,16 75,14 C80,12 85,14 90,8 C95,2 100,5 100,5 L100,30 Z"
                          fill="url(#grad)"
                        />
                        <path
                          d="M0,20 C5,17 10,22 15,18 C20,15 25,10 30,17 C35,24 40,21 45,19 C50,17 55,21 60,19 C65,17 70,16 75,14 C80,12 85,14 90,8 C95,2 100,5 100,5"
                          fill="none"
                          stroke="#1E90FF"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-slerf-dark-light border-slerf-dark-lighter h-full">
                <CardHeader>
                  <CardTitle>Top Players This Week</CardTitle>
                  <CardDescription>Users with highest activity and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPlayers.map((player) => (
                      <div key={player.rank} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-slerf-dark-lighter rounded-full flex items-center justify-center text-xs mr-3">
                            {player.rank}
                          </div>
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                            <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium">{player.username}</div>
                            <div className="text-xs text-gray-400">{player.address}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-slerf-cyan">{formatNumber(player.earnedTokens)}</div>
                          <div className="text-xs text-gray-400">{formatNumber(player.score)} points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                        activity.type === 'transfer' ? 'bg-blue-500/20 text-blue-500' :
                        activity.type === 'game_reward' ? 'bg-orange-500/20 text-orange-500' :
                        activity.type === 'stake' ? 'bg-purple-500/20 text-purple-500' :
                        activity.type === 'liquidity' ? 'bg-cyan-500/20 text-cyan-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {activity.type === 'transfer' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3L21 7L17 11"></path>
                            <path d="M21 7H13"></path>
                            <path d="M7 21L3 17L7 13"></path>
                            <path d="M3 17H11"></path>
                          </svg>
                        )}
                        {activity.type === 'game_reward' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        )}
                        {activity.type === 'stake' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                            <line x1="12" y1="16" x2="12" y2="8"></line>
                          </svg>
                        )}
                        {activity.type === 'liquidity' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                          </svg>
                        )}
                        {activity.type === 'reward' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="6"></circle>
                            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"></path>
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium capitalize">
                              {activity.type.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              From {activity.from} to {activity.to}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${activity.type === 'transfer' ? 'text-blue-500' : 'text-slerf-cyan'}`}>
                              {formatNumber(activity.amount)} $LERF
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs">
                          <a href={`https://etherscan.io/tx/${activity.txHash}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slerf-cyan">
                            Tx: {activity.txHash}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
              <CardHeader>
                <CardTitle>Project Roadmap</CardTitle>
                <CardDescription>$LERF development timeline and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative">
                  <div className="absolute top-0 bottom-0 left-3.5 w-0.5 bg-slerf-dark-lighter"></div>
                  
                  {projectTimeline.map((item, index) => (
                    <div key={index} className="flex items-start relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-3 
                        ${item.status === 'completed' ? 'bg-green-500 text-white' : 
                          item.status === 'in-progress' ? 'bg-yellow-500 text-slerf-dark' : 
                          'bg-slerf-dark-lighter text-gray-400'}`}>
                        {item.status === 'completed' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : item.status === 'in-progress' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-400">{item.date}</div>
                        </div>
                        
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full
                            ${item.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                              item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-500' : 
                              'bg-slerf-dark text-gray-400'}`}>
                            {item.status === 'completed' ? 'Completed' : 
                             item.status === 'in-progress' ? 'In Progress' : 
                             'Upcoming'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trading Tab */}
        <TabsContent value="trading">
          <TokenTradingChart />
        </TabsContent>
        
        {/* Network Tab */}
        <TabsContent value="network">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">$LERF Network Visualization</h2>
            <TokenVisualization />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slerf-dark-light border-slerf-dark-lighter col-span-2">
              <CardHeader>
                <CardTitle>Network Statistics</CardTitle>
                <CardDescription>$LERF ecosystem metrics and on-chain data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Total Holders</div>
                    <div className="text-2xl font-bold">{formatNumber(dashboardStats.holders)}</div>
                    <div className="text-xs text-green-500">+4.5% (30d)</div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Transactions</div>
                    <div className="text-2xl font-bold">{formatNumber(dashboardStats.totalTransactions)}</div>
                    <div className="text-xs text-green-500">+1,450 (24h)</div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Liquidity Pools</div>
                    <div className="text-2xl font-bold">${formatNumber(dashboardStats.liquidity)}</div>
                    <div className="text-xs text-green-500">+2.8% (24h)</div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Daily Volume</div>
                    <div className="text-2xl font-bold">${formatNumber(dashboardStats.dailyVolume)}</div>
                    <div className="text-xs text-green-500">+12.5% (24h)</div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Burned Tokens</div>
                    <div className="text-2xl font-bold">{formatNumber(dashboardStats.burnedTokens)}</div>
                    <div className="text-xs text-green-500">+35K (24h)</div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Total Supply</div>
                    <div className="text-2xl font-bold">1B</div>
                    <div className="text-xs text-gray-400">Fixed Supply</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
              <CardHeader>
                <CardTitle>Top Token Holders</CardTitle>
                <CardDescription>Largest $LERF holders by balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topHolders.map((holder) => (
                    <div key={holder.rank} className="glass p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-slerf-dark rounded-full flex items-center justify-center text-xs mr-2">
                            {holder.rank}
                          </div>
                          <div className="font-mono text-sm">{holder.address}</div>
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${holder.change > 0 ? 'bg-green-500/20 text-green-500' : holder.change < 0 ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-500'}`}>
                          {holder.change > 0 ? '+' : ''}{holder.change}%
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-slerf-cyan">{formatNumber(holder.amount)} $LERF</div>
                        <div className="text-gray-400">{holder.percentage}% of supply</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Liquidity Tab */}
        <TabsContent value="liquidity">
          <CrossChainLiquidity />
        </TabsContent>
        
        {/* Social Tab */}
        <TabsContent value="social">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
              <CardHeader>
                <CardTitle>Community Updates</CardTitle>
                <CardDescription>Latest news and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="glass p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">Announcing Cross-Chain Expansion!</h3>
                          <span className="text-xs text-gray-400">2h ago</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          We're excited to announce our expansion to multiple blockchains, including Solana and Arbitrum. This will bring new opportunities for $LERF holders...
                        </p>
                        <div className="mt-2">
                          <a href="#" className="text-slerf-cyan text-xs hover:underline">Read more</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">AMA Session Announcement</h3>
                          <span className="text-xs text-gray-400">1d ago</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          Join our upcoming AMA session with the $LERF team this Friday at 3 PM UTC. We'll be discussing our roadmap and answering your questions...
                        </p>
                        <div className="mt-2">
                          <a href="#" className="text-slerf-cyan text-xs hover:underline">Read more</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">New Partnership Revealed</h3>
                          <span className="text-xs text-gray-400">3d ago</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          We're thrilled to announce our strategic partnership with DeFi Alliance to accelerate $LERF adoption and ecosystem growth...
                        </p>
                        <div className="mt-2">
                          <a href="#" className="text-slerf-cyan text-xs hover:underline">Read more</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
              <CardHeader>
                <CardTitle>Referral Program</CardTitle>
                <CardDescription>Invite friends and earn $LERF rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="glass p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-3">Your Referral Link</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value="https://lerfhub.io/ref/user123"
                      readOnly
                      className="w-full bg-slerf-dark border border-slerf-dark-lighter rounded-lg px-3 py-2 pr-20 text-sm"
                    />
                    <button className="absolute right-1 top-1 bg-slerf-cyan text-slerf-dark text-xs font-medium px-3 py-1 rounded">
                      Copy
                    </button>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-gray-400">Total Referrals</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slerf-cyan">650</div>
                      <div className="text-xs text-gray-400">$LERF Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">8</div>
                      <div className="text-xs text-gray-400">Active Users</div>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">How It Works</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-slerf-cyan text-slerf-dark flex items-center justify-center mr-3 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Share Your Link</h4>
                        <p className="text-sm text-gray-300">
                          Share your unique referral link with friends and on social media
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-slerf-cyan text-slerf-dark flex items-center justify-center mr-3 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Friends Join $LERF</h4>
                        <p className="text-sm text-gray-300">
                          When friends join using your link, they get 50 $LERF as a welcome bonus
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-slerf-cyan text-slerf-dark flex items-center justify-center mr-3 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Earn Rewards</h4>
                        <p className="text-sm text-gray-300">
                          You earn 100 $LERF for each verified referral and 5% of their earnings
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-slerf-cyan text-slerf-dark hover:bg-slerf-cyan/90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share Your Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;