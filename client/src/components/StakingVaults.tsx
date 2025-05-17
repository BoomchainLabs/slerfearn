import React, { useState } from 'react';
import { useStaking } from '@/hooks/useStaking';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StakingVaults: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    vaults,
    userStakes,
    isVaultsLoading,
    isStakesLoading,
    stakeTokens,
    unstakeTokens,
    claimStakingRewards,
  } = useStaking();

  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedVaultId, setSelectedVaultId] = useState<number | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const handleStakeClick = (vaultId: number) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to stake $SLERF",
      });
      return;
    }

    setSelectedVaultId(vaultId);
    setStakeAmount('');
    setIsStakeModalOpen(true);
  };

  const handleStakeSubmit = () => {
    if (!selectedVaultId) return;
    
    const amount = parseInt(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive",
      });
      return;
    }

    stakeTokens.mutate({
      vaultId: selectedVaultId,
      amount,
    }, {
      onSuccess: () => {
        toast({
          title: "Tokens Staked",
          description: `You've staked ${amount} $SLERF successfully!`,
        });
        setIsStakeModalOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to stake tokens",
          variant: "destructive",
        });
      }
    });
  };

  const handleUnstakeClick = (stakeId: number) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to unstake $SLERF",
      });
      return;
    }

    unstakeTokens.mutate(stakeId, {
      onSuccess: (data) => {
        toast({
          title: "Tokens Unstaked",
          description: `You've unstaked ${data.amount} $SLERF successfully!`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to unstake tokens",
          variant: "destructive",
        });
      }
    });
  };

  const handleClaimClick = (stakeId: number) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to claim rewards",
      });
      return;
    }

    claimStakingRewards.mutate(stakeId, {
      onSuccess: (data) => {
        toast({
          title: "Rewards Claimed",
          description: `You've claimed ${data.rewards} $SLERF in rewards!`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to claim rewards",
          variant: "destructive",
        });
      }
    });
  };

  // Get user stake for a specific vault
  const getUserStakeForVault = (vaultId: number) => {
    return userStakes.find(stake => stake.vault.id === vaultId);
  };

  // Check if requirements are met for a vault
  const checkRequirementsMet = (vaultId: number) => {
    // In a real app, this would check if the user meets the requirements
    // For this demo, only the first vault is accessible by default
    return vaultId === 1;
  };

  if (isVaultsLoading) {
    return (
      <section id="staking" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-space font-bold mb-8">Staking Vaults</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultSkeleton />
            <VaultSkeleton />
            <VaultSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="staking" className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-space font-bold mb-8">Staking Vaults</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vaults.map(vault => {
            const userStake = getUserStakeForVault(vault.id);
            const requirementsMet = checkRequirementsMet(vault.id);
            
            // Determine the color theme based on vault
            const getThemeColor = () => {
              if (vault.name.includes("Basic")) return "slerf-orange";
              if (vault.name.includes("Enhanced")) return "slerf-purple";
              return "slerf-cyan";
            };
            
            const themeColor = getThemeColor();
            
            return (
              <div 
                key={vault.id} 
                className={`glass rounded-xl p-6 overflow-hidden relative border border-${themeColor}/30 hover:border-${themeColor}/50 transition`}
              >
                <div className={`absolute -top-6 -right-6 bg-${themeColor}/10 h-20 w-20 rounded-full blur-xl`}></div>
                
                <h3 className="text-xl font-medium mb-1">{vault.name}</h3>
                <div className="flex items-center mb-4">
                  <div className={`text-2xl font-mono font-medium text-${themeColor}`}>{vault.apr}% APR</div>
                  {vault.id > 1 && (
                    <div className={`ml-2 text-xs bg-${themeColor}/20 text-${themeColor} px-2 py-0.5 rounded-full`}>
                      {vault.id === 2 ? '+7% Bonus' : '+22% Bonus'}
                    </div>
                  )}
                  {vault.id === 1 && (
                    <div className={`ml-2 text-xs bg-${themeColor}/20 text-${themeColor} px-2 py-0.5 rounded-full`}>
                      Base
                    </div>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{vault.description}</p>
                
                <div className="bg-slerf-dark/50 p-4 rounded-lg mb-4">
                  {!requirementsMet ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Requirements</span>
                        <span className="font-mono text-xs text-gray-400">
                          {vault.id === 2 ? 'Slerf Booster NFT' : 'Legendary NFT + 500 USDC'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Status</span>
                        <span className="text-red-400 text-xs">Requirements not met</span>
                      </div>
                    </>
                  ) : userStake ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">My Stake</span>
                        <span className="font-mono">{userStake.amount} $SLERF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Earned</span>
                        <span className={`font-mono text-${themeColor}`}>{userStake.rewards} $SLERF</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">My Stake</span>
                        <span className="font-mono">0 $SLERF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Earned</span>
                        <span className={`font-mono text-${themeColor}`}>0 $SLERF</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {requirementsMet ? (
                    <>
                      <button 
                        className={`bg-${themeColor} hover:bg-${themeColor}/90 text-white px-4 py-2 rounded-lg font-medium transition`}
                        onClick={() => handleStakeClick(vault.id)}
                      >
                        Stake
                      </button>
                      <button 
                        className={`border border-${themeColor} hover:bg-${themeColor}/10 text-white px-4 py-2 rounded-lg font-medium transition`}
                        onClick={() => userStake ? handleClaimClick(userStake.id) : null}
                        disabled={!userStake || userStake.rewards === 0}
                      >
                        Claim
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="bg-slerf-dark/50 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                        disabled
                      >
                        Stake
                      </button>
                      <button 
                        className="border border-slerf-dark/50 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                        disabled
                      >
                        Claim
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staking Modal */}
      <Dialog open={isStakeModalOpen} onOpenChange={setIsStakeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stake $SLERF</DialogTitle>
            <DialogDescription>
              Enter the amount of $SLERF you want to stake in this vault.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="stake-amount">
                Amount to Stake
              </label>
              <Input
                id="stake-amount"
                type="number"
                placeholder="Enter amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStakeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStakeSubmit} className="bg-slerf-orange hover:bg-slerf-orange/90 text-white">
              Stake Tokens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

const VaultSkeleton = () => (
  <div className="glass rounded-xl p-6 overflow-hidden relative border border-slerf-dark/30">
    <Skeleton className="h-7 w-1/2 mb-1 bg-slerf-dark/50" />
    <div className="flex items-center mb-4">
      <Skeleton className="h-8 w-28 mr-2 bg-slerf-dark/50" />
      <Skeleton className="h-5 w-20 rounded-full bg-slerf-dark/50" />
    </div>
    <Skeleton className="h-4 w-full mb-4 bg-slerf-dark/50" />
    <Skeleton className="h-28 w-full mb-4 rounded-lg bg-slerf-dark/50" />
    <div className="grid grid-cols-2 gap-2">
      <Skeleton className="h-10 rounded-lg bg-slerf-dark/50" />
      <Skeleton className="h-10 rounded-lg bg-slerf-dark/50" />
    </div>
  </div>
);

export default StakingVaults;
