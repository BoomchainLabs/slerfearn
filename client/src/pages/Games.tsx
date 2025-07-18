import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import SpinGame from '@/components/SpinGame';
import BlockchainGames from '@/components/BlockchainGames';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import slerfLogo from '@/assets/slerf-logo.svg';
import { motion } from 'framer-motion';

const Games: React.FC = () => {
  const { wallet, connectWallet, balance } = useWallet();
  const { toast } = useToast();
  const [activeGame, setActiveGame] = useState<'spin' | 'blockchain'>('spin');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading and add animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleWalletConnect = () => {
    if (!wallet) {
      connectWallet();
    } else {
      toast({
        title: "Wallet Connected",
        description: `You're already connected with balance: ${balance} SLERF`,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slerf-dark">
      <Navbar onWalletClick={handleWalletConnect} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-24 px-4"
      >
        <div className="flex flex-col items-center justify-center mb-12">
          <img src={slerfLogo} alt="SLERF Logo" className="w-24 h-24 mb-6" />
          <h1 className="text-4xl md:text-5xl font-space font-bold text-center mb-8">
            Play <span className="text-slerf-cyan">Games</span> & Earn <span className="text-slerf-cyan">SLERF</span>
          </h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-8">
            Enjoy our selection of games where you can stake, play, and earn SLERF tokens. Connect your wallet to start your gaming journey!
          </p>
          
          {!wallet && (
            <Button 
              size="lg" 
              onClick={handleWalletConnect}
              className="bg-slerf-purple hover:bg-slerf-purple/90 mt-4"
            >
              Connect Wallet to Start
            </Button>
          )}
          
          {wallet && (
            <div className="glass p-4 rounded-xl flex items-center space-x-3 mt-4">
              <img src={slerfLogo} alt="SLERF Token" className="w-8 h-8" />
              <span className="text-xl font-medium">{balance} SLERF Tokens</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="glass p-1 rounded-full">
            <div className="flex">
              <button 
                className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${activeGame === 'spin' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                onClick={() => setActiveGame('spin')}
              >
                Spin & Win
              </button>
              <button 
                className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${activeGame === 'blockchain' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                onClick={() => setActiveGame('blockchain')}
              >
                Blockchain Games
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {activeGame === 'spin' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SpinGame />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BlockchainGames />
        </motion.div>
      )}
      
      <Separator className="my-12 bg-slerf-dark-light" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="glass p-8 rounded-xl max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <img src={slerfLogo} alt="SLERF Logo" className="w-12 h-12" />
            <h2 className="text-2xl font-bold">SLERF Token Rewards</h2>
          </div>
          
          <p className="text-gray-300 mb-6">
            Playing games on SlerfHub rewards you with real SLERF tokens that can be used throughout our ecosystem. 
            Tokens earned through games can be staked, traded, or used to purchase exclusive NFTs in our marketplace.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slerf-dark-light p-4 rounded-lg text-center">
              <div className="text-slerf-cyan text-4xl font-bold mb-2">15%</div>
              <div className="text-gray-300">Average APY from game staking</div>
            </div>
            <div className="bg-slerf-dark-light p-4 rounded-lg text-center">
              <div className="text-slerf-cyan text-4xl font-bold mb-2">100+</div>
              <div className="text-gray-300">SLERF tokens earned daily by top players</div>
            </div>
            <div className="bg-slerf-dark-light p-4 rounded-lg text-center">
              <div className="text-slerf-cyan text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-300">Continuous rewards distribution</div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-slerf-orange hover:bg-slerf-orange/90 mr-4">
                Back to Home
              </Button>
            </Link>
            {!wallet && (
              <Button 
                className="bg-slerf-purple hover:bg-slerf-purple/90"
                onClick={handleWalletConnect}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Games;