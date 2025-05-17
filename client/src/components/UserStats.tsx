import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import slerfLogo from '@/assets/slerf-logo.svg';
import { useQuery } from '@tanstack/react-query';

// Types
interface UserStat {
  username: string;
  address: string;
  totalEarned: number;
  avatar: string;
  rank: number;
  level: number;
  stakedAmount?: number;
  joinedDate: string;
  lastActive: string;
}

interface GameScore {
  username: string;
  score: number;
  game: string;
  address: string;
  avatar: string;
  timestamp: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Generate realistic user data
const generateUsers = (count: number): UserStat[] => {
  const users: UserStat[] = [];
  const names = ['CryptoWhale', 'TokenMaster', 'SlerfLover', 'MoonHunter', 'DiamondHands', 
                'BlockchainBaron', 'SatoshiFan', 'TokenQueen', 'CryptoKing', 'NFTCollector',
                'DeFiGuru', 'Web3Native', 'EtherDragon', 'ChainMaster', 'GasOptimizer',
                'MintMaster', 'VaultKeeper', 'StakeKing', 'YieldFarmer', 'CryptoNinja'];
  
  const addresses = [
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
    '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB',
    '0x583031D1113aD414F02576BD6afaBfb302140225',
    '0xdD870fA1b7C4700F2BD7f44238821C26f7392148'
  ];
  
  // Generate past dates (1-90 days ago)
  const generatePastDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  
  // Distribute total earings in a pyramid fashion (some high earners, more medium and low earners)
  // This creates a more realistic distribution
  const generateEarnings = (index: number, count: number) => {
    // Top 10% are high earners
    if (index < count * 0.1) {
      return Math.floor(Math.random() * 1000000) + 500000; // 500K-1.5M
    }
    // Next 30% are medium earners
    else if (index < count * 0.4) {
      return Math.floor(Math.random() * 300000) + 100000; // 100K-400K
    }
    // Rest are lower earners
    else {
      return Math.floor(Math.random() * 90000) + 10000; // 10K-100K
    }
  };
  
  // Generate data for each user
  for (let i = 0; i < count; i++) {
    const nameIndex = Math.floor(Math.random() * names.length);
    const addressIndex = i % addresses.length;
    
    // Add random numbers to username to make them unique
    const uniqueSuffix = Math.floor(Math.random() * 1000);
    const username = `${names[nameIndex]}${uniqueSuffix}`;
    
    // Randomize join dates (1-90 days ago)
    const joinDaysAgo = Math.floor(Math.random() * 90) + 1;
    const joinedDate = generatePastDate(joinDaysAgo);
    
    // Last active date is more recent than joined date
    const activeDaysAgo = Math.floor(Math.random() * joinDaysAgo);
    const lastActive = generatePastDate(activeDaysAgo);
    
    // Level between 1-100, weighted towards lower levels
    const level = Math.floor(Math.pow(Math.random(), 1.5) * 100) + 1;
    
    // Generate earnings based on rank (higher ranked users have higher earnings)
    const totalEarned = generateEarnings(i, count);
    
    // Some users have staked amounts
    const hasStaked = Math.random() > 0.3; // 70% of users have staked
    
    users.push({
      username,
      address: addresses[addressIndex],
      totalEarned,
      avatar: `https://avatars.dicebear.com/api/identicon/${username}.svg`,
      rank: i + 1,
      level,
      stakedAmount: hasStaked ? Math.floor(totalEarned * (Math.random() * 0.5 + 0.1)) : undefined, // Stake 10-60% of earnings
      joinedDate,
      lastActive
    });
  }
  
  // Sort by totalEarned descending
  return users.sort((a, b) => b.totalEarned - a.totalEarned);
};

// Generate leaderboard data for games
const generateGameScores = (count: number, users: UserStat[]): GameScore[] => {
  const games = ['Spin Wheel', 'Block Race', 'Token Hunt', 'Crypto Crush', 'NFT Match', 'Staking Simulator'];
  const scores: GameScore[] = [];
  
  // Generate timestamp within last 7 days
  const generateRecentTimestamp = () => {
    const date = new Date();
    // Random minutes ago (up to 7 days)
    const minutesAgo = Math.floor(Math.random() * 7 * 24 * 60);
    date.setMinutes(date.getMinutes() - minutesAgo);
    return date.toISOString();
  };
  
  for (let i = 0; i < count; i++) {
    // Select random user from top users
    const userIndex = Math.floor(Math.random() * Math.min(users.length, 20));
    const user = users[userIndex];
    
    // Random game
    const gameIndex = Math.floor(Math.random() * games.length);
    const game = games[gameIndex];
    
    // Score based on game type
    let score = 0;
    switch (game) {
      case 'Spin Wheel':
        score = Math.floor(Math.random() * 1000) + 100;
        break;
      case 'Block Race':
        score = Math.floor(Math.random() * 20000) + 5000;
        break;
      case 'Token Hunt':
        score = Math.floor(Math.random() * 500) + 50;
        break;
      case 'Crypto Crush':
        score = Math.floor(Math.random() * 100000) + 10000;
        break;
      case 'NFT Match':
        score = Math.floor(Math.random() * 200) + 20;
        break;
      case 'Staking Simulator':
        score = Math.floor(Math.random() * 400) + 100;
        break;
    }
    
    scores.push({
      username: user.username,
      score,
      game,
      address: user.address,
      avatar: user.avatar,
      timestamp: generateRecentTimestamp()
    });
  }
  
  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
};

// Calculate platform statistics
const calculatePlatformStats = (users: UserStat[]) => {
  const totalUsers = users.length;
  const totalSlerfDistributed = users.reduce((sum, user) => sum + user.totalEarned, 0);
  const activeUsers = users.filter(user => {
    const lastActiveDate = new Date(user.lastActive);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff < 7; // Active in last 7 days
  }).length;
  
  const totalStaked = users.reduce((sum, user) => sum + (user.stakedAmount || 0), 0);
  
  return {
    totalUsers,
    totalSlerfDistributed,
    activeUsers,
    totalStaked,
    avgEarningsPerUser: Math.floor(totalSlerfDistributed / totalUsers)
  };
};

// Format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

// Format address for display
const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Main component
const UserStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('leaderboard');
  
