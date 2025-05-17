import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./useWallet";
import { queryClient } from "@/lib/queryClient";
import { Game, GameScore } from "@shared/schema";

export function useGames() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch all games
  const gamesQuery = useQuery({
    queryKey: ['/api/games'],
    enabled: !!wallet,
  });

  // Fetch user's game scores
  const userScoresQuery = useQuery({
    queryKey: ['/api/users', userId, 'games/scores'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/users/${userId}/games/scores`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Fetch game leaderboards
  const getGameLeaderboard = (gameId: number, limit: number = 10) => {
    return useQuery({
      queryKey: ['/api/games', gameId, 'leaderboard', limit],
      queryFn: async () => {
        const res = await apiRequest('GET', `/api/games/${gameId}/leaderboard?limit=${limit}`);
        return res.json();
      },
      enabled: !!gameId,
    });
  };

  // Submit a game score
  const submitGameScore = useMutation({
    mutationFn: async ({ 
      gameId, 
      score 
    }: { 
      gameId: number; 
      score: number 
    }) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/games/${gameId}/scores`,
        { score }
      );
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'games/scores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/games', variables.gameId, 'leaderboard'] });
      
      // Also invalidate user data to update SLERF balance since user might have earned rewards
      if (wallet) {
        queryClient.invalidateQueries({ queryKey: ['/api/users/wallet', wallet.address] });
      }
    }
  });

  // Simulate playing a game
  const playGame = (gameId: number) => {
    // This would be replaced with actual game logic
    // For demo, we'll generate a random score
    const randomScore = Math.floor(Math.random() * 10000);
    
    return submitGameScore.mutate({ gameId, score: randomScore });
  };

  // Get user's high score for a specific game
  const getUserHighScore = (gameId: number) => {
    if (!userScoresQuery.data) return { score: 0, rank: 'N/A' };
    
    const gameScores = userScoresQuery.data as (GameScore & { game: Game })[];
    const gameScore = gameScores.find(score => score.game.id === gameId);
    
    return {
      score: gameScore?.score || 0,
      rank: gameScore ? '#42' : 'N/A' // In a real app, this would be calculated
    };
  };

  return {
    games: gamesQuery.data as Game[] || [],
    userScores: userScoresQuery.data as (GameScore & { game: Game })[] || [],
    isGamesLoading: gamesQuery.isLoading,
    isScoresLoading: userScoresQuery.isLoading,
    getGameLeaderboard,
    submitGameScore,
    playGame,
    getUserHighScore,
  };
}
