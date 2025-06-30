// Real $LERF Token Configuration from DexTools
export const LERF_TOKEN_CONFIG = {
  // Token Details from DexTools
  name: "Slerf",
  symbol: "$LERF",
  contractAddress: "0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
  pairAddress: "0xbd08f83afd361483f1325dd89cae2aaaa9387080",
  network: "base",
  logoUrl: "/src/assets/lerf-logo.png", // Real SLERF logo with sloth character
  
  // Real Market Data
  totalSupply: "100000000000", // 100.00B $LERF
  circulatingSupply: "100000000000", // 100.00B $LERF
  marketCap: 24430, // $24.43K
  liquidity: 22400, // $22.4K
  holders: 6,
  
  // Trading Data
  currentPrice: 0.00000002443, // $0.0₆2443
  priceInWETH: 0.0000000009872, // 0.0₁₀9872 WETH
  volume24h: 1.14, // $1.14
  
  // Tax Structure
  buyTax: 0, // 0%
  sellTax: 0, // 0%
  
  // Security Score
  dextScore: 46,
  auditScore: {
    information: 1,
    transactions: 91,
    holders: 9,
    audit: 74,
    pool: 12
  },
  
  // Contract Security
  contractRenounced: true,
  contractVerified: true,
  honeypot: false,
  
  // DEXTools URLs
  dextoolsUrl: "https://www.dextools.io/app/en/base/pair-explorer/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
  basescanUrl: "https://basescan.org/token/0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
  uniswapUrl: "https://app.uniswap.org/explore/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080"
};

// Token Distribution Strategy
export const TOKEN_DISTRIBUTION = {
  // Community Rewards Pool (40% of supply)
  communityPool: {
    amount: 40000000000, // 40B $LERF
    allocation: {
      dailyMissions: 15000000000, // 15B $LERF
      weeklyQuests: 10000000000, // 10B $LERF
      socialEngagement: 8000000000, // 8B $LERF
      referralRewards: 5000000000, // 5B $LERF
      specialEvents: 2000000000 // 2B $LERF
    }
  },
  
  // Market Making & Liquidity (30% of supply)
  marketPool: {
    amount: 30000000000, // 30B $LERF
    allocation: {
      liquidityProvision: 20000000000, // 20B $LERF
      marketMaking: 10000000000 // 10B $LERF
    }
  },
  
  // Trivia & Gaming Rewards (20% of supply)
  triviaPool: {
    amount: 20000000000, // 20B $LERF
    allocation: {
      dailyTrivia: 12000000000, // 12B $LERF
      weeklyTrivia: 5000000000, // 5B $LERF
      specialTrivia: 3000000000 // 3B $LERF
    }
  },
  
  // Wallet Connection Rewards (10% of supply)
  walletRewards: {
    amount: 10000000000, // 10B $LERF
    allocation: {
      firstConnection: 5000000000, // 5B $LERF
      multiWalletBonus: 3000000000, // 3B $LERF
      crossChainBonus: 2000000000 // 2B $LERF
    }
  }
};

// Reward Rates (in $LERF tokens)
export const REWARD_RATES = {
  // Daily Missions
  simpleMission: "1000000", // 1M $LERF
  mediumMission: "2500000", // 2.5M $LERF
  hardMission: "5000000", // 5M $LERF
  
  // Weekly Quests
  weeklyQuest: "10000000", // 10M $LERF
  specialQuest: "25000000", // 25M $LERF
  
  // Trivia Rewards
  dailyTrivia: "500000", // 500K $LERF
  weeklyTrivia: "2000000", // 2M $LERF
  perfectScore: "5000000", // 5M $LERF
  
  // Wallet Connection
  firstWallet: "1000000", // 1M $LERF
  secondWallet: "500000", // 500K $LERF
  crossChain: "2000000", // 2M $LERF
  
  // Social Engagement
  twitterFollow: "100000", // 100K $LERF
  discordJoin: "100000", // 100K $LERF
  githubStar: "200000", // 200K $LERF
  referralBonus: "1000000" // 1M $LERF
};

export default LERF_TOKEN_CONFIG;