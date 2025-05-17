import React from 'react';
import { useNfts } from '@/hooks/useNfts';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const NFTBoosters: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    nfts,
    userNfts,
    isNftsLoading,
    mintNft,
    ownsNft,
  } = useNfts();

  const handleMintClick = (nft: any) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to mint NFTs",
      });
      return;
    }

    if (ownsNft(nft.id)) {
      toast({
        title: "Already Owned",
        description: `You already own the ${nft.name} NFT`,
      });
      return;
    }

    mintNft.mutate(nft.id, {
      onSuccess: () => {
        toast({
          title: "NFT Minted",
          description: `You've successfully minted ${nft.name}!`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to mint NFT",
          variant: "destructive",
        });
      }
    });
  };

  if (isNftsLoading) {
    return (
      <section id="nfts" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-space font-bold">NFT Boosters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <NftSkeleton />
            <NftSkeleton />
            <NftSkeleton />
            <NftSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="nfts" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-space font-bold">NFT Boosters</h2>
          <button className="bg-slerf-dark/50 hover:bg-slerf-dark/70 text-white px-4 py-2 rounded-lg font-medium transition">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {nfts.map(nft => {
            const isOwned = ownsNft(nft.id);
            const isLegendary = nft.rarity.toLowerCase() === 'legendary';
            
            return (
              <div key={nft.id} className="glass rounded-xl overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img 
                    src={nft.imageUrl} 
                    alt={`${nft.rarity} Slerf NFT`} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <div className={`absolute top-3 right-3 bg-slerf-dark/80 px-3 py-1 rounded-lg text-xs font-medium ${
                    nft.rarity === 'Common' ? '' : 
                    nft.rarity === 'Uncommon' ? 'text-slerf-cyan' : 
                    nft.rarity === 'Rare' ? 'text-slerf-purple' : 
                    'text-slerf-orange'
                  }`}>
                    {nft.rarity}
                  </div>
                  {isLegendary && (
                    <div className="absolute inset-0 bg-gradient-to-b from-slerf-orange/20 via-slerf-purple/20 to-slerf-cyan/20 animate-pulse-slow"></div>
                  )}
                </div>
                
                <div className={`p-4 ${isLegendary ? 'relative' : ''}`}>
                  <h3 className="text-lg font-medium mb-1">{nft.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-xs ${
                      nft.rarity === 'Common' ? 'text-slerf-orange' : 
                      nft.rarity === 'Uncommon' ? 'text-slerf-cyan' : 
                      nft.rarity === 'Rare' ? 'text-slerf-purple' : 
                      'text-slerf-orange'
                    }`}>
                      +{nft.boost}% Earning Boost
                    </div>
                    <div className="font-mono text-sm">{nft.price / 1000} ETH</div>
                  </div>
                  
                  {isLegendary ? (
                    <button 
                      className={`w-full ${isOwned ? 'bg-gray-600 text-gray-300' : 'bg-gradient-to-r from-slerf-orange to-slerf-purple hover:opacity-90'} text-white px-4 py-2 rounded-lg font-medium transition`}
                      onClick={() => !isOwned && handleMintClick(nft)}
                      disabled={isOwned}
                    >
                      {isOwned ? 'Owned' : 'Mint'}
                    </button>
                  ) : (
                    <button 
                      className={`w-full ${isOwned ? 'bg-gray-600 text-gray-300' : 'bg-slerf-dark/50 hover:bg-slerf-dark/70'} text-white px-4 py-2 rounded-lg font-medium transition`}
                      onClick={() => !isOwned && handleMintClick(nft)}
                      disabled={isOwned}
                    >
                      {isOwned ? 'Owned' : 'Mint'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 glass rounded-xl p-6">
          <h3 className="text-xl font-space font-bold mb-4">NFT Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex">
              <div className="mr-4 flex-shrink-0 bg-slerf-orange/20 h-12 w-12 flex items-center justify-center rounded-lg">
                <i className="ri-rocket-line text-2xl text-slerf-orange"></i>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Boosted Rewards</h4>
                <p className="text-sm text-gray-400">Earn up to 25% more $SLERF from all activities</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0 bg-slerf-purple/20 h-12 w-12 flex items-center justify-center rounded-lg">
                <i className="ri-vip-crown-line text-2xl text-slerf-purple"></i>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Exclusive Quests</h4>
                <p className="text-sm text-gray-400">Access special missions only available to NFT holders</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0 bg-slerf-cyan/20 h-12 w-12 flex items-center justify-center rounded-lg">
                <i className="ri-lock-unlock-line text-2xl text-slerf-cyan"></i>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Premium Vaults</h4>
                <p className="text-sm text-gray-400">Unlock higher APR staking vaults with better returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const NftSkeleton = () => (
  <div className="glass rounded-xl overflow-hidden">
    <Skeleton className="w-full h-64 bg-slerf-dark/50" />
    <div className="p-4">
      <Skeleton className="h-6 w-1/2 mb-1 bg-slerf-dark/50" />
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-1/3 bg-slerf-dark/50" />
        <Skeleton className="h-4 w-16 bg-slerf-dark/50" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg bg-slerf-dark/50" />
    </div>
  </div>
);

export default NFTBoosters;
