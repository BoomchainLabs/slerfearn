import { useQuery } from "@tanstack/react-query";
import { useWallet } from "./useWallet";
import { apiRequest } from "@/lib/queryClient";

export function useReferrals() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch referral leaderboard
  const leaderboardQuery = useQuery({
    queryKey: ['/api/referrals/leaderboard'],
    enabled: !!wallet,
  });

  // Fetch user's referral stats
  const userReferralsQuery = useQuery({
    queryKey: ['/api/users', userId, 'referrals'],
    queryFn: async () => {
      if (!userId) return null;
      const res = await apiRequest('GET', `/api/users/${userId}/referrals`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Generate a shareable referral link for the current user
  const generateReferralLink = () => {
    if (!wallet) return "";
    
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${wallet.shortAddress}`;
  };

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    const link = generateReferralLink();
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        return true;
      } catch (err) {
        console.error("Failed to copy: ", err);
        return false;
      }
    }
    return false;
  };

  return {
    leaderboard: leaderboardQuery.data || [],
    userReferrals: userReferralsQuery.data || { referrals: 0, earned: 0, tier: "bronze" },
    isLeaderboardLoading: leaderboardQuery.isLoading,
    isUserReferralsLoading: userReferralsQuery.isLoading,
    generateReferralLink,
    copyReferralLink,
  };
}
