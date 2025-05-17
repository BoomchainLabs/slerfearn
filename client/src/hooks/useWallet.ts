import { useState, useEffect } from 'react';

export interface WalletState {
  address: string | null;
  provider: any;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  
  // Initialize from local storage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('slerfhub-wallet');
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet);
        setWallet(parsedWallet);
      } catch (e) {
        console.error('Failed to parse saved wallet:', e);
        localStorage.removeItem('slerfhub-wallet');
      }
    }
  }, []);
  
  // Connect wallet
  const connectWallet = async (providerType?: string) => {
    // For demo purposes, simulate a wallet connection
    const mockWallet: WalletState = {
      address: '0x' + Math.random().toString(16).slice(2, 42),
      provider: null,
      isConnecting: false,
      isConnected: true,
      chainId: 1, // Ethereum Mainnet
      balance: (Math.random() * 10).toFixed(4) + ' ETH'
    };
    
    setWallet(mockWallet);
    localStorage.setItem('slerfhub-wallet', JSON.stringify(mockWallet));
    
    return mockWallet;
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem('slerfhub-wallet');
  };
  
  return {
    wallet,
    connectWallet,
    disconnectWallet
  };
}