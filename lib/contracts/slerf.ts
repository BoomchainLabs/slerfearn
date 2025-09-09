// SLERF Token Contract Integration
// Contract Address: 0x233df63325933fa3f2dac8e695cd84bb2f91ab07 (Base Network)

export const SLERF_CONTRACT_ADDRESS = '0x233df63325933fa3f2dac8e695cd84bb2f91ab07';
export const BASE_CHAIN_ID = 8453;

// SLERF Token ABI (ERC-20 standard functions we need)
export const SLERF_ABI = [
  // Read functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  
  // Write functions
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
] as const;

// Base network configuration
export const BASE_NETWORK = {
  id: BASE_CHAIN_ID,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://mainnet.base.org'] },
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    etherscan: { name: 'BaseScan', url: 'https://basescan.org' },
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
  },
} as const;

// Game reward configuration
export const GAME_REWARDS = {
  SPIN_GAME: {
    MIN_REWARD: '1000000000000000000', // 1 SLERF
    MAX_REWARD: '10000000000000000000', // 10 SLERF
    COOLDOWN: 300000, // 5 minutes in milliseconds
  },
  MATCH_OUT_GAME: {
    EASY_REWARD: '2000000000000000000', // 2 SLERF
    MEDIUM_REWARD: '5000000000000000000', // 5 SLERF
    HARD_REWARD: '10000000000000000000', // 10 SLERF
    PERFECT_BONUS: '20000000000000000000', // 20 SLERF
  },
  DAILY_MISSION: {
    BASIC_REWARD: '500000000000000000', // 0.5 SLERF
    PREMIUM_REWARD: '2000000000000000000', // 2 SLERF
  },
  STAKING_APY: {
    VAULT_1: 12, // 12% APY
    VAULT_2: 25, // 25% APY
    VAULT_3: 50, // 50% APY (high risk)
  }
} as const;

// Utility functions
export const formatSLERF = (amount: string | bigint, decimals: number = 18): string => {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const wholePart = value / divisor;
  const fractionalPart = value % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return trimmedFractional.length > 0 
    ? `${wholePart}.${trimmedFractional}`
    : wholePart.toString();
};

export const parseSLERF = (amount: string, decimals: number = 18): string => {
  const [whole = '0', fractional = ''] = amount.split('.');
  const paddedFractional = fractional.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFractional)).toString();
};