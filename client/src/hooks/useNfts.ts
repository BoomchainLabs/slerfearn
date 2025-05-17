import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./useWallet";
import { queryClient } from "@/lib/queryClient";
import { NftBooster, UserNft } from "@shared/schema";

export function useNfts() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch all NFT boosters
  const nftsQuery = useQuery({
    queryKey: ['/api/nfts'],
    enabled: !!wallet,
  });

  // Fetch user's NFTs
  const userNftsQuery = useQuery({
    queryKey: ['/api/users', userId, 'nfts'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/users/${userId}/nfts`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Mint an NFT
  const mintNft = useMutation({
    mutationFn: async (nftId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/nfts`,
        { nftId }
      );
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'nfts'] });
      
      // Also invalidate user data to update SLERF balance
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  // Check if user owns a specific NFT
  const ownsNft = (nftId: number) => {
    if (!userNftsQuery.data) return false;
    
    const userNfts = userNftsQuery.data as (UserNft & { nft: NftBooster })[];
    return userNfts.some(userNft => userNft.nft.id === nftId);
  };

  // Check if user owns any NFT of a specific rarity
  const ownsNftOfRarity = (rarity: string) => {
    if (!userNftsQuery.data) return false;
    
    const userNfts = userNftsQuery.data as (UserNft & { nft: NftBooster })[];
    return userNfts.some(userNft => userNft.nft.rarity.toLowerCase() === rarity.toLowerCase());
  };

  // Get total boost from all owned NFTs
  const getTotalBoost = () => {
    if (!userNftsQuery.data) return 0;
    
    const userNfts = userNftsQuery.data as (UserNft & { nft: NftBooster })[];
    return userNfts.reduce((total, userNft) => total + userNft.nft.boost, 0);
  };

  return {
    nfts: nftsQuery.data as NftBooster[] || [],
    userNfts: userNftsQuery.data as (UserNft & { nft: NftBooster })[] || [],
    isNftsLoading: nftsQuery.isLoading,
    isUserNftsLoading: userNftsQuery.isLoading,
    mintNft,
    ownsNft,
    ownsNftOfRarity,
    getTotalBoost,
  };
}
