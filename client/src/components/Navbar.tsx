import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import slerfLogo from '@/assets/slerf-logo.svg';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onWalletClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onWalletClick }) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // If wallet is connected, fetch user data to get $LERF balance
  const { data: userData } = useQuery({
    queryKey: ['/api/users/wallet', wallet],
    queryFn: async () => {
      if (!wallet) return null;
      const response = await fetch(`/api/users/wallet/${wallet}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    enabled: !!wallet,
  });

  const lerfBalance = userData?.lerfBalance || 0;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={slerfLogo} alt="$LERF Logo" className="h-10 w-10" />
          <span className="font-space font-bold text-xl md:text-2xl">$LERFHub</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#missions" className="font-medium hover:text-slerf-orange transition">Missions</a>
          <a href="/#staking" className="font-medium hover:text-slerf-orange transition">Staking</a>
          <a href="/games" className="font-medium hover:text-slerf-orange transition">Games</a>
          <a href="/#nfts" className="font-medium hover:text-slerf-orange transition">NFTs</a>
          <a href="/#marketplace" className="font-medium hover:text-slerf-orange transition">Marketplace</a>
          <a href="/docs" className="font-medium hover:text-slerf-orange transition">Documentation</a>
        </div>
        
        <div className="flex items-center space-x-4">
          {wallet && (
            <div className="hidden md:flex items-center bg-slerf-dark/50 rounded-full px-3 py-1.5">
              <svg className="w-4 h-4 text-slerf-orange mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              <span className="font-mono text-slerf-orange">{lerfBalance} $LERF</span>
            </div>
          )}
          
          <button 
            onClick={onWalletClick}
            className="bg-slerf-orange hover:bg-slerf-orange/90 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M15 9h2" />
              <path d="M17 9v4" />
              <circle cx="9" cy="12" r="3" />
            </svg>
            <span>{wallet ? 'Disconnect' : 'Connect'}</span>
          </button>
          
          <button 
            className="md:hidden text-2xl p-1"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-dark border-t border-slerf-dark-lighter overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 space-y-2">
              <a 
                href="/#missions" 
                className="block py-2 px-4 font-medium hover:bg-slerf-dark-light rounded-lg transition"
                onClick={handleMobileNavClick}
              >
                Missions
              </a>
              <a 
                href="/#staking" 
                className="block py-2 px-4 font-medium hover:bg-slerf-dark-light rounded-lg transition"
                onClick={handleMobileNavClick}
              >
                Staking
              </a>
              <a 
                href="/games" 
                className="block py-2 px-4 font-medium hover:bg-slerf-dark-light rounded-lg transition"
                onClick={handleMobileNavClick}
              >
                Games
              </a>
              <a 
                href="/#nfts" 
                className="block py-2 px-4 font-medium hover:bg-slerf-dark-light rounded-lg transition"
                onClick={handleMobileNavClick}
              >
                NFTs
              </a>
              <a 
                href="/#marketplace" 
                className="block py-2 px-4 font-medium hover:bg-slerf-dark-light rounded-lg transition"
                onClick={handleMobileNavClick}
              >
                Marketplace
              </a>
              <a 
                href="/docs" 
                className="block py-2 px-4 font-medium hover:bg-slerf-dark-light rounded-lg transition"
                onClick={handleMobileNavClick}
              >
                Documentation
              </a>
              
              {wallet && (
                <div className="flex items-center bg-slerf-dark/50 rounded-lg px-4 py-3 my-2">
                  <svg className="w-4 h-4 text-slerf-orange mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                  <span className="font-mono text-slerf-orange">{lerfBalance} $LERF</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