  // Generate data
  const users = generateUsers(100);
  const gameScores = generateGameScores(50, users);
  const platformStats = calculatePlatformStats(users);
  
  // Simulate API query
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // Normally this would be a real API call
      return platformStats;
    },
    initialData: platformStats
  });
  
  // Top users (for leaderboard)
  const topUsers = users.slice(0, 10);
  
  // Top game scores
  const topGameScores = gameScores.slice(0, 10);
  
  // Calculate time since
  const calculateTimeSince = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  return (
    <div className="w-full rounded-xl glass p-6 relative">
      <div className="flex items-center space-x-3 mb-6">
        <img src={slerfLogo} alt="SLERF Logo" className="h-10 w-10" />
        <h2 className="text-2xl font-space font-bold">Community Stats</h2>
      </div>
      
      {/* Platform statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="glass-dark p-4 rounded-lg text-center">
          <div className="text-slerf-cyan mb-1 text-sm">Total Users</div>
          <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
        </div>
        <div className="glass-dark p-4 rounded-lg text-center">
          <div className="text-slerf-cyan mb-1 text-sm">SLERF Distributed</div>
          <div className="text-2xl font-bold">{formatNumber(stats.totalSlerfDistributed)}</div>
        </div>
        <div className="glass-dark p-4 rounded-lg text-center">
          <div className="text-slerf-cyan mb-1 text-sm">Active Users</div>
          <div className="text-2xl font-bold">{formatNumber(stats.activeUsers)}</div>
        </div>
        <div className="glass-dark p-4 rounded-lg text-center">
          <div className="text-slerf-cyan mb-1 text-sm">Total Staked</div>
          <div className="text-2xl font-bold">{formatNumber(stats.totalStaked)}</div>
        </div>
        <div className="glass-dark p-4 rounded-lg text-center">
          <div className="text-slerf-cyan mb-1 text-sm">Avg Earnings</div>
          <div className="text-2xl font-bold">{formatNumber(stats.avgEarningsPerUser)}</div>
        </div>
      </div>
      
      {/* Tabs for different data views */}
      <div className="border-b border-slerf-dark-lighter mb-6">
        <div className="flex space-x-6">
          <button 
            className={`pb-2 px-1 ${activeTab === 'leaderboard' ? 'border-b-2 border-slerf-cyan text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button 
            className={`pb-2 px-1 ${activeTab === 'gameScores' ? 'border-b-2 border-slerf-cyan text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('gameScores')}
          >
            Top Game Scores
          </button>
        </div>
      </div>
      
      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead className="text-left">
              <tr className="text-slerf-cyan border-b border-slerf-dark-lighter">
                <th className="pb-2 font-medium">Rank</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Level</th>
                <th className="pb-2 font-medium">Total SLERF</th>
                <th className="pb-2 font-medium">Staked</th>
                <th className="pb-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, index) => (
                <tr key={user.username} className="border-b border-slerf-dark-lighter/30 hover:bg-slerf-dark-light/30">
                  <td className="py-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs 
                      ${index === 0 ? 'bg-yellow-500 text-slerf-dark' : 
                        index === 1 ? 'bg-slate-300 text-slerf-dark' : 
                        index === 2 ? 'bg-amber-600 text-slerf-dark' : 
                        'bg-slerf-dark-light text-gray-300'}`}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                        <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-gray-400 text-xs font-mono">{formatAddress(user.address)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-slerf-purple/20 text-slerf-purple flex items-center justify-center text-xs mr-1">
                        {user.level >= 50 ? '★' : 'L'}
                      </div>
                      <span>{user.level}</span>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-slerf-cyan">{formatNumber(user.totalEarned)}</td>
                  <td className="py-3">
                    {user.stakedAmount ? (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        <span>{formatNumber(user.stakedAmount)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
                        <span className="text-gray-400">None</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-gray-400">{user.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
      
      {/* Game Scores Tab */}
      {activeTab === 'gameScores' && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead className="text-left">
              <tr className="text-slerf-cyan border-b border-slerf-dark-lighter">
                <th className="pb-2 font-medium">Rank</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Game</th>
                <th className="pb-2 font-medium">Score</th>
                <th className="pb-2 font-medium">Played</th>
              </tr>
            </thead>
            <tbody>
              {topGameScores.map((score, index) => (
                <tr key={`${score.username}-${index}`} className="border-b border-slerf-dark-lighter/30 hover:bg-slerf-dark-light/30">
                  <td className="py-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs 
                      ${index === 0 ? 'bg-yellow-500 text-slerf-dark' : 
                        index === 1 ? 'bg-slate-300 text-slerf-dark' : 
                        index === 2 ? 'bg-amber-600 text-slerf-dark' : 
                        'bg-slerf-dark-light text-gray-300'}`}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                        <img src={score.avatar} alt={score.username} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{score.username}</div>
                        <div className="text-gray-400 text-xs font-mono">{formatAddress(score.address)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className={`
                        h-6 w-6 rounded-full mr-2 flex items-center justify-center text-xs 
                        ${score.game === 'Spin Wheel' ? 'bg-red-500/20 text-red-500' :
                          score.game === 'Block Race' ? 'bg-green-500/20 text-green-500' :
                          score.game === 'Token Hunt' ? 'bg-blue-500/20 text-blue-500' :
                          score.game === 'Crypto Crush' ? 'bg-yellow-500/20 text-yellow-500' :
                          score.game === 'NFT Match' ? 'bg-purple-500/20 text-purple-500' :
                          'bg-cyan-500/20 text-cyan-500'
                        }`}
                      >
                        {score.game.charAt(0)}
                      </div>
                      {score.game}
                    </div>
                  </td>
                  <td className="py-3 font-bold text-slerf-cyan">{formatNumber(score.score)}</td>
                  <td className="py-3 text-gray-400">{calculateTimeSince(score.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default UserStats;