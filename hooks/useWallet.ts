'use client';

import { useState, useEffect, useCallback } from 'react';
import { connectWallet as connectWeb3Wallet, isConnectedToBase, switchToBase } from '@/lib/web3/provider';

interface UseWalletReturn {
  wallet: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<boolean>;
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check if wallet was previously connected
  useEffect(() => {
    const checkPreviousConnection = async () => {
      if (typeof window === 'undefined') return;

      const savedWallet = localStorage.getItem('connected_wallet');
      if (savedWallet && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0 && accounts[0] === savedWallet) {
            setWallet(savedWallet);
            setIsConnected(true);
          } else {
            localStorage.removeItem('connected_wallet');
          }
        } catch (error) {
          console.error('Error checking previous connection:', error);
          localStorage.removeItem('connected_wallet');
        }
      }
    };

    checkPreviousConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWallet(null);
        setIsConnected(false);
        localStorage.removeItem('connected_wallet');
      } else if (accounts[0] !== wallet) {
        setWallet(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('connected_wallet', accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes to ensure everything updates properly
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [wallet]);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      const connectedAddress = await connectWeb3Wallet();
      if (connectedAddress) {
        setWallet(connectedAddress);
        setIsConnected(true);
        localStorage.setItem('connected_wallet', connectedAddress);
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      // You could show a toast notification here
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setIsConnected(false);
    localStorage.removeItem('connected_wallet');
  }, []);

  const switchNetwork = useCallback(async (): Promise<boolean> => {
    try {
      return await switchToBase();
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
    }
  }, []);

  return {
    wallet,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
}