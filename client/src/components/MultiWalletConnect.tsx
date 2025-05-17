import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import slerfLogo from '@/assets/slerf-logo.svg';
import { useWallet } from '@/hooks/useWallet';

// Animation variants
const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.1 } 
  }
};

// Wallet categories
interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  popularityScore: number; // 1-10 scale
  rewardAmount: number;
  connectorId?: string;
  downloadUrl?: string;
  isMobile?: boolean;
  isDesktop?: boolean;
  chains: string[];
}

// Wallet categories
const walletCategories = [
  {
    id: 'popular',
    name: 'Popular',
    description: 'Most commonly used wallets',
    wallets: [
      {
        id: 'metamask',
        name: 'MetaMask',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
        description: 'The most popular Ethereum wallet',
        popularityScore: 10,
        rewardAmount: 50,
        connectorId: 'injected',
        downloadUrl: 'https://metamask.io/download/',
        isDesktop: true,
        isMobile: true,
        chains: ['Ethereum', 'BSC', 'Arbitrum', 'Polygon']
      },
      {
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: 'https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png',
        description: 'Connect with your mobile wallet',
        popularityScore: 9,
        rewardAmount: 50,
        connectorId: 'walletconnect',
        isDesktop: true,
        isMobile: true,
        chains: ['Ethereum', 'BSC', 'Arbitrum', 'Polygon', 'Avalanche']
      },
      {
        id: 'coinbase',
        name: 'Coinbase Wallet',
        icon: 'https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.webp',
        description: 'The wallet by Coinbase',
        popularityScore: 8,
        rewardAmount: 50,
        connectorId: 'coinbase',
        downloadUrl: 'https://www.coinbase.com/wallet',
        isDesktop: true,
        isMobile: true,
        chains: ['Ethereum', 'BSC', 'Arbitrum', 'Polygon']
      },
      {
        id: 'trustwallet',
        name: 'Trust Wallet',
        icon: 'https://trustwallet.com/assets/images/media/assets/TWT.svg',
        description: 'The most trusted & secure crypto wallet',
        popularityScore: 8,
        rewardAmount: 50,
        connectorId: 'trust',
        downloadUrl: 'https://trustwallet.com/download',
        isDesktop: false,
        isMobile: true,
        chains: ['Ethereum', 'BSC', 'Arbitrum', 'Polygon', 'Avalanche']
      }
    ]
  },
  {
    id: 'evm',
    name: 'Ethereum & EVM',
    description: 'Wallets compatible with Ethereum & EVM chains',
    wallets: [
      {
        id: 'rainbow',
        name: 'Rainbow',
        icon: 'https://assets.website-files.com/5fc9e7b20668db2371fd1847/5fcf85048eec58120991b265_rainbow.png',
        description: 'The fun, simple way to start your Web3 journey',
        popularityScore: 7,
        rewardAmount: 60,
        connectorId: 'rainbow',
        downloadUrl: 'https://rainbow.me',
        isDesktop: true,
        isMobile: true,
        chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism']
      },
      {
        id: 'brave',
        name: 'Brave Wallet',
        icon: 'https://brave.com/static-assets/images/brave-logo-no-shadow.svg',
        description: 'Built into the Brave browser',
        popularityScore: 6,
        rewardAmount: 60,
        connectorId: 'brave',
        downloadUrl: 'https://brave.com',
        isDesktop: true,
        isMobile: true,
        chains: ['Ethereum', 'BSC', 'Polygon', 'Solana']
      },
      {
        id: 'argent',
        name: 'Argent',
        icon: 'https://play-lh.googleusercontent.com/mzJLSB0yYiho9B8UFc_ude4QIv8NZgfvGIRFRFrD_9gQK4PY1QOeW-orO94vQmcFGRg',
        description: 'Simple and secure smart contract wallet',
        popularityScore: 6,
        rewardAmount: 60,
        connectorId: 'argent',
        downloadUrl: 'https://argent.xyz',
        isDesktop: false,
        isMobile: true,
        chains: ['Ethereum', 'zkSync', 'StarkNet']
      },
      {
        id: 'frame',
        name: 'Frame',
        icon: 'https://frame.sh/icons/png/512x512.png',
        description: 'A private Ethereum wallet',
        popularityScore: 5,
        rewardAmount: 70,
        connectorId: 'frame',
        downloadUrl: 'https://frame.sh',
        isDesktop: true,
        isMobile: false,
        chains: ['Ethereum']
      }
    ]
  },
  {
    id: 'solana',
    name: 'Solana',
    description: 'Solana blockchain wallets',
    wallets: [
      {
        id: 'phantom',
        name: 'Phantom',
        icon: 'https://phantom.app/img/logo.png',
        description: 'A friendly Solana wallet built for DeFi & NFTs',
        popularityScore: 9,
        rewardAmount: 50,
        connectorId: 'phantom',
        downloadUrl: 'https://phantom.app',
        isDesktop: true,
        isMobile: true,
        chains: ['Solana', 'Ethereum']
      },
      {
        id: 'solflare',
        name: 'Solflare',
        icon: 'https://solflare.com/assets/logo/solflare-logo.svg',
        description: 'Non-custodial Solana wallet',
        popularityScore: 7,
        rewardAmount: 60,
        connectorId: 'solflare',
        downloadUrl: 'https://solflare.com',
        isDesktop: true,
        isMobile: true,
        chains: ['Solana']
      },
      {
        id: 'slope',
        name: 'Slope',
        icon: 'https://slope.finance/assets/slope_logo_icon.svg',
        description: 'The best cross-platform Solana wallet',
        popularityScore: 6,
        rewardAmount: 70,
        connectorId: 'slope',
        downloadUrl: 'https://slope.finance',
        isDesktop: true,
        isMobile: true,
        chains: ['Solana']
      }
    ]
  },
  {
    id: 'hardware',
    name: 'Hardware',
    description: 'Secure hardware wallets',
    wallets: [
      {
        id: 'ledger',
        name: 'Ledger',
        icon: 'https://cdn.shopify.com/s/files/1/2974/4858/files/ledger-icon_140x.png',
        description: 'The world\'s most popular hardware wallet',
        popularityScore: 10,
        rewardAmount: 100,
        connectorId: 'ledger',
        downloadUrl: 'https://www.ledger.com',
        isDesktop: true,
        isMobile: false,
        chains: ['Ethereum', 'Solana', 'BSC', 'Polygon', 'Bitcoin', 'Many more']
      },
      {
        id: 'trezor',
        name: 'Trezor',
        icon: 'https://trezor.io/static/images/trezor-logo.svg',
        description: 'The original hardware wallet',
        popularityScore: 9,
        rewardAmount: 100,
        connectorId: 'trezor',
        downloadUrl: 'https://trezor.io',
        isDesktop: true,
        isMobile: false,
        chains: ['Ethereum', 'Bitcoin', 'Many more']
      }
    ]
  },
  {
    id: 'more',
    name: 'More Wallets',
    description: 'Additional wallet options',
    wallets: [
      {
        id: 'binance',
        name: 'Binance Wallet',
        icon: 'https://public.bnbstatic.com/static/images/common/favicon.ico',
        description: 'Binance\'s official crypto wallet',
        popularityScore: 8,
        rewardAmount: 50,
        connectorId: 'binance',
        downloadUrl: 'https://www.binance.com/en/wallet-direct',
        isDesktop: true,
        isMobile: true,
        chains: ['BSC', 'Ethereum']
      },
      {
        id: 'crypto.com',
        name: 'Crypto.com DeFi Wallet',
        icon: 'https://crypto.com/eea/nft/marketplace/assets/networks/cronos.svg',
        description: 'Your keys, your crypto',
        popularityScore: 7,
        rewardAmount: 60,
        connectorId: 'crypto_defi',
        downloadUrl: 'https://crypto.com/defi-wallet',
        isDesktop: false,
        isMobile: true,
        chains: ['Cronos', 'Ethereum', 'BSC']
      },
      {
        id: 'exodus',
        name: 'Exodus',
        icon: 'https://www.exodus.com/favicon.ico',
        description: 'The world\'s leading desktop, mobile and hardware crypto wallets',
        popularityScore: 7,
        rewardAmount: 60,
        connectorId: 'exodus',
        downloadUrl: 'https://www.exodus.com',
        isDesktop: true,
        isMobile: true,
        chains: ['Ethereum', 'Solana', 'BSC', 'Many more']
      },
      {
        id: 'safepal',
        name: 'SafePal',
        icon: 'https://raw.githubusercontent.com/SafePalWallet/safepal-app/master/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
        description: 'Secure and powerful digital wallet',
        popularityScore: 6,
        rewardAmount: 70,
        connectorId: 'safepal',
        downloadUrl: 'https://safepal.io',
        isDesktop: false,
        isMobile: true,
        chains: ['BSC', 'Ethereum', 'Solana', 'Polygon', 'Many more']
      }
    ]
  }
];

