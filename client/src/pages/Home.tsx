import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from '@/hooks/useWallet';
import Footer from '@/components/Footer';
import AnimatedCatLogo from '@/components/AnimatedCatLogo';
import SLERFAnimatedLogo from '@/components/SLERFAnimatedLogo';
import cyberCatLogo from '@/assets/cyber-cat-logo.svg';
import slerfLogo from '@/assets/slerf-logo.svg';
import { fetchTokenData, fetchStakingInfo, fetchExchanges, fetchNFTCollections } from '@/lib/api';
import { TokenData, StakingInfo, Exchange } from '@/lib/api';
import TransactionExplorer from '@/components/TransactionExplorer';
import TokenPriceChart from '@/components/TokenPriceChart';
import DailyTasks from '@/components/DailyTasks';

// Initial data states for before the real data loads
const initialTokenData: TokenData = {
  price: 0,
  change: '0%',
  holders: '0',
  marketCap: '$0',
  volume: '$0',
  address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
  symbol: 'LERF',
  decimals: 18,
  network: 'Ethereum',
  chainId: 1
};

const initialStakingInfo: StakingInfo = {
  apy: '0%',
  dailyRewards: '0',
  distribution: '24/7',
  minStake: '0 LERF',
  lockPeriods: ['30 days', '90 days', '180 days'],
  totalStaked: '0 LERF'
};

const initialExchanges: Exchange[] = [
  { name: 'Uniswap', logo: '🦄', url: 'https://app.uniswap.org/#/swap' },
  { name: 'PancakeSwap', logo: '🥞', url: 'https://pancakeswap.finance/swap' },
  { name: 'SushiSwap', logo: '🍣', url: 'https://app.sushi.com/swap' }
];

