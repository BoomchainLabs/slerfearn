import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./useWallet";
import { queryClient } from "@/lib/queryClient";
import { WeeklyQuest, UserQuestProgress } from "@shared/schema";

export function useWeeklyQuests() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch all weekly quests
  const questsQuery = useQuery({
    queryKey: ['/api/quests'],
    enabled: !!wallet,
  });

  // Fetch user's quest progress
  const userProgressQuery = useQuery({
    queryKey: ['/api/users', userId, 'quests'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/users/${userId}/quests`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Initialize a quest's progress for the user
  const initQuestProgress = useMutation({
    mutationFn: async ({ 
      questId, 
      progressMax 
    }: { 
      questId: number; 
      progressMax: number 
    }) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/quests/${questId}/progress`,
        { progressMax }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'quests'] });
    }
  });

  // Update quest progress
  const updateQuestProgress = useMutation({
    mutationFn: async ({ 
      progressId, 
      progress, 
      completed 
    }: { 
      progressId: number; 
      progress: number; 
      completed: boolean;
    }) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'PUT', 
        `/api/users/${userId}/quests/progress/${progressId}`,
        { progress, completed }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'quests'] });
    }
  });

  // Claim quest reward
  const claimQuestReward = useMutation({
    mutationFn: async (progressId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/quests/progress/${progressId}/claim`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'quests'] });
      // Also invalidate user data to update SLERF balance
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  return {
    quests: questsQuery.data as WeeklyQuest[] || [],
    userProgress: userProgressQuery.data as (UserQuestProgress & { quest: WeeklyQuest })[] || [],
    isQuestsLoading: questsQuery.isLoading,
    isProgressLoading: userProgressQuery.isLoading,
    initQuestProgress,
    updateQuestProgress,
    claimQuestReward,
  };
}
