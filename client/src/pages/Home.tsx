import React from 'react';
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
import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

const Home: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { wallet, connect, disconnect } = useWallet();

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const handleWalletConnect = async () => {
    if (wallet) {
      disconnect();
    } else {
      try {
        openWalletModal();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  return (
    <div>
      <Navbar onWalletClick={handleWalletConnect} />
      <Hero onStartClick={handleWalletConnect} />
      <StatsBar />
      
      {/* Add Token Price Chart */}
      <section className="py-12 px-4 bg-gradient-to-b from-slerf-dark to-slerf-dark/90">
        <div className="container mx-auto">
          <h2 className="text-3xl font-space font-bold mb-6">SLERF Token Live Chart</h2>
          <TokenPriceChart />
        </div>
      </section>
      <DailyMissions />
      <WeeklyQuests />
      <StakingVaults />
      <MiniGames />
      <NFTBoosters />
      <ReferralSystem />
      <SocialFiIntegration />
      <MarketplacePreview />
      <Footer />
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={closeWalletModal} 
        onConnect={connect}
      />
    </div>
  );
};

export default Home;
