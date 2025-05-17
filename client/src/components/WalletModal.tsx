import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const { toast } = useToast();

  const handleWalletSelect = async (walletName: string) => {
    try {
      await onConnect();
      onClose();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : `Failed to connect to ${walletName}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slerf-dark rounded-xl border border-slerf-orange/20 shadow-2xl max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-space font-bold">Connect Wallet</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-4">
          <button 
            className="w-full bg-slerf-dark/50 hover:bg-slerf-dark/70 text-white px-4 py-4 rounded-lg font-medium transition flex items-center justify-between"
            onClick={() => handleWalletSelect("MetaMask")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-full bg-[#E2761B] flex items-center justify-center">
                <i className="ri-fox-line text-white"></i>
              </div>
              <span>MetaMask</span>
            </div>
            <i className="ri-arrow-right-line"></i>
          </button>
          
          <button 
            className="w-full bg-slerf-dark/50 hover:bg-slerf-dark/70 text-white px-4 py-4 rounded-lg font-medium transition flex items-center justify-between"
            onClick={() => handleWalletSelect("WalletConnect")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-full bg-[#3B99FC] flex items-center justify-center">
                <i className="ri-wallet-3-line text-white"></i>
              </div>
              <span>WalletConnect</span>
            </div>
            <i className="ri-arrow-right-line"></i>
          </button>
          
          <button 
            className="w-full bg-slerf-dark/50 hover:bg-slerf-dark/70 text-white px-4 py-4 rounded-lg font-medium transition flex items-center justify-between"
            onClick={() => handleWalletSelect("Coinbase Wallet")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-full bg-[#0052FF] flex items-center justify-center">
                <i className="ri-coins-line text-white"></i>
              </div>
              <span>Coinbase Wallet</span>
            </div>
            <i className="ri-arrow-right-line"></i>
          </button>
          
          <button 
            className="w-full bg-slerf-dark/50 hover:bg-slerf-dark/70 text-white px-4 py-4 rounded-lg font-medium transition flex items-center justify-between"
            onClick={() => handleWalletSelect("Phantom")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-full bg-[#AB9FF2] flex items-center justify-center">
                <i className="ri-ghost-line text-white"></i>
              </div>
              <span>Phantom</span>
            </div>
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
        
        <div className="mt-6 text-xs text-gray-400 text-center">
          By connecting your wallet, you agree to our <a href="#" className="text-slerf-orange">Terms of Service</a> and <a href="#" className="text-slerf-orange">Privacy Policy</a>.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
