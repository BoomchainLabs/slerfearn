import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Wallet, Users, Trophy, Target, Gift, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import lerfLogo from "@/assets/lerf-logo.png";

export default function TokenRewards() {
  const queryClient = useQueryClient();

  // Get user's token balance and stats
  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  // Connect wallet for rewards
  const connectWallet = useMutation({
    mutationFn: async (walletAddress: string) => {
      return apiRequest("/api/wallet/connect", "POST", { walletAddress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });

  const formatTokenAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section with Real LERF Token */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <img 
            src={lerfLogo} 
            alt="$LERF Token" 
            className="w-16 h-16 rounded-full border-2 border-yellow-500"
          />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              $LERF Rewards Hub
            </h1>
            <p className="text-xl text-muted-foreground">Earn authentic $LERF tokens through community engagement</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">100B</div>
            <div className="text-sm text-muted-foreground">Total Supply</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">$24.43K</div>
            <div className="text-sm text-muted-foreground">Market Cap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">Base</div>
            <div className="text-sm text-muted-foreground">Network</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">0%</div>
            <div className="text-sm text-muted-foreground">Tax</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="https://www.dextools.io/app/en/base/pair-explorer/0xbd08f83afd361483f1325dd89cae2aaaa9387080" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              DexTools
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://basescan.org/token/0x233df63325933fa3f2dac8e695cd84bb2f91ab07" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              BaseScan
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://app.uniswap.org/explore/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Uniswap V3
            </a>
          </Button>
        </div>
      </div>

      {/* User Balance Display */}
      {userStats && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={lerfLogo} alt="$LERF" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-2xl font-bold">{formatTokenAmount(userStats.lerfBalance)} $LERF</div>
                  <div className="text-sm text-muted-foreground">Your Balance</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-500">{formatTokenAmount(userStats.totalEarned)}</div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earning Opportunities */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily Missions</TabsTrigger>
          <TabsTrigger value="trivia">Trivia</TabsTrigger>
          <TabsTrigger value="wallet">Wallet Connect</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Daily Missions
              </CardTitle>
              <CardDescription>Complete daily tasks to earn $LERF tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Connect Your First Wallet</div>
                    <div className="text-sm text-muted-foreground">Link your wallet to start earning</div>
                  </div>
                  <Badge variant="secondary">1M $LERF</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Share on Social Media</div>
                    <div className="text-sm text-muted-foreground">Share $LERF content on Twitter</div>
                  </div>
                  <Badge variant="secondary">500K $LERF</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Complete Daily Trivia</div>
                    <div className="text-sm text-muted-foreground">Answer crypto questions correctly</div>
                  </div>
                  <Badge variant="secondary">500K - 2.5M $LERF</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trivia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Daily Trivia Challenge
              </CardTitle>
              <CardDescription>Test your crypto knowledge and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Questions per day:</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base reward:</span>
                    <span className="font-semibold">500K $LERF each</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Perfect score bonus:</span>
                    <span className="font-semibold">+2M $LERF</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">Up to 3.5M</div>
                    <div className="text-sm text-muted-foreground">Max daily earnings</div>
                  </div>
                </div>
              </div>
              <Button className="w-full" asChild>
                <a href="/trivia">Start Daily Trivia</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Connection Rewards
              </CardTitle>
              <CardDescription>Earn tokens for connecting multiple wallets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">First Wallet Connection</div>
                    <div className="text-sm text-muted-foreground">MetaMask, Phantom, or other</div>
                  </div>
                  <Badge>1M $LERF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Second Wallet</div>
                    <div className="text-sm text-muted-foreground">Connect additional wallet</div>
                  </div>
                  <Badge>500K $LERF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Cross-Chain Wallet</div>
                    <div className="text-sm text-muted-foreground">Solana, Ethereum, Base</div>
                  </div>
                  <Badge>2M $LERF</Badge>
                </div>
              </div>
              <Button className="w-full">Connect Wallet</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Engagement
              </CardTitle>
              <CardDescription>Follow, share, and engage to earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Follow on Twitter</div>
                    <div className="text-sm text-muted-foreground">@LerfToken</div>
                  </div>
                  <Badge variant="outline">100K $LERF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Join Discord</div>
                    <div className="text-sm text-muted-foreground">Community server</div>
                  </div>
                  <Badge variant="outline">100K $LERF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Star GitHub</div>
                    <div className="text-sm text-muted-foreground">Open source contributions</div>
                  </div>
                  <Badge variant="outline">200K $LERF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Refer Friends</div>
                    <div className="text-sm text-muted-foreground">Both earn rewards</div>
                  </div>
                  <Badge variant="outline">1M $LERF</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Token Distribution Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Token Distribution
          </CardTitle>
          <CardDescription>How $LERF tokens are allocated for community rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-500">40B</div>
              <div className="text-sm text-muted-foreground">Community Rewards</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-500">20B</div>
              <div className="text-sm text-muted-foreground">Trivia & Gaming</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-500">10B</div>
              <div className="text-sm text-muted-foreground">Wallet Rewards</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">30B</div>
              <div className="text-sm text-muted-foreground">Market & Liquidity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}