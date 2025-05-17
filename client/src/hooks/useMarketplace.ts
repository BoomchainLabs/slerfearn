import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./useWallet";
import { queryClient } from "@/lib/queryClient";
import { MarketplaceItem, UserPurchase } from "@shared/schema";

export function useMarketplace() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch all marketplace items
  const itemsQuery = useQuery({
    queryKey: ['/api/marketplace'],
    enabled: true, // Show marketplace items even to non-logged in users
  });

  // Fetch user's purchases
  const userPurchasesQuery = useQuery({
    queryKey: ['/api/users', userId, 'purchases'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/users/${userId}/purchases`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Purchase an item
  const purchaseItem = useMutation({
    mutationFn: async (itemId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/purchases`,
        { itemId }
      );
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'purchases'] });
      
      // Also invalidate user data to update SLERF balance
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  // Check if user has purchased a specific item
  const hasPurchasedItem = (itemId: number) => {
    if (!userPurchasesQuery.data) return false;
    
    const purchases = userPurchasesQuery.data as (UserPurchase & { item: MarketplaceItem })[];
    return purchases.some(purchase => purchase.item.id === itemId);
  };

  // Count purchases by type
  const countPurchasesByType = (type: string) => {
    if (!userPurchasesQuery.data) return 0;
    
    const purchases = userPurchasesQuery.data as (UserPurchase & { item: MarketplaceItem })[];
    return purchases.filter(purchase => purchase.item.type === type).length;
  };

  return {
    items: itemsQuery.data as MarketplaceItem[] || [],
    userPurchases: userPurchasesQuery.data as (UserPurchase & { item: MarketplaceItem })[] || [],
    isItemsLoading: itemsQuery.isLoading,
    isUserPurchasesLoading: userPurchasesQuery.isLoading,
    purchaseItem,
    hasPurchasedItem,
    countPurchasesByType,
  };
}
