import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./useWallet";
import { queryClient } from "@/lib/queryClient";
import { DailyMission, UserMissionProgress } from "@shared/schema";

export function useDailyMissions() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch all daily missions
  const missionsQuery = useQuery({
    queryKey: ['/api/missions'],
    enabled: !!wallet,
  });

  // Fetch user's mission progress
  const userProgressQuery = useQuery({
    queryKey: ['/api/users', userId, 'missions'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/users/${userId}/missions`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Initialize a mission's progress for the user
  const initMissionProgress = useMutation({
    mutationFn: async (missionId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest('POST', `/api/users/${userId}/missions/${missionId}/progress`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'missions'] });
    }
  });

  // Update mission progress
  const updateMissionProgress = useMutation({
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
        `/api/users/${userId}/missions/progress/${progressId}`,
        { progress, completed }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'missions'] });
    }
  });

  // Claim mission reward
  const claimMissionReward = useMutation({
    mutationFn: async (progressId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/missions/progress/${progressId}/claim`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'missions'] });
      // Also invalidate user data to update SLERF balance
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  return {
    missions: missionsQuery.data as DailyMission[] || [],
    userProgress: userProgressQuery.data as (UserMissionProgress & { mission: DailyMission })[] || [],
    isMissionsLoading: missionsQuery.isLoading,
    isProgressLoading: userProgressQuery.isLoading,
    initMissionProgress,
    updateMissionProgress,
    claimMissionReward,
  };
}
