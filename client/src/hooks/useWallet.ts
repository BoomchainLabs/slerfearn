import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { WalletInfo, connectWallet } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  wallet: WalletInfo | null;
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

export const WalletProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const connect = async () => {
    try {
      setConnecting(true);
      const walletInfo = await connectWallet();
      if (walletInfo) {
        setWallet(walletInfo);
        localStorage.setItem("walletConnected", "true");
        toast({
          title: "Wallet Connected",
          description: `Connected to ${walletInfo.shortAddress}`,
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem("walletConnected");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem("walletConnected") === "true";
      if (wasConnected) {
        try {
          await connect();
        } catch (error) {
          console.error("Error reconnecting:", error);
          localStorage.removeItem("walletConnected");
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (wallet && accounts[0] !== wallet.address) {
          // User switched accounts
          connect();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => {
        // Handle chain changes by reconnecting
        connect();
      });

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", () => {});
      };
    }
  }, [wallet]);

  return (
    <WalletContext.Provider value={{ wallet, connecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
