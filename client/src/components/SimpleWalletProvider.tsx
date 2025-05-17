import React, { createContext, useState, useContext, ReactNode } from "react";

// Define a simple wallet type
interface SimpleWallet {
  address: string;
  balance: number;
  isConnected: boolean;
}

// Create the context
interface WalletContextType {
  wallet: SimpleWallet | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
});

// Create a simple wallet provider that doesn't depend on external libraries
export const SimpleWalletProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [wallet, setWallet] = useState<SimpleWallet | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    try {
      setConnecting(true);
      // Simulate wallet connection with demo wallet
      setTimeout(() => {
        const demoWallet: SimpleWallet = {
          address: "0x1234...6789",
          balance: 1000,
          isConnected: true
        };
        setWallet(demoWallet);
        setConnecting(false);
      }, 500);
    } catch (error) {
      console.error("Connection error:", error);
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, connecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to use the wallet context
export const useSimpleWallet = () => useContext(WalletContext);