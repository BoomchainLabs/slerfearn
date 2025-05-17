import React from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const MarketplacePreview: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    items,
    isItemsLoading,
    purchaseItem,
    hasPurchasedItem,
  } = useMarketplace();

  const handlePurchaseClick = (item: any) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to purchase items",
      });
      return;
    }

    if (hasPurchasedItem(item.id)) {
      toast({
        title: "Already Purchased",
        description: `You already own ${item.name}`,
      });
      return;
    }

    purchaseItem.mutate(item.id, {
      onSuccess: () => {
        toast({
          title: "Purchase Successful",
          description: `You've successfully purchased ${item.name}!`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to purchase item",
          variant: "destructive",
        });
      }
    });
  };

  // Show max 4 items in the preview
  const previewItems = items.slice(0, 4);

  if (isItemsLoading) {
    return (
      <section id="marketplace" className="py-16 px-4 bg-gradient-to-b from-slerf-dark/70 to-slerf-dark">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-space font-bold">Marketplace</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="marketplace" className="py-16 px-4 bg-gradient-to-b from-slerf-dark/70 to-slerf-dark">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-space font-bold">Marketplace</h2>
          <button className="bg-slerf-dark/50 hover:bg-slerf-dark/70 text-white px-4 py-2 rounded-lg font-medium transition">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {previewItems.map(item => {
            const isPurchased = hasPurchasedItem(item.id);
            const isSpecial = item.name.includes("Summit") || item.name.includes("Wallpaper");
            
            return (
              <div key={item.id} className="glass rounded-xl overflow-hidden group">
                <div className={`relative overflow-hidden ${isSpecial ? 'bg-gradient-to-br from-slerf-orange/20 via-slerf-purple/20 to-slerf-cyan/20' : ''}`}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <div className="absolute top-3 right-3 bg-slerf-dark/80 px-3 py-1 rounded-lg text-xs font-medium">
                    {item.type}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-400">{item.description}</div>
                    <div className="font-mono text-slerf-orange">{item.price.toLocaleString()} $SLERF</div>
                  </div>
                  
                  <button 
                    className={`w-full ${isPurchased 
                      ? 'bg-gray-600 text-gray-300' 
                      : 'bg-slerf-orange hover:bg-slerf-orange/90 text-white'} px-4 py-2 rounded-lg font-medium transition`}
                    onClick={() => !isPurchased && handlePurchaseClick(item)}
                    disabled={isPurchased}
                  >
                    {isPurchased ? 'Owned' : 'Purchase'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ItemSkeleton = () => (
  <div className="glass rounded-xl overflow-hidden">
    <Skeleton className="w-full h-48 bg-slerf-dark/50" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-1 bg-slerf-dark/50" />
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-1/3 bg-slerf-dark/50" />
        <Skeleton className="h-4 w-24 bg-slerf-dark/50" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg bg-slerf-dark/50" />
    </div>
  </div>
);

export default MarketplacePreview;
