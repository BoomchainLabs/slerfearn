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
  priceHistory?: PricePoint[];
}

export interface PricePoint {
  timestamp: number;
  price: number;
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

// Generate realistic price history data for the last 7 days
const generatePriceHistory = (currentPrice: number, volatility = 0.05) => {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const hourlyIntervals = 7 * 24; // 7 days with hourly data points
  
  let lastPrice = currentPrice * (1 - Math.random() * 0.2); // Start 0-20% lower than current price
  
  return Array.from({ length: hourlyIntervals }, (_, i) => {
    const timestamp = sevenDaysAgo + (i * 60 * 60 * 1000);
    
    // Generate random price movement with more volatility during "market hours"
    const hour = new Date(timestamp).getUTCHours();
    const isMarketHours = hour >= 12 && hour <= 20; // UTC time window when markets are most active
    
    const maxChange = isMarketHours ? volatility * 1.5 : volatility * 0.5;
    const priceChange = lastPrice * (Math.random() * maxChange * 2 - maxChange);
    
    // Add occasional price spikes (10% chance)
    const hasSpike = Math.random() < 0.1;
    const spike = hasSpike ? lastPrice * (Math.random() * 0.15 * (Math.random() > 0.5 ? 1 : -1)) : 0;
    
    // Calculate new price with change + spike
    lastPrice = Math.max(lastPrice + priceChange + spike, 0.00000001); // Ensure price doesn't go negative
    
    return {
      timestamp,
      price: lastPrice
    };
  });
};

// Simulate real-time price data with realistic movements
let simulatedPrice = 1.9374;
let simulatedVolume = 927000;
let simulatedChange = 15.2;
let lastUpdate = Date.now();
let priceHistory = generatePriceHistory(simulatedPrice);

// Update price every minute with realistic movements
const startPriceSimulation = () => {
  if (typeof window !== 'undefined') {
    setInterval(() => {
      const now = Date.now();
      
      // More volatility during "market hours"
      const hour = new Date().getUTCHours();
      const isMarketHours = hour >= 12 && hour <= 20;
      
      // Base volatility
      const baseVolatility = 0.008; // 0.8% base volatility
      const volatility = isMarketHours ? baseVolatility * 1.5 : baseVolatility * 0.7;
      
      // Random price change with slight bias towards positive movement (crypto optimism)
      const biasedRandom = Math.random() * 1.1 - 0.5; // Biased slightly positive
      const percentChange = biasedRandom * volatility;
      
      // Apply change to price
      simulatedPrice = Math.max(simulatedPrice * (1 + percentChange), 0.00000001);
      
      // Calculate 24h change
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const yesterdayPrice = priceHistory.find(p => p.timestamp >= oneDayAgo)?.price || simulatedPrice * 0.95;
      simulatedChange = ((simulatedPrice - yesterdayPrice) / yesterdayPrice) * 100;
      
      // Add random volume changes (5-15% fluctuation)
      const volumeChange = Math.random() * 0.1 + 0.05;
      simulatedVolume = simulatedVolume * (1 + (Math.random() > 0.5 ? volumeChange : -volumeChange));
      
      // Add new price point to history
      priceHistory.push({
        timestamp: now,
        price: simulatedPrice
      });
      
      // Keep only the last 7 days of data
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      priceHistory = priceHistory.filter(p => p.timestamp >= sevenDaysAgo);
      
      lastUpdate = now;
    }, 20000); // Update every 20 seconds for demo purposes
  }
};

// Start the simulation if we're in the browser
if (typeof window !== 'undefined') {
  startPriceSimulation();
}

// Fetch token price data with simulated real-time updates
export const fetchTokenData = async (): Promise<TokenData> => {
  try {
    // Calculate market cap based on current price (2.5 million supply)
    const marketCap = simulatedPrice * 2500000;
    
    // Format numbers for display
    const formatCurrency = (num: number) => {
      if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}K`;
      } else {
        return `$${num.toFixed(0)}`;
      }
    };
    
    // Format the change with + or - sign
    const formattedChange = `${simulatedChange >= 0 ? '+' : ''}${simulatedChange.toFixed(1)}%`;
    
    return {
      price: simulatedPrice,
      change: formattedChange,
      holders: '12,930',
      marketCap: formatCurrency(marketCap),
      volume: formatCurrency(simulatedVolume),
      address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
      symbol: 'LERF',
      decimals: 18,
      network: 'Ethereum',
      chainId: 1,
      priceHistory: priceHistory
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