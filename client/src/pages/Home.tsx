import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  const { connectWallet, disconnectWallet, wallet } = useWallet();

  const handleWalletClick = () => {
    if (wallet) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-slerf-dark-lighter text-white">
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Home;