// Animation variants for elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const Home: React.FC = () => {
  const { wallet, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData>(initialTokenData);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo>(initialStakingInfo);
  const [exchanges, setExchanges] = useState<Exchange[]>(initialExchanges);
  const [nftCollections, setNftCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    token: true,
    staking: true,
    exchanges: true,
    nfts: true
  });
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedLockPeriod, setSelectedLockPeriod] = useState<string | null>(null);
  const [livePriceUpdates, setLivePriceUpdates] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch token data
        const tokenResult = await fetchTokenData();
        setTokenData(tokenResult);
        setLoading(prev => ({ ...prev, token: false }));
        
        // Fetch staking info
        const stakingResult = await fetchStakingInfo();
        setStakingInfo(stakingResult);
        setLoading(prev => ({ ...prev, staking: false }));
        
        // Fetch exchanges
        const exchangesResult = await fetchExchanges();
        setExchanges(exchangesResult);
        setLoading(prev => ({ ...prev, exchanges: false }));
        
        // Fetch NFT collections
        const nftResult = await fetchNFTCollections();
        setNftCollections(nftResult);
        setLoading(prev => ({ ...prev, nfts: false }));
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load data",
          description: "Could not connect to the network. Please try again."
        });
      }
    };
    
    loadData();
    
    // Simulate live price updates
    if (livePriceUpdates) {
      const priceUpdateInterval = setInterval(() => {
        setTokenData(prev => {
          const change = (Math.random() * 2 - 1) * 0.005; // Between -0.5% and +0.5%
          const newPrice = prev.price * (1 + change);
          const priceChange = newPrice > prev.price ? '+' : '';
          const percentChange = ((newPrice - prev.price) / prev.price * 100).toFixed(2);
          
          return {
            ...prev,
            price: parseFloat(newPrice.toFixed(4)),
            change: `${priceChange}${percentChange}%`
          };
        });
      }, 5000);
      
      return () => clearInterval(priceUpdateInterval);
    }
  }, [livePriceUpdates]);

  // Handle staking action
  const handleStake = () => {
    if (!wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to stake tokens",
        variant: "destructive"
      });
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid staking amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedLockPeriod) {
      toast({
        title: "Select lock period",
        description: "Please select a lock period for your stake",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate successful staking
    toast({
      title: "Staking successful!",
      description: `You have staked ${stakeAmount} $LERF for ${selectedLockPeriod}`,
      variant: "default"
    });
    
    // Reset form
    setStakeAmount('');
    setSelectedLockPeriod(null);
  };
  
  // Handle connect wallet with proper event handling
  const handleConnectWallet = () => {
    if (connectWallet) {
      connectWallet();
    }
  };
  
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="pt-10 pb-20 md:pt-16 md:pb-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background grid lines */}
        <div className="absolute inset-0 overflow-hidden z-0 opacity-20">
          <div className="h-full w-full border-[1px] border-[#EB4AF7]/10" style={{ 
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, #EB4AF7 1px, transparent 1px), linear-gradient(to bottom, #EB4AF7 1px, transparent 1px)',
            transform: 'perspective(1000px) rotateX(60deg) scale(1.5)',
            transformOrigin: 'center top'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left side content */}
            <motion.div 
              className="flex-1 text-center md:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 font-audiowide bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))]">
                  SLERF
                </h1>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6 font-audiowide text-white">
                  STAKE HARD <br className="hidden md:inline" />
                  <span className="text-[hsl(var(--cyber-pink))]">EARN HARDER!</span>
                </h2>
              </motion.div>
              
              <motion.p 
                className="text-lg md:text-xl mb-8 text-[#a4b9f5] max-w-2xl mx-auto md:mx-0"
                variants={itemVariants}
              >
                The most cutting-edge Web3 platform on Ethereum, bringing you a revolutionary token experience with real-time analytics, staking rewards, and gamified ecosystem.
              </motion.p>
              
              <motion.div className="flex flex-wrap justify-center md:justify-start gap-4" variants={itemVariants}>
                <Button size="lg" className="bg-[hsl(var(--cyber-pink))] hover:bg-[hsl(var(--cyber-pink))/90] text-white font-bold px-8 text-lg rounded-md shadow-[0_0_10px_rgba(255,0,230,0.5)]">
                  BUY $LERF
                </Button>
                {!wallet && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-[hsl(var(--cyber-blue))] text-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--cyber-blue))/10] text-lg font-bold px-8 rounded-md"
                    onClick={handleConnectWallet}
                  >
                    Connect Wallet
                  </Button>
                )}
              </motion.div>
            </motion.div>
            
            {/* Right side cat logo */}
            <motion.div 
              className="flex-1 flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 50, 
                delay: 0.3 
              }}
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                <SLERFAnimatedLogo
                  size={300} 
                  interval={5000} 
                  className="absolute" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Live Token Price Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Price Card */}
            <div className="neon-border p-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-2xl font-audiowide text-[hsl(var(--cyber-pink))]">LIVE PRICE</h3>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${livePriceUpdates ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <button 
                    onClick={() => setLivePriceUpdates(!livePriceUpdates)} 
                    className="text-xs text-white/60 font-mono hover:text-white/90"
                  >
                    {livePriceUpdates ? 'REAL-TIME ACTIVE' : 'UPDATES PAUSED'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-purple))] flex items-center justify-center shadow-lg">
                  <img src={slerfLogo} alt="SLERF Token" className="w-12 h-12" />
                </div>
                <div>
                  {loading.token ? (
                    <>
                      <Skeleton className="h-10 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={tokenData.price}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-4xl font-audiowide text-white"
                        >
                          ${tokenData.price.toFixed(4)}
                        </motion.div>
                      </AnimatePresence>
                      <div className={`font-mono ${tokenData.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {tokenData.change}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {loading.token ? (
                  <>
                    <Skeleton className="h-20 w-full rounded" />
                    <Skeleton className="h-20 w-full rounded" />
                    <Skeleton className="h-20 w-full rounded" />
                  </>
                ) : (
                  <>
                    <div className="bg-black/30 p-3 rounded">
                      <div className="text-xs text-white/60 mb-1">HOLDERS</div>
                      <div className="text-lg font-bold text-white">{tokenData.holders}</div>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <div className="text-xs text-white/60 mb-1">MARKET CAP</div>
                      <div className="text-lg font-bold text-white">{tokenData.marketCap}</div>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <div className="text-xs text-white/60 mb-1">24H VOLUME</div>
                      <div className="text-lg font-bold text-white">{tokenData.volume}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Tokenomics Card */}
            <div className="neon-border-blue p-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-2xl font-audiowide text-[hsl(var(--cyber-blue))]">TOKENOMICS</h3>
                <span className="text-xs text-white/60 font-mono">DEFLATIONARY MODEL</span>
              </div>
              
              <div className="mb-6">
                <div className="h-32 bg-black/40 rounded-md overflow-hidden relative">
                  {/* Tokenomics chart - simplified visual representation */}
                  <div className="absolute inset-0 p-2">
                    <div className="flex h-full">
                      <div className="w-[40%] h-full bg-[hsl(var(--cyber-pink))/70] rounded-l-sm flex items-center justify-center">
                        <span className="text-xs font-bold">40%</span>
                      </div>
                      <div className="w-[20%] h-full bg-[hsl(var(--cyber-blue))/70] flex items-center justify-center">
                        <span className="text-xs font-bold">20%</span>
                      </div>
                      <div className="w-[15%] h-full bg-[hsl(var(--cyber-purple))/70] flex items-center justify-center">
                        <span className="text-xs font-bold">15%</span>
                      </div>
                      <div className="w-[15%] h-full bg-[hsl(var(--cyber-teal))/70] flex items-center justify-center">
                        <span className="text-xs font-bold">15%</span>
                      </div>
                      <div className="w-[10%] h-full bg-[hsl(var(--cyber-yellow))/70] rounded-r-sm flex items-center justify-center">
                        <span className="text-xs font-bold">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--cyber-pink))]"></div>
                  <div className="text-white">Community (40%)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--cyber-blue))]"></div>
                  <div className="text-white">Core Team (20%)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--cyber-purple))]"></div>
                  <div className="text-white">Ecosystem Growth (15%)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--cyber-teal))]"></div>
                  <div className="text-white">Liquidity (15%)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--cyber-yellow))]"></div>
                  <div className="text-white">Treasury (10%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How to Buy Section */}
      {/* Staking Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-[rgba(255,0,230,0.05)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-audiowide mb-4 text-white">STAKE & <span className="text-[hsl(var(--cyber-pink))]">EARN</span></h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">Earn passive income by staking your $LERF tokens in our community pool with competitive APY and flexible lock periods.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Staking Info Card */}
            <div className="neon-border p-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-2xl font-audiowide text-[hsl(var(--cyber-pink))]">STAKING REWARDS</h3>
                <span className="text-xs text-white/60 font-mono">REAL-TIME RATES</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-black/30 p-4 rounded">
                  <div className="text-xs text-white/60 mb-1">APY</div>
                  <div className="text-3xl font-bold text-white">{stakingInfo.apy}</div>
                  <div className="text-xs text-[hsl(var(--cyber-teal))]">Annual Percentage Yield</div>
                </div>
                <div className="bg-black/30 p-4 rounded">
                  <div className="text-xs text-white/60 mb-1">TOTAL STAKED</div>
                  <div className="text-3xl font-bold text-white">{stakingInfo.totalStaked}</div>
                  <div className="text-xs text-[hsl(var(--cyber-teal))]">In Community Pool</div>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-white/60">LOCK PERIODS</div>
                  <div className="text-xs text-[hsl(var(--cyber-blue))]">HIGHER REWARDS FOR LONGER LOCKS</div>
                </div>
                <div className="flex justify-between">
                  {stakingInfo.lockPeriods.map((period, index) => (
                    <div key={period} className="text-center px-4 py-2 rounded bg-black/30">
                      <div className="text-lg font-bold text-white">{period}</div>
                      <div className="text-xs text-[hsl(var(--cyber-pink))]">
                        +{index * 5 + 15}% APY
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {loading.staking ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="mb-6">
                    <div className="mb-2 text-sm text-white/60">Enter amount to stake</div>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        placeholder="Amount of $LERF"
                        className="bg-black/30 border-white/10 text-white"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                      />
                      <Button 
                        className="bg-black/30 hover:bg-black/50 text-white px-3 py-2"
                        onClick={() => wallet ? setStakeAmount(wallet.balance || '1000') : null}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mb-2 text-sm text-white/60">Select lock period</div>
                    <div className="flex gap-2">
                      {stakingInfo.lockPeriods.map((period, index) => (
                        <Button 
                          key={period} 
                          variant={selectedLockPeriod === period ? "default" : "outline"}
                          className={
                            selectedLockPeriod === period 
                            ? "flex-1 bg-[hsl(var(--cyber-pink))] hover:bg-[hsl(var(--cyber-pink))/90]" 
                            : "flex-1 border-white/10 text-white hover:bg-black/20"
                          }
                          onClick={() => setSelectedLockPeriod(period)}
                        >
                          {period}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-[hsl(var(--cyber-pink))] hover:bg-[hsl(var(--cyber-pink))/90] font-bold py-6 text-lg"
                    onClick={handleStake}
                  >
                    STAKE YOUR $LERF
                  </Button>
                </>
              )}
            </div>
            
            {/* Exchange Listings */}
            <div className="neon-border-blue p-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-2xl font-audiowide text-[hsl(var(--cyber-blue))]">EXCHANGE LISTINGS</h3>
                <span className="text-xs text-white/60 font-mono">CONTRACT: {tokenData.address.substring(0, 6)}...{tokenData.address.substring(38)}</span>
              </div>
              
              <div className="mb-6">
                <div className="bg-black/30 p-4 rounded mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-purple))] flex items-center justify-center shadow-lg">
                      <img src={slerfLogo} alt="SLERF Token" className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs text-white/60">TOKEN SUMMARY</div>
                      <div className="text-lg font-bold text-white">${tokenData.symbol}</div>
                      <div className="text-xs text-[hsl(var(--cyber-teal))]">{tokenData.network} • {tokenData.decimals} decimals</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {loading.exchanges ? (
                    <>
                      <Skeleton className="h-16 w-full rounded" />
                      <Skeleton className="h-16 w-full rounded" />
                      <Skeleton className="h-16 w-full rounded" />
                    </>
                  ) : (
                    <>
                      {exchanges.map((exchange) => (
                        <motion.div 
                          key={exchange.name} 
                          className="bg-black/30 p-4 rounded hover:bg-black/40 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => window.open(exchange.url, '_blank')}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{exchange.logo}</div>
                              <div className="font-bold text-white">{exchange.name}</div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="text-[hsl(var(--cyber-blue))]"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(exchange.url, '_blank');
                              }}
                            >
                              Trade Now →
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-white/60">ADDITIONAL UTILITIES</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="px-3 py-2 rounded bg-black/30">
                    <div className="text-xs text-white">GOVERNANCE</div>
                  </div>
                  <div className="px-3 py-2 rounded bg-black/30">
                    <div className="text-xs text-white">NFT MARKETPLACE</div>
                  </div>
                  <div className="px-3 py-2 rounded bg-black/30">
                    <div className="text-xs text-white">PLAY-TO-EARN</div>
                  </div>
                  <div className="px-3 py-2 rounded bg-black/30">
                    <div className="text-xs text-white">DAO MEMBERSHIP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How to Buy Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-audiowide mb-4 text-white">HOW TO <span className="text-[hsl(var(--cyber-blue))]">BUY</span></h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">Follow these simple steps to get your hands on $LERF tokens and join our cyberpunk community.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="cyber-card p-6 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))] flex items-center justify-center mb-4 mx-auto">
                  <span className="font-audiowide text-xl text-white">{step}</span>
                </div>
                <h3 className="text-xl font-audiowide text-center mb-3 text-white">
                  {step === 1 ? 'Create Wallet' : step === 2 ? 'Add Funds' : 'Swap for $LERF'}
                </h3>
                <p className="text-center text-white/70">
                  {step === 1 
                    ? 'Download a Solana-compatible wallet like Phantom or Solflare and set it up.' 
                    : step === 2 
                    ? 'Add SOL to your wallet through an exchange or direct purchase.' 
                    : 'Connect to our DEX and swap your SOL for $LERF tokens.'}
                </p>
                <div className="mt-6 text-center">
                  <Button className="bg-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--cyber-blue))/90] font-bold">
                    {step === 1 ? 'Get Wallet' : step === 2 ? 'Buy SOL' : 'Swap Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Transaction Explorer Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-[rgba(149,59,255,0.07)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-audiowide mb-4 text-white">
              LIVE <span className="text-[hsl(var(--cyber-blue))]">BLOCKCHAIN</span> EXPLORER
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Watch blockchain transactions in real-time. See token transfers, smart contract interactions, and ETH movements as they happen.
            </p>
          </div>
          
          {/* Transaction Explorer Component */}
          <TransactionExplorer 
            maxTransactions={8}
            className="w-full"
          />
        </div>
      </section>
      
      {/* NFT Preview Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-[rgba(149,59,255,0.1)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-audiowide mb-4 text-white">EXCLUSIVE <span className="text-[hsl(var(--cyber-pink))]">NFTs</span></h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">Hold $LERF to gain access to our limited edition cyberpunk cat collection.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((nft) => (
              <motion.div 
                key={nft}
                className="neon-border p-1 rounded-xl overflow-hidden"
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="bg-black/60 p-4 rounded-lg">
                  <div className="rounded-lg overflow-hidden mb-4 aspect-square bg-gradient-to-br from-[hsl(var(--cyber-pink))/20] to-[hsl(var(--cyber-blue))/20] flex items-center justify-center">
                    <img src={cyberCatLogo} alt={`Cyber Cat NFT ${nft}`} className="w-4/5 h-4/5 object-contain" />
                  </div>
                  <h3 className="text-xl font-audiowide mb-2 text-white">Cyber Cat #{nft}000</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-[hsl(var(--cyber-blue))] font-mono">Floor: 3.5 SOL</span>
                    <Button size="sm" className="bg-[hsl(var(--cyber-pink))] hover:bg-[hsl(var(--cyber-pink))/90] text-white font-bold">
                      View
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-purple))] hover:opacity-90 text-white font-bold px-8 py-6 text-lg">
              View Full Collection
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;