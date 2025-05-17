import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./useWallet";
import { queryClient } from "@/lib/queryClient";
import { StakingVault, UserStake } from "@shared/schema";

export function useStaking() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch all staking vaults
  const vaultsQuery = useQuery({
    queryKey: ['/api/vaults'],
    enabled: !!wallet,
  });

  // Fetch user's active stakes
  const userStakesQuery = useQuery({
    queryKey: ['/api/users', userId, 'stakes'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/users/${userId}/stakes`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Stake tokens
  const stakeTokens = useMutation({
    mutationFn: async ({ 
      vaultId, 
      amount 
    }: { 
      vaultId: number; 
      amount: number 
    }) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/stakes`,
        { vaultId, amount }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'stakes'] });
      // Also invalidate user data to update SLERF balance
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  // Unstake tokens
  const unstakeTokens = useMutation({
    mutationFn: async (stakeId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/stakes/${stakeId}/unstake`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'stakes'] });
      // Also invalidate user data to update SLERF balance
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  // Claim staking rewards
  const claimStakingRewards = useMutation({
    mutationFn: async (stakeId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/stakes/${stakeId}/claim`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'stakes'] });
      // Also invalidate user data to update SLERF balance
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  return {
    vaults: vaultsQuery.data as StakingVault[] || [],
    userStakes: userStakesQuery.data as (UserStake & { vault: StakingVault })[] || [],
    isVaultsLoading: vaultsQuery.isLoading,
    isStakesLoading: userStakesQuery.isLoading,
    stakeTokens,
    unstakeTokens,
    claimStakingRewards,
  };
}
