import { ethers } from 'ethers';

// Transaction interface
export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  status: 'confirmed' | 'pending';
  type: 'transfer' | 'contract' | 'token' | 'cross-chain';
  tokenSymbol?: string;
  tokenValue?: string;
  network?: string;
  destinationNetwork?: string; // For cross-chain transactions
  bridgeName?: string; // For cross-chain transactions
}

// Function to connect to Ethereum provider
export const connectToEthereum = async (): Promise<ethers.BrowserProvider | null> => {
  try {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return provider;
    } else {
      throw new Error('No Ethereum provider found. Please install MetaMask or another wallet.');
    }
  } catch (error) {
    console.error('Error connecting to Ethereum provider:', error);
    return null;
  }
};

// Function to get recent transactions from multiple networks
export const getRecentTransactions = async (
  count: number = 10,
  networkFilter?: string
): Promise<BlockchainTransaction[]> => {
  try {
    // In a real implementation, this would connect to multiple blockchains and get real transactions
    // For now, we'll return simulated data with multi-chain support
    
    // Generate random addresses
    const generateAddress = () => {
      return `0x${Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
    };
    
    // List of supported networks
    const networks = [
      'Base', // Primary network for SLERF
      'Ethereum',
      'Optimism',
      'Arbitrum',
      'Polygon'
    ];
    
    // Current timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    
    // Generate random transactions
    const transactions = Array.from({length: count * 2}, (_, i) => {
      // Determine transaction type with weighted probabilities
      const rand = Math.random();
      const isCrossChain = rand < 0.2; // 20% chance of cross-chain tx
      const isToken = rand >= 0.2 && rand < 0.6; // 40% chance of token tx
      const isContract = rand >= 0.6 && rand < 0.8; // 20% chance of contract tx
      // 20% chance of regular transfer
      
      // More weight for Base network for SLERF transactions
      const selectedNetwork = Math.random() < 0.6 
        ? 'Base' 
        : networks[Math.floor(Math.random() * networks.length)];
      
      // Different block heights for different networks
      const blockNumberMap: {[key: string]: number} = {
        'Base': 5000000 - i,
        'Ethereum': 18000000 - i,
        'Optimism': 12000000 - i,
        'Arbitrum': 15000000 - i,
        'Polygon': 45000000 - i
      };
      
      // Determine transaction type
      const txType = isCrossChain 
        ? 'cross-chain' as const
        : isToken 
          ? 'token' as const
          : isContract 
            ? 'contract' as const
            : 'transfer' as const;
      
      // Value range depends on network (Base has lower values due to gas efficiency)
      const maxValue = selectedNetwork === 'Base' ? 5 : 10;
      const value = ethers.parseEther(
        (Math.random() * maxValue).toFixed(4)
      ).toString();
      
      // Get destination network for cross-chain transactions
      let destinationNetwork: string | undefined = undefined;
      if (isCrossChain) {
        const availableNetworks = networks.filter(n => n !== selectedNetwork);
        destinationNetwork = availableNetworks[Math.floor(Math.random() * availableNetworks.length)];
      }
      
      // Bridges for cross-chain transactions
      const bridges = ['LayerZero', 'Stargate', 'Wormhole', 'Across', 'Synapse', 'Connext'];
      
      // Token symbols by network (with LERF featured prominently on Base)
      const tokensByNetwork: {[key: string]: string[]} = {
        'Base': ['LERF', 'USDbC', 'USDC', 'ETH', 'cbETH'],
        'Ethereum': ['ETH', 'USDC', 'USDT', 'WBTC', 'DAI'],
        'Optimism': ['OP', 'ETH', 'USDC', 'USDT', 'DAI'],
        'Arbitrum': ['ARB', 'ETH', 'USDC', 'USDT', 'DAI'],
        'Polygon': ['MATIC', 'USDC', 'USDT', 'WETH', 'WBTC']
      };
      
      // Higher probability for LERF tokens on Base
      let selectedToken = '';
      if (isToken || isCrossChain) {
        if (selectedNetwork === 'Base' && Math.random() < 0.7) {
          selectedToken = 'LERF';
        } else {
          const tokens = tokensByNetwork[selectedNetwork] || tokensByNetwork['Ethereum'];
          selectedToken = tokens[Math.floor(Math.random() * tokens.length)];
        }
      }
      
      return {
        hash: `0x${Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`,
        from: generateAddress(),
        to: Math.random() > 0.05 ? generateAddress() : null, // Some txs might not have 'to'
        value,
        timestamp: now - Math.floor(Math.random() * 3600), // Random time within last hour
        blockNumber: blockNumberMap[selectedNetwork] || 18000000 - i,
        gasUsed: (Math.random() * (selectedNetwork === 'Base' ? 500000 : 1000000)).toFixed(0),
        status: Math.random() > 0.1 ? 'confirmed' as const : 'pending' as const,
        type: txType,
        network: selectedNetwork,
        ...(isToken && {
          tokenSymbol: selectedToken,
          tokenValue: (Math.random() * 1000).toFixed(2)
        }),
        ...(isCrossChain && {
          tokenSymbol: selectedToken,
          tokenValue: (Math.random() * 500).toFixed(2),
          destinationNetwork,
          bridgeName: bridges[Math.floor(Math.random() * bridges.length)]
        })
      };
    });
    
    // Filter by network if specified
    const filteredTransactions = networkFilter 
      ? transactions.filter(tx => tx.network === networkFilter)
      : transactions;
    
    // Sort by timestamp (newest first)
    filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);
    
    // Return only the requested count
    return filteredTransactions.slice(0, count);
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
};

// Function to get transaction details (real implementation would connect to an actual node)
export const getTransactionDetails = async (
  hash: string
): Promise<BlockchainTransaction | null> => {
  try {
    // In a real implementation, this would fetch specific transaction details
    // For now, we'll return a simulated transaction that matches the hash
    
    const generateAddress = () => {
      return `0x${Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
    };
    
    const now = Math.floor(Date.now() / 1000);
    const isToken = Math.random() > 0.7;
    
    return {
      hash,
      from: generateAddress(),
      to: generateAddress(),
      value: ethers.parseEther(
        (Math.random() * 10).toFixed(4)
      ).toString(),
      timestamp: now - Math.floor(Math.random() * 3600),
      blockNumber: 18000000,
      gasUsed: (Math.random() * 1000000).toFixed(0),
      status: 'confirmed',
      type: isToken ? 'token' : 'transfer',
      ...(isToken && {
        tokenSymbol: 'LERF',
        tokenValue: (Math.random() * 1000).toFixed(2)
      })
    };
  } catch (error) {
    console.error(`Error fetching transaction details for ${hash}:`, error);
    return null;
  }
};

// Function to subscribe to new transactions (real implementation would use WebSockets)
export const subscribeToNewTransactions = (
  callback: (transaction: BlockchainTransaction) => void
): { unsubscribe: () => void } => {
  // In a real implementation, this would set up a WebSocket connection to receive new transactions
  // For now, we'll simulate new transactions at random intervals
  
  const intervalId = setInterval(() => {
    getRecentTransactions(1)
      .then(transactions => {
        if (transactions.length > 0) {
          callback(transactions[0]);
        }
      })
      .catch(error => console.error('Error in transaction subscription:', error));
  }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds
  
  return {
    unsubscribe: () => clearInterval(intervalId)
  };
};