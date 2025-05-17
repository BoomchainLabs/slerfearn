import React from 'react';
import { useGames } from '@/hooks/useGames';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const MiniGames: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    games,
    isGamesLoading,
    playGame,
    getUserHighScore,
  } = useGames();

  // For the first game, fetch leaderboard
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useGames().getGameLeaderboard(1, 3);

  const handlePlayGame = (gameId: number, gameTitle: string) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to play games",
      });
      return;
    }

    // In a real app, this would navigate to the game or open a game modal
    // For this demo, we'll simulate playing by generating a random score
    playGame(gameId);
    
    toast({
      title: `Playing ${gameTitle}`,
      description: "Game completed! Your score has been submitted.",
    });
  };

  if (isGamesLoading) {
    return (
      <section id="games" className="py-16 px-4 bg-gradient-to-b from-slerf-dark/70 to-slerf-dark">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-space font-bold">Play-to-Earn Games</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GameSkeleton />
            <GameSkeleton />
            <GameSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="py-16 px-4 bg-gradient-to-b from-slerf-dark/70 to-slerf-dark">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-space font-bold">Play-to-Earn Games</h2>
          <div className="flex items-center space-x-2 bg-slerf-dark/50 px-3 py-1.5 rounded-lg">
            <i className="ri-trophy-line text-slerf-cyan"></i>
            <span className="font-mono text-sm">Leaderboard resets in 5d</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map(game => {
            const highScore = getUserHighScore(game.id);
            
            return (
              <div key={game.id} className="game-card glass rounded-xl overflow-hidden transition duration-300">
                <img 
                  src={game.imageUrl} 
                  alt={`${game.title} game`} 
                  className="w-full h-48 object-cover" 
                />
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium">{game.title}</h3>
                    <div className="text-center bg-slerf-dark/50 px-3 py-1 rounded-lg">
                      <span className="font-mono text-xs text-slerf-cyan">+{game.reward} $SLERF/win</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{game.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-xs text-gray-400">My High Score</div>
                      <div className="font-mono">{highScore.score} pts</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">My Rank</div>
                      <div className="font-mono">{highScore.rank}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Top Score</div>
                      <div className="font-mono">
                        {game.id === 1 && leaderboard && leaderboard.length > 0
                          ? `${leaderboard[0].score} pts`
                          : game.id === 2 ? '8,742 pts' : '950 pts'}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark px-4 py-2 rounded-lg font-medium transition"
                    onClick={() => handlePlayGame(game.id, game.title)}
                  >
                    Play Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Leaderboard Preview */}
        <div className="mt-12">
          <h3 className="text-xl font-space font-bold mb-4">Top Players This Week</h3>
          <div className="glass rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slerf-dark/50">
                <TableRow>
                  <TableHead className="text-left">Rank</TableHead>
                  <TableHead className="text-left">Player</TableHead>
                  <TableHead className="text-left hidden md:table-cell">Favorite Game</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Rewards</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slerf-dark/30">
                {isLeaderboardLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">Loading leaderboard...</TableCell>
                  </TableRow>
                ) : leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => (
                    <TableRow 
                      key={entry.user.id} 
                      className={index === 0 ? "bg-slerf-cyan/10" : ""}
                    >
                      <TableCell className="px-6 py-4 font-medium">
                        {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : '🥉 3'}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={`https://images.unsplash.com/photo-${index === 0 ? '1472099645785-5658abf4ff4e' : index === 1 ? '1607746882042-944635dfe10e' : '1531427186611-ecfd6d936c79'}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32`} 
                            alt={`${index + 1} place player avatar`} 
                            className="w-8 h-8 rounded-full mr-3" 
                          />
                          <span>{entry.user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 hidden md:table-cell">
                        {games.find(g => g.id === entry.gameId)?.title || 'Slerf Runner'}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-mono">{entry.score}</TableCell>
                      <TableCell className="px-6 py-4 text-right font-mono text-slerf-cyan">
                        {index === 0 ? '1,000' : index === 1 ? '750' : '500'} $SLERF
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No leaderboard entries yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

const GameSkeleton = () => (
  <div className="glass rounded-xl overflow-hidden">
    <Skeleton className="w-full h-48 bg-slerf-dark/50" />
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-7 w-1/3 bg-slerf-dark/50" />
        <Skeleton className="h-6 w-24 rounded-lg bg-slerf-dark/50" />
      </div>
      <Skeleton className="h-4 w-full mb-6 bg-slerf-dark/50" />
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-20 bg-slerf-dark/50" />
        <Skeleton className="h-10 w-20 bg-slerf-dark/50" />
        <Skeleton className="h-10 w-20 bg-slerf-dark/50" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg bg-slerf-dark/50" />
    </div>
  </div>
);

export default MiniGames;
