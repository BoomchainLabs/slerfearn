import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import DailyMissions from '@/components/DailyMissions';
import WeeklyQuests from '@/components/WeeklyQuests';
import StakingVaults from '@/components/StakingVaults';
import MiniGames from '@/components/MiniGames';
import NFTBoosters from '@/components/NFTBoosters';
import ReferralSystem from '@/components/ReferralSystem';
import SocialFiIntegration from '@/components/SocialFiIntegration';
import MarketplacePreview from '@/components/MarketplacePreview';
import TokenPriceChart from '@/components/TokenPriceChart';
import Footer from '@/components/Footer';
import WalletModal from '@/components/WalletModal';
import { useWallet } from '@/hooks/useWallet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import slerfLogo from '@/assets/slerf-logo.svg';
import { useToast } from '@/hooks/use-toast';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('missions');
  const [scrollY, setScrollY] = useState(0);
  const { wallet, connectWallet, disconnectWallet, balance } = useWallet();
  const { toast } = useToast();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section visibility detection
  useEffect(() => {
    const handleSectionVisibility = () => {
      const sections = [
        { id: 'missions', element: document.getElementById('missions') },
        { id: 'quests', element: document.getElementById('quests') },
        { id: 'staking', element: document.getElementById('staking') },
        { id: 'games', element: document.getElementById('games') },
        { id: 'nfts', element: document.getElementById('nfts') },
        { id: 'referrals', element: document.getElementById('referrals') },
        { id: 'social', element: document.getElementById('social') },
        { id: 'marketplace', element: document.getElementById('marketplace') },
      ];
      
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleSectionVisibility);
    return () => window.removeEventListener('scroll', handleSectionVisibility);
  }, []);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const handleWalletConnect = async () => {
    if (wallet) {
      disconnectWallet();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been successfully disconnected",
      });
    } else {
      try {
        openWalletModal();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  // Navigation function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <Navbar onWalletClick={handleWalletConnect} />
      
      {/* Floating wallet info */}
      {wallet && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed right-4 top-20 z-40 glass p-3 rounded-xl hidden md:flex items-center space-x-2"
        >
          <img src={slerfLogo} className="w-6 h-6" alt="SLERF" />
          <span className="font-medium">{balance} SLERF</span>
        </motion.div>
      )}
      
      {/* Side navigation for desktop */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
      >
        <div className="glass p-2 rounded-full">
          <ul className="flex flex-col items-center space-y-4 py-2">
            <li>
              <button 
                onClick={() => scrollToSection('missions')}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeSection === 'missions' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                title="Missions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('quests')}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeSection === 'quests' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                title="Quests"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('staking')}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeSection === 'staking' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                title="Staking"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.32a9 9 0 0 1-.8 4.21c-.52.93-1.22 1.77-2.07 2.5"/><path d="M9 11.32c0 5.04 3.38 9.32 8 9.32"/><path d="M3 11.32c0 5.04 3.38 9.32 8 9.32"/><path d="M12 2v20"/></svg>
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('games')}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeSection === 'games' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                title="Games"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('nfts')}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeSection === 'nfts' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                title="NFTs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('marketplace')}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeSection === 'marketplace' ? 'bg-slerf-cyan text-slerf-dark' : 'hover:bg-slerf-dark-light'}`}
                title="Marketplace"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
              </button>
            </li>
          </ul>
        </div>
      </motion.div>
      
      {/* Floating action button */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <Button 
          className="rounded-full p-3 bg-slerf-purple hover:bg-slerf-purple/90 shadow-lg"
          onClick={handleWalletConnect}
        >
          {wallet ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h16"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M15 9h2"/><path d="M17 9v4"/><circle cx="9" cy="12" r="3"/></svg>
          )}
        </Button>
      </motion.div>
      
      <Hero onStartClick={handleWalletConnect} />
      
      <motion.div 
        initial="hidden" 
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp} 
      >
        <StatsBar />
      </motion.div>
      
      {/* SLERF Token Price Chart with animations */}
      <motion.section 
        className="py-12 px-4 bg-gradient-to-b from-slerf-dark to-slerf-dark/90"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto">
          <motion.div className="flex items-center space-x-3 mb-6" variants={fadeInUp}>
            <img src={slerfLogo} alt="SLERF Logo" className="w-10 h-10" />
            <h2 className="text-3xl font-space font-bold">SLERF Token Live Chart</h2>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <TokenPriceChart />
          </motion.div>
          
          <motion.div 
            className="mt-6 flex justify-center"
            variants={fadeInUp}
          >
            <Link href="/games">
              <Button className="bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark">
                Play Games & Earn SLERF
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.div id="missions" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <DailyMissions />
      </motion.div>
      
      <motion.div id="quests" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <WeeklyQuests />
      </motion.div>
      
      <motion.div id="staking" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <StakingVaults />
      </motion.div>
      
      <motion.div id="games" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <MiniGames />
      </motion.div>
      
      <motion.div id="nfts" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <NFTBoosters />
      </motion.div>
      
      <motion.div id="referrals" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <ReferralSystem />
      </motion.div>
      
      <motion.div id="social" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <SocialFiIntegration />
      </motion.div>
      
      <motion.div id="marketplace" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <MarketplacePreview />
      </motion.div>
      
      <Footer />
      
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={closeWalletModal} 
        onConnect={connectWallet}
      />
    </div>
  );
};

export default Home;
