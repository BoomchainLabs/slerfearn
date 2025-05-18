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
  type: 'transfer' | 'contract' | 'token';
  tokenSymbol?: string;
  tokenValue?: string;
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

// Function to get recent transactions (real implementation would connect to an actual node)
export const getRecentTransactions = async (
  count: number = 10
): Promise<BlockchainTransaction[]> => {
  try {
    // In a real implementation, this would connect to Ethereum and get real transactions
    // For now, we'll return simulated data
    
    // Generate random addresses
    const generateAddress = () => {
      return `0x${Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
    };
    
    // Current timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    
    // Generate random transactions
    return Array.from({length: count}, (_, i) => {
      const isToken = Math.random() > 0.7;
      const isContract = !isToken && Math.random() > 0.5;
      
      const txType = isToken 
        ? 'token' 
        : isContract 
          ? 'contract' 
          : 'transfer';
      
      const value = ethers.parseEther(
        (Math.random() * 10).toFixed(4)
      ).toString();
      
      return {
        hash: `0x${Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`,
        from: generateAddress(),
        to: Math.random() > 0.05 ? generateAddress() : null, // Some txs might not have 'to'
        value,
        timestamp: now - Math.floor(Math.random() * 3600), // Random time within last hour
        blockNumber: 18000000 - i, // Close to current Ethereum block
        gasUsed: (Math.random() * 1000000).toFixed(0),
        status: Math.random() > 0.1 ? 'confirmed' : 'pending',
        type: txType,
        ...(isToken && {
          tokenSymbol: ['LERF', 'ETH', 'USDT', 'USDC'][Math.floor(Math.random() * 4)],
          tokenValue: (Math.random() * 1000).toFixed(2)
        })
      };
    });
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