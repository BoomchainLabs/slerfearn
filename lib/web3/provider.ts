// Web3 Provider Configuration with Real Wallet Integration
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { base } from 'viem/chains';
import { BASE_NETWORK } from '../contracts/slerf';

// Create public client for reading blockchain data
export const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

// Wallet connection utilities
export const connectWallet = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check if wallet is available
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Switch to Base network if needed
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base chain ID in hex
      });
    } catch (switchError: any) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x2105',
            chainName: 'Base',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
      }
    }

    return accounts[0];
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};

// Create wallet client for transactions
export const createWalletConnection = () => {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  
  return createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
  });
};

// Network switching utility
export const switchToBase = async () => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }],
    });
    return true;
  } catch (error) {
    console.error('Failed to switch to Base network:', error);
    return false;
  }
};

// Check if connected to Base network
export const isConnectedToBase = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === '0x2105';
  } catch {
    return false;
  }
};

// Global types for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
      removeListener: (event: string, callback: (data: any) => void) => void;
      isMetaMask?: boolean;
      selectedAddress?: string;
    };
  }
}