interface MultiWalletConnectProps {
  onWalletConnected?: (wallet: string) => void;
}

const MultiWalletConnect: React.FC<MultiWalletConnectProps> = ({ onWalletConnected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [connectionStep, setConnectionStep] = useState<'select' | 'connecting' | 'connected' | 'install'>('select');
  const [rewardEarned, setRewardEarned] = useState(false);
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const { toast } = useToast();
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Filter wallets based on device type
  const getFilteredWallets = (wallets: WalletOption[]) => {
    return wallets.filter(w => isMobile ? w.isMobile : w.isDesktop);
  };
  
  // Open the wallet selection modal
  const openWalletModal = () => {
    setIsModalOpen(true);
    setConnectionStep('select');
    setSelectedWallet(null);
    setRewardEarned(false);
  };
  
  // Close the wallet selection modal
  const closeWalletModal = () => {
    setIsModalOpen(false);
  };
  
  // Handle wallet selection
  const handleWalletSelect = (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    
    // Check if wallet needs to be installed
    if (wallet.id === 'metamask' && !window.ethereum) {
      setConnectionStep('install');
      return;
    }
    
    // Simulate connection process
    setConnectionStep('connecting');
    
    // Simulate connection time
    setTimeout(() => {
      // Connect wallet using the wallet connector
      connectWallet();
      
      // Show success notification with reward
      toast({
        title: `Connected to ${wallet.name}`,
        description: `You've earned ${wallet.rewardAmount} SLERF tokens for connecting!`,
      });
      
      setConnectionStep('connected');
      setRewardEarned(true);
      
      // Trigger callback if provided
      if (onWalletConnected) {
        onWalletConnected(wallet.id);
      }
    }, 1500);
  };
  
  // Handle wallet installation
  const handleInstallWallet = () => {
    if (selectedWallet?.downloadUrl) {
      window.open(selectedWallet.downloadUrl, '_blank');
    }
  };
  
  // Handle disconnect wallet
  const handleDisconnect = () => {
    disconnectWallet();
    closeWalletModal();
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been successfully disconnected",
    });
  };
  
  return (
    <>
      <Button 
        onClick={wallet ? openWalletModal : openWalletModal}
        className={`relative ${wallet ? 'border border-slerf-cyan text-slerf-cyan bg-transparent hover:bg-slerf-cyan/10' : 'bg-slerf-cyan text-slerf-dark hover:bg-slerf-cyan/90'}`}
      >
        {wallet ? (
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Connected
          </span>
        ) : (
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <path d="M9 11h6"></path>
              <path d="M9 15h6"></path>
            </svg>
            Connect Wallet
          </span>
        )}
      </Button>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass p-0 max-w-3xl sm:rounded-lg overflow-hidden border-slerf-dark-lighter">
          <DialogHeader className="p-6 pb-2">
            {connectionStep === 'select' && (
              <DialogTitle className="text-2xl font-bold font-space">Connect Wallet and Earn SLERF</DialogTitle>
            )}
            {connectionStep === 'connecting' && (
              <DialogTitle className="text-2xl font-bold font-space">Connecting to {selectedWallet?.name}</DialogTitle>
            )}
            {connectionStep === 'connected' && (
              <DialogTitle className="text-2xl font-bold font-space">Wallet Connected</DialogTitle>
            )}
            {connectionStep === 'install' && (
              <DialogTitle className="text-2xl font-bold font-space">Install {selectedWallet?.name}</DialogTitle>
            )}
            
            <DialogDescription>
              {connectionStep === 'select' && (
                <div className="flex items-center">
                  <span className="text-gray-300">Choose your preferred wallet to connect and earn SLERF tokens as a reward</span>
                </div>
              )}
              {connectionStep === 'connecting' && (
                <span className="text-gray-300">Please approve the connection request in your wallet</span>
              )}
              {connectionStep === 'connected' && (
                <span className="text-gray-300">Your wallet has been successfully connected to SlerfHub</span>
              )}
              {connectionStep === 'install' && (
                <span className="text-gray-300">{selectedWallet?.name} is not installed. Click the button below to download and install.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            {connectionStep === 'select' && (
              <motion.div
                key="select"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInScale}
                className="p-4"
              >
                <Tabs
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="popular" className="text-xs md:text-sm whitespace-nowrap">
                      Popular
                    </TabsTrigger>
                    <TabsTrigger value="evm" className="text-xs md:text-sm whitespace-nowrap">
                      Ethereum/EVM
                    </TabsTrigger>
                    <TabsTrigger value="solana" className="text-xs md:text-sm whitespace-nowrap">
                      Solana
                    </TabsTrigger>
                    <TabsTrigger value="hardware" className="text-xs md:text-sm whitespace-nowrap">
                      Hardware
                    </TabsTrigger>
                    <TabsTrigger value="more" className="text-xs md:text-sm whitespace-nowrap">
                      More
                    </TabsTrigger>
                  </TabsList>
                  
                  {walletCategories.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {getFilteredWallets(category.wallets).map((walletOption) => (
                          <div
                            key={walletOption.id}
                            className="glass-dark p-4 rounded-lg hover:bg-slerf-dark-light/50 cursor-pointer transition-colors"
                            onClick={() => handleWalletSelect(walletOption)}
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center mr-3">
                                <img 
                                  src={walletOption.icon} 
                                  alt={walletOption.name}
                                  className="w-8 h-8 object-contain" 
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{walletOption.name}</h3>
                                <p className="text-xs text-gray-400">{walletOption.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex">
                                {walletOption.chains.slice(0, 3).map((chain, i) => (
                                  <div 
                                    key={`${walletOption.id}-${chain}`} 
                                    className="text-xs px-2 py-0.5 rounded-full bg-slerf-dark-light mr-1"
                                    title={chain}
                                  >
                                    {chain.slice(0, 1)}
                                  </div>
                                ))}
                                {walletOption.chains.length > 3 && (
                                  <div className="text-xs px-2 py-0.5 rounded-full bg-slerf-dark-light">
                                    +{walletOption.chains.length - 3}
                                  </div>
                                )}
                              </div>
                              <div className="text-slerf-cyan text-xs">
                                +{walletOption.rewardAmount} SLERF
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                
                <div className="mt-4 p-4 glass-dark rounded-lg">
                  <h3 className="font-medium mb-2">Why connect your wallet?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Earn SLERF tokens and rewards by participating in platform activities</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access quests, games, and exclusive features</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Track your assets, staking positions, and NFTs in one place</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
            
            {connectionStep === 'connecting' && selectedWallet && (
              <motion.div
                key="connecting"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInScale}
                className="p-6 flex flex-col items-center justify-center"
              >
                <div className="mb-8 relative">
                  <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center">
                    <img 
                      src={selectedWallet.icon} 
                      alt={selectedWallet.name}
                      className="w-16 h-16 object-contain" 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slerf-dark p-1">
                    <div className="animate-spin w-full h-full border-2 border-slerf-cyan border-t-transparent rounded-full"></div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2">Connecting to {selectedWallet.name}</h3>
                  <p className="text-gray-400">
                    Confirm the connection request in your wallet to continue
                  </p>
                </div>
                
                <div className="glass-dark p-4 rounded-lg w-full max-w-md mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Connection Status</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">Pending</span>
                  </div>
                  <div className="w-full bg-slerf-dark rounded-full h-2 mb-4">
                    <div className="bg-slerf-cyan h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Initializing</span>
                    <span>Approving</span>
                    <span>Connected</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mb-4">
                  Don't see a request? Try refreshing your wallet app.
                </p>
                
                <Button
                  variant="outline"
                  onClick={closeWalletModal}
                >
                  Cancel
                </Button>
              </motion.div>
            )}
            
            {connectionStep === 'connected' && selectedWallet && (
              <motion.div
                key="connected"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInScale}
                className="p-6 flex flex-col items-center justify-center"
              >
                <div className="mb-6 relative">
                  <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center">
                    <img 
                      src={selectedWallet.icon} 
                      alt={selectedWallet.name}
                      className="w-16 h-16 object-contain" 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Successfully Connected!</h3>
                  <p className="text-gray-400">
                    Your {selectedWallet.name} wallet is now connected to SlerfHub
                  </p>
                </div>
                
                {rewardEarned && (
                  <div className="glass p-4 rounded-lg w-full max-w-md mb-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <img src={slerfLogo} alt="SLERF" className="w-6 h-6 mr-1" />
                      <span className="text-lg font-bold text-slerf-cyan">+{selectedWallet.rewardAmount} SLERF</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You've earned {selectedWallet.rewardAmount} SLERF tokens for connecting your wallet!
                    </p>
                  </div>
                )}
                
                <div className="glass-dark p-4 rounded-lg w-full max-w-md mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400">Connection Status</span>
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Connected</span>
                  </div>
                  <div className="w-full bg-slerf-dark rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={closeWalletModal}
                    className="bg-slerf-cyan text-slerf-dark hover:bg-slerf-cyan/90"
                  >
                    Continue to SlerfHub
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              </motion.div>
            )}
            
            {connectionStep === 'install' && selectedWallet && (
              <motion.div
                key="install"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInScale}
                className="p-6 flex flex-col items-center justify-center"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center">
                    <img 
                      src={selectedWallet.icon} 
                      alt={selectedWallet.name}
                      className="w-16 h-16 object-contain" 
                    />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{selectedWallet.name} Not Detected</h3>
                  <p className="text-gray-400">
                    To connect with {selectedWallet.name}, you need to install it first.
                  </p>
                </div>
                
                <div className="glass-dark p-4 rounded-lg w-full max-w-md mb-6">
                  <h4 className="font-medium mb-2">Installation Instructions:</h4>
                  <ol className="list-decimal ml-5 text-gray-300 space-y-1">
                    <li>Download {selectedWallet.name} from their official website</li>
                    <li>Follow the installation instructions</li>
                    <li>Create or import a wallet</li>
                    <li>Return to SlerfHub and connect your wallet</li>
                  </ol>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handleInstallWallet}
                    className="bg-slerf-cyan text-slerf-dark hover:bg-slerf-cyan/90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Install {selectedWallet.name}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setConnectionStep('select')}
                  >
                    Back to Wallets
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MultiWalletConnect;