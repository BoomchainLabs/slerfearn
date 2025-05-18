import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWallet } from '@/hooks/useWallet';
import Footer from '@/components/Footer';
import cyberCatLogo from '@/assets/cyber-cat-logo.svg';

const tokenData = {
  price: 1.9374,
  change: '+15.2%',
  holders: '12,930',
  marketCap: '$4.8M',
  volume: '$927K'
};

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
                The most cutting-edge Web3 platform on Solana, bringing you a revolutionary token experience with real-time analytics and futuristic rewards.
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
                    onClick={connectWallet}
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
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <img 
                  src={cyberCatLogo} 
                  alt="Cyber Cat" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 rounded-full blur-xl bg-[hsl(var(--cyber-pink))] opacity-20 animate-pulse"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))] opacity-30 animate-pulse" style={{ animationDuration: '3s' }}></div>
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
                <span className="text-xs text-white/60 font-mono">REAL-TIME UPDATES</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-purple))] flex items-center justify-center shadow-lg">
                  <img src={cyberCatLogo} alt="Token" className="w-12 h-12" />
                </div>
                <div>
                  <div className="text-4xl font-audiowide text-white">${tokenData.price}</div>
                  <div className="text-[hsl(var(--cyber-teal))] font-mono">{tokenData.change}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
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