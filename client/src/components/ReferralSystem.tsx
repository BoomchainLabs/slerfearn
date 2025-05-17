import React, { useState } from 'react';
import { useReferrals } from '@/hooks/useReferral';
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

const ReferralSystem: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    leaderboard,
    userReferrals,
    isLeaderboardLoading,
    isUserReferralsLoading,
    generateReferralLink,
    copyReferralLink,
  } = useReferrals();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to generate a referral link",
      });
      return;
    }

    const success = await copyReferralLink();
    
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Link Copied",
        description: "Referral link copied to clipboard!",
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy referral link to clipboard",
        variant: "destructive",
      });
    }
  };

  // Get tier details based on referral count
  const getTierInfo = (referrals: number) => {
    if (referrals >= 50) {
      return { tier: "Diamond", commission: "15%" };
    } else if (referrals >= 20) {
      return { tier: "Gold", commission: "10%" };
    } else if (referrals >= 5) {
      return { tier: "Silver", commission: "7.5%" };
    } else {
      return { tier: "Bronze", commission: "5%" };
    }
  };

  // Get next tier info
  const getNextTierInfo = (referrals: number) => {
    if (referrals >= 50) {
      return { tier: "Max Tier", needed: 0 };
    } else if (referrals >= 20) {
      return { tier: "Diamond", needed: 50 - referrals };
    } else if (referrals >= 5) {
      return { tier: "Gold", needed: 20 - referrals };
    } else {
      return { tier: "Silver", needed: 5 - referrals };
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slerf-dark to-slerf-dark/70">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-space font-bold mb-4">Refer & Earn</h2>
            <p className="text-lg text-gray-300 mb-8">
              Invite friends to join SlerfHub and earn a percentage of their rewards. The more friends you refer, the more $SLERF you earn!
            </p>
            
            <div className="glass rounded-xl p-6 mb-8">
              <h3 className="text-xl font-medium mb-4">Your Referral Stats</h3>
              {isUserReferralsLoading ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Skeleton className="h-24 rounded-lg bg-slerf-dark/50" />
                  <Skeleton className="h-24 rounded-lg bg-slerf-dark/50" />
                  <Skeleton className="h-24 rounded-lg bg-slerf-dark/50" />
                  <Skeleton className="h-24 rounded-lg bg-slerf-dark/50" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slerf-dark/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Total Referrals</div>
                    <div className="text-2xl font-mono">{userReferrals.referrals}</div>
                  </div>
                  <div className="bg-slerf-dark/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Earned $SLERF</div>
                    <div className="text-2xl font-mono text-slerf-orange">{userReferrals.earned}</div>
                  </div>
                  <div className="bg-slerf-dark/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Current Tier</div>
                    <div className="text-lg">{getTierInfo(userReferrals.referrals).tier}</div>
                    <div className="text-xs text-slerf-orange">{getTierInfo(userReferrals.referrals).commission} Commission</div>
                  </div>
                  <div className="bg-slerf-dark/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Next Tier</div>
                    <div className="text-lg">{getNextTierInfo(userReferrals.referrals).tier}</div>
                    <div className="text-xs">
                      {getNextTierInfo(userReferrals.referrals).needed > 0 
                        ? `${getNextTierInfo(userReferrals.referrals).needed} Referrals needed`
                        : "Maximum tier reached"}
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Referral Link</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={wallet ? generateReferralLink() : "Connect wallet to generate link"} 
                    readOnly 
                    className="bg-slerf-dark/50 text-white rounded-l-lg px-4 py-2 flex-1 text-sm focus:outline-none" 
                  />
                  <button 
                    className="bg-slerf-orange hover:bg-slerf-orange/90 text-white px-4 py-2 rounded-r-lg font-medium transition"
                    onClick={handleCopyLink}
                    disabled={!wallet}
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4">Referral Tiers</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-700 to-amber-500 flex items-center justify-center text-xl">
                    🥉
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Bronze Tier</h4>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">0-4 Referrals</span>
                      <span className="text-xs text-slerf-orange">5% Commission</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-300 flex items-center justify-center text-xl">
                    🥈
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Silver Tier</h4>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">5-19 Referrals</span>
                      <span className="text-xs text-slerf-orange">7.5% Commission</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center justify-center text-xl">
                    🥇
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Gold Tier</h4>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">20-49 Referrals</span>
                      <span className="text-xs text-slerf-orange">10% Commission</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-slerf-purple to-slerf-cyan flex items-center justify-center text-xl">
                    💎
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Diamond Tier</h4>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">50+ Referrals</span>
                      <span className="text-xs text-slerf-orange">15% Commission</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-space font-bold mb-4">Top Referrers</h3>
            
            <div className="glass rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slerf-dark/50">
                  <TableRow>
                    <TableHead className="text-left">Rank</TableHead>
                    <TableHead className="text-left">User</TableHead>
                    <TableHead className="text-center">Referrals</TableHead>
                    <TableHead className="text-right">Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slerf-dark/30">
                  {isLeaderboardLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">Loading leaderboard...</TableCell>
                    </TableRow>
                  ) : leaderboard.length > 0 ? (
                    leaderboard.map((entry, index) => (
                      <TableRow 
                        key={entry.id} 
                        className={index === 0 ? "bg-slerf-orange/10" : ""}
                      >
                        <TableCell className="px-6 py-4 font-medium">
                          {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `${index + 1}`}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center">
                            <img 
                              src={`https://images.unsplash.com/photo-${index === 0 ? '1531427186611-ecfd6d936c79' : index === 1 ? '1472099645785-5658abf4ff4e' : index === 2 ? '1607746882042-944635dfe10e' : index === 3 ? '1570295999919-56ceb5ecca61' : '1568602471122-7832951cc4c5'}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32`} 
                              alt={`${index + 1} place referrer avatar`} 
                              className="w-8 h-8 rounded-full mr-3" 
                            />
                            <span>{entry.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center font-mono">{entry.referrals}</TableCell>
                        <TableCell className="px-6 py-4 text-right font-mono text-slerf-orange">{entry.earned} $SLERF</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">No referrals data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-8 glass rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4">How It Works</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 flex-shrink-0 bg-slerf-dark/50 h-8 w-8 flex items-center justify-center rounded-full text-slerf-orange font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Generate Your Link</h4>
                    <p className="text-sm text-gray-400">Create your unique referral link from your dashboard</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex-shrink-0 bg-slerf-dark/50 h-8 w-8 flex items-center justify-center rounded-full text-slerf-orange font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Share With Friends</h4>
                    <p className="text-sm text-gray-400">Share your link on social media or directly with friends</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex-shrink-0 bg-slerf-dark/50 h-8 w-8 flex items-center justify-center rounded-full text-slerf-orange font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Earn Commission</h4>
                    <p className="text-sm text-gray-400">Earn a percentage of all $SLERF your referrals claim</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex-shrink-0 bg-slerf-dark/50 h-8 w-8 flex items-center justify-center rounded-full text-slerf-orange font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Tier Up</h4>
                    <p className="text-sm text-gray-400">Increase your referral tier to earn even higher commissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralSystem;
