import { apiRequest } from './queryClient';

// Token data types
export interface TokenData {
  price: number;
  change: string;
  holders: string;
  marketCap: string;
  volume: string;
  address: string;
  symbol: string;
  decimals: number;
  network: string;
  chainId: number;
}

// Staking information
export interface StakingInfo {
  apy: string;
  dailyRewards: string;
  distribution: string;
  minStake: string;
  lockPeriods: string[];
  totalStaked: string;
}

// Exchange interface
export interface Exchange {
  name: string;
  logo: string;
  url: string;
}

// Fetch token price data from CoinGecko
export const fetchTokenData = async (): Promise<TokenData> => {
  try {
    // If we have access to an API key, use it
    // In a real implementation, this would call the CoinGecko API
    // For now, we'll return the sample data
    return {
      price: 1.9374,
      change: '+15.2%',
      holders: '12,930',
      marketCap: '$4.8M',
      volume: '$927K',
      address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
      symbol: 'LERF',
      decimals: 18,
      network: 'Ethereum',
      chainId: 1
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
};

// Fetch staking information
export const fetchStakingInfo = async (): Promise<StakingInfo> => {
  try {
    // In a real implementation, this would query the staking contract
    return {
      apy: '15%',
      dailyRewards: '100+',
      distribution: '24/7',
      minStake: '1000 LERF',
      lockPeriods: ['30 days', '90 days', '180 days'],
      totalStaked: '4.2M LERF'
    };
  } catch (error) {
    console.error('Error fetching staking info:', error);
    throw error;
  }
};

// Fetch exchange listings
export const fetchExchanges = async (): Promise<Exchange[]> => {
  try {
    // In a real implementation, this would pull from a database or API
    return [
      { name: 'Uniswap', logo: '🦄', url: 'https://app.uniswap.org/#/swap' },
      { name: 'PancakeSwap', logo: '🥞', url: 'https://pancakeswap.finance/swap' },
      { name: 'SushiSwap', logo: '🍣', url: 'https://app.sushi.com/swap' }
    ];
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    throw error;
  }
};

// Fetch NFT collections
export const fetchNFTCollections = async () => {
  try {
    // In a real implementation, this would pull from an NFT API
    return [
      { id: 1, name: 'Cyber Cat #1000', floor: '3.5 SOL' },
      { id: 2, name: 'Cyber Cat #2000', floor: '3.5 SOL' },
      { id: 3, name: 'Cyber Cat #3000', floor: '3.5 SOL' }
    ];
  } catch (error) {
    console.error('Error fetching NFT collections:', error);
    throw error;
  }
};