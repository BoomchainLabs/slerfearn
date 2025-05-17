import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from './use-toast';

// SLERF Token Contract Address
const SLERF_TOKEN_ADDRESS = '0x233df63325933fa3f2dac8e695cd84bb2f91ab07';

interface WalletContextType {
  wallet: string | null;
  balance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  transferTokens: (to: string, amount: number) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  balance: 0,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  transferTokens: async () => false,
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      setWallet(savedWallet);
      updateBalance(savedWallet);
    }
  }, []);

  // Update balance when wallet changes
  useEffect(() => {
    if (wallet) {
      updateBalance(wallet);
    }
  }, [wallet]);

  const updateBalance = async (address: string) => {
    try {
      // In a real implementation, this would fetch the actual token balance
      // from the blockchain using the SLERF token contract

      // For demo purposes, generate a random balance between 100 and 10000
      const mockBalance = Math.floor(Math.random() * 9900) + 100;
      setBalance(mockBalance);

      // In production, we would use:
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const tokenContract = new ethers.Contract(SLERF_TOKEN_ADDRESS, tokenAbi, provider);
      // const balance = await tokenContract.balanceOf(address);
      // setBalance(ethers.utils.formatUnits(balance, 18));
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          setWallet(address);
          localStorage.setItem('connectedWallet', address);
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${shortenAddress(address)}`,
          });
          
          updateBalance(address);
        }
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Could not connect to wallet. Please try again.",
          variant: "destructive",
        });
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      toast({
        title: "Wallet Not Detected",
        description: "Please install MetaMask or another Web3 wallet.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = (): void => {
    setWallet(null);
    setBalance(0);
    localStorage.removeItem('connectedWallet');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const transferTokens = async (to: string, amount: number): Promise<boolean> => {
    if (!wallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // In a real implementation, this would call the token contract's transfer method
      
      // For demo purposes, just simulate a transfer
      if (amount > balance) {
        toast({
          title: "Insufficient Balance",
          description: `You don't have enough SLERF tokens. Current balance: ${balance}`,
          variant: "destructive",
        });
        return false;
      }

      // Update balance as if transfer happened
      setBalance(prev => prev - amount);
      
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${amount} SLERF tokens to ${shortenAddress(to)}`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Could not complete the transfer. Please try again.",
        variant: "destructive",
      });
      console.error("Error transferring tokens:", error);
      return false;
    }
  };

  // Helper function to shorten wallet addresses
  const shortenAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <WalletContext.Provider value={{ wallet, balance, connectWallet, disconnectWallet, transferTokens }}>
      {children}
    </WalletContext.Provider>
  );
};

// Add this to global.d.ts or a declaration file
declare global {
  interface Window {
    ethereum?: any;
  }
}