import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  onWalletClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onWalletClick }) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  
  // If wallet is connected, fetch user data to get SLERF balance
  const { data: userData } = useQuery({
    queryKey: ['/api/users/wallet', wallet?.address],
    queryFn: async () => {
      if (!wallet?.address) return null;
      const response = await fetch(`/api/users/wallet/${wallet.address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    enabled: !!wallet?.address,
  });

  const slerfBalance = userData?.slerfBalance || 0;

  const handleMobileMenuClick = () => {
    toast({
      title: "Mobile Menu",
      description: "Mobile menu is not implemented in this demo",
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="../assets/slerf-logo.svg" alt="Slerf Logo" className="h-10 w-10" />
          <span className="font-space font-bold text-xl md:text-2xl">SlerfHub</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#missions" className="font-medium hover:text-slerf-orange transition">Missions</a>
          <a href="/#staking" className="font-medium hover:text-slerf-orange transition">Staking</a>
          <a href="/games" className="font-medium hover:text-slerf-orange transition">Games</a>
          <a href="/#nfts" className="font-medium hover:text-slerf-orange transition">NFTs</a>
          <a href="/#marketplace" className="font-medium hover:text-slerf-orange transition">Marketplace</a>
        </div>
        
        <div className="flex items-center space-x-4">
          {wallet && (
            <div className="hidden md:flex items-center bg-slerf-dark/50 rounded-full px-3 py-1.5">
              <i className="ri-coin-line text-slerf-orange mr-2"></i>
              <span className="font-mono text-slerf-orange">{slerfBalance} $SLERF</span>
            </div>
          )}
          
          <button 
            onClick={onWalletClick}
            className="bg-slerf-orange hover:bg-slerf-orange/90 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
          >
            <i className="ri-wallet-3-line mr-2"></i>
            <span>{wallet ? 'Disconnect' : 'Connect'}</span>
          </button>
          
          <button className="md:hidden text-2xl" onClick={handleMobileMenuClick}>
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
