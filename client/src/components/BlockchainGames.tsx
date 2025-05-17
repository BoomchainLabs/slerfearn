import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ethers } from 'ethers';

// SLERF Token Contract
const SLERF_TOKEN_ADDRESS = '0x233df63325933fa3f2dac8e695cd84bb2f91ab07';

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  rewards: string;
  complexity: "Easy" | "Medium" | "Hard";
  type: "Puzzle" | "Strategy" | "Action" | "Arcade";
  minStake: number;
  APY: number;
  isLive: boolean;
}

const games: Game[] = [
  {
    id: 1,
    title: "SLERF Blocks",
    description: "Match colored blocks and earn SLERF rewards. The higher your score, the more tokens you earn!",
    imageUrl: "https://placehold.co/600x400/242535/e2e8f0/?text=SLERF+Blocks",
    rewards: "Up to 50 SLERF daily",
    complexity: "Easy",
    type: "Puzzle",
    minStake: 100,
    APY: 12,
    isLive: true
  },
  {
    id: 2,
    title: "Crypto Racer",
    description: "Race against other players and earn SLERF based on your position. Top 3 finishers get rewarded!",
    imageUrl: "https://placehold.co/600x400/242535/e2e8f0/?text=Crypto+Racer",
    rewards: "Up to 75 SLERF daily",
    complexity: "Medium",
    type: "Action",
    minStake: 250,
    APY: 15,
    isLive: true
  },
  {
    id: 3,
    title: "DeFi Defense",
    description: "Protect your tokens from hackers in this tower defense game. Earn SLERF for each successful defense.",
    imageUrl: "https://placehold.co/600x400/242535/e2e8f0/?text=DeFi+Defense",
    rewards: "Up to 120 SLERF daily",
    complexity: "Hard",
    type: "Strategy",
    minStake: 500,
    APY: 18,
    isLive: true
  },
  {
    id: 4,
    title: "Token Trader",
    description: "Test your trading skills in this simulated DEX. Stake SLERF to participate and earn more based on performance.",
    imageUrl: "https://placehold.co/600x400/242535/e2e8f0/?text=Token+Trader",
    rewards: "Up to 200 SLERF daily",
    complexity: "Hard",
    type: "Strategy",
    minStake: 1000,
    APY: 24,
    isLive: false
  },
  {
    id: 5,
    title: "Slerf Jump",
    description: "Simple endless runner where you jump over obstacles to collect SLERF coins. Perfect for beginners!",
    imageUrl: "https://placehold.co/600x400/242535/e2e8f0/?text=Slerf+Jump",
    rewards: "Up to 35 SLERF daily",
    complexity: "Easy",
    type: "Arcade",
    minStake: 50,
    APY: 10,
    isLive: true
  },
  {
    id: 6,
    title: "NFT Battle Arena",
    description: "Use your NFTs to battle other players and earn SLERF. Coming soon!",
    imageUrl: "https://placehold.co/600x400/242535/e2e8f0/?text=NFT+Battle+Arena",
    rewards: "Up to 300 SLERF daily",
    complexity: "Medium",
    type: "Strategy",
    minStake: 750,
    APY: 20,
    isLive: false
  }
];

const BlockchainGames: React.FC = () => {
  const { wallet, connectWallet: connect } = useWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [showGameModal, setShowGameModal] = useState<boolean>(false);

  const filteredGames = activeTab === "all" 
    ? games 
    : games.filter(game => game.type.toLowerCase() === activeTab.toLowerCase());

  const handlePlayGame = (game: Game) => {
    if (!wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to play games and earn SLERF tokens.",
        variant: "destructive",
      });
      return;
    }

    setSelectedGame(game);
    setStakeAmount(game.minStake);
    setShowGameModal(true);

    // In a real implementation, this would interact with the blockchain
    toast({
      title: "Game Starting",
      description: `Preparing ${game.title}. Get ready to earn SLERF tokens!`,
    });

    // Simulate waiting for blockchain confirmation
    setTimeout(() => {
      // Here you would redirect to the actual game or show a game interface
      window.open(`/games/${game.id}`, "_blank");
      
      setShowGameModal(false);
    }, 2000);
  };

  const handleStakeForGame = async (game: Game) => {
    if (!wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to stake SLERF tokens.",
        variant: "destructive",
      });
      return;
    }

    if (stakeAmount < game.minStake) {
      toast({
        title: "Insufficient Stake",
        description: `Minimum stake required is ${game.minStake} SLERF tokens.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, this would call a smart contract method
      toast({
        title: "Staking in Progress",
        description: `Staking ${stakeAmount} SLERF tokens for ${game.title}...`,
      });
      
      // Simulate blockchain confirmation
      setTimeout(() => {
        toast({
          title: "Stake Successful",
          description: `Successfully staked ${stakeAmount} SLERF tokens for ${game.title}. Expected APY: ${game.APY}%`,
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-slerf-dark/90 to-slerf-dark">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-space font-bold mb-4">Blockchain Games</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Play, stake, and earn $SLERF tokens through our collection of blockchain-powered games. 
            Connect your wallet to get started!
          </p>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList className="bg-slerf-dark-light">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="action">Action</TabsTrigger>
              <TabsTrigger value="arcade">Arcade</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <Card key={game.id} className="bg-slerf-dark-light border border-slerf-dark-light/60 overflow-hidden hover:border-slerf-purple/50 transition-all">
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={game.imageUrl} 
                      alt={game.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-medium">{game.title}</CardTitle>
                      <Badge variant={game.isLive ? "default" : "outline"}>
                        {game.isLive ? "Live" : "Coming Soon"}
                      </Badge>
                    </div>
                    <div className="flex space-x-2 mt-1">
                      <Badge variant="outline" className="bg-slerf-dark/40">
                        {game.type}
                      </Badge>
                      <Badge variant="outline" className="bg-slerf-dark/40">
                        {game.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4">{game.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rewards:</span>
                        <span className="text-slerf-cyan font-medium">{game.rewards}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Stake:</span>
                        <span>{game.minStake} SLERF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">APY:</span>
                        <span className="text-green-400">{game.APY}%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="w-[48%] border-slerf-purple/50 hover:bg-slerf-purple/20"
                      onClick={() => handleStakeForGame(game)}
                      disabled={!game.isLive}
                    >
                      Stake
                    </Button>
                    <Button 
                      className="w-[48%] bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark"
                      onClick={() => handlePlayGame(game)}
                      disabled={!game.isLive}
                    >
                      Play Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {!wallet && (
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              onClick={connect}
              className="bg-slerf-purple hover:bg-slerf-purple/90"
            >
              Connect Wallet to Play & Earn
            </Button>
          </div>
        )}
        
        <div className="mt-12 glass p-6 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-3">How Blockchain Games Work on SlerfHub</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-slerf-cyan/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl text-slerf-cyan font-bold">1</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Connect & Stake</h4>
              <p className="text-gray-400 text-sm">Connect your wallet and stake SLERF tokens to access premium games with higher rewards.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-slerf-cyan/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl text-slerf-cyan font-bold">2</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Play & Compete</h4>
              <p className="text-gray-400 text-sm">Play games and compete on leaderboards. Higher scores mean more SLERF token rewards.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-slerf-cyan/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl text-slerf-cyan font-bold">3</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Earn & Compound</h4>
              <p className="text-gray-400 text-sm">Earn SLERF tokens based on your performance. Stake your earnings to compound your rewards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainGames;