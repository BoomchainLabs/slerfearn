import React, { useEffect } from 'react';
import { useWeeklyQuests } from '@/hooks/useQuests';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const WeeklyQuests: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    quests,
    userProgress,
    isQuestsLoading,
    isProgressLoading,
    initQuestProgress,
    updateQuestProgress,
    claimQuestReward,
  } = useWeeklyQuests();

  useEffect(() => {
    // Initialize quest progress for user if they haven't started any quests yet
    if (wallet && quests.length > 0 && !isProgressLoading && userProgress.length === 0) {
      quests.forEach(quest => {
        // Extract progress requirements from quest
        let progressMax = 1;
        if (quest.requirements) {
          const req = quest.requirements as any;
          if (req.amount) progressMax = req.amount;
          if (req.count) progressMax = req.count;
          if (req.wins) progressMax = req.wins;
        }

        initQuestProgress.mutate({
          questId: quest.id,
          progressMax
        });
      });
    }
  }, [wallet, quests, isProgressLoading, userProgress]);

  const handleProgressClick = (questId: number, amount: number = 1) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to make progress on quests",
      });
      return;
    }

    // Find the progress for this quest
    const progress = userProgress.find(p => p.quest.id === questId);
    if (!progress) {
      toast({
        title: "Error",
        description: "Quest progress not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Update progress and check if completed
    const newProgress = Math.min(progress.progress + amount, progress.progressMax);
    const completed = newProgress >= progress.progressMax;

    updateQuestProgress.mutate({
      progressId: progress.id,
      progress: newProgress,
      completed,
    }, {
      onSuccess: () => {
        if (completed) {
          toast({
            title: "Quest Completed",
            description: "You've completed the quest successfully!",
          });
        } else {
          toast({
            title: "Progress Updated",
            description: `Progress: ${newProgress}/${progress.progressMax}`,
          });
        }
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update progress",
          variant: "destructive",
        });
      }
    });
  };

  const handleClaimClick = (progressId: number) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to claim rewards",
      });
      return;
    }

    claimQuestReward.mutate(progressId, {
      onSuccess: (data) => {
        toast({
          title: "Reward Claimed",
          description: `You've claimed ${data.reward} $SLERF!`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to claim reward",
          variant: "destructive",
        });
      }
    });
  };

  // Calculate time until weekly rotation
  const getTimeUntilRotation = () => {
    // Calculate days and hours until the end of the week (Sunday midnight)
    const now = new Date();
    const daysUntilSunday = 7 - now.getDay();
    const hoursLeft = 24 - now.getHours() - 1;
    
    return `${daysUntilSunday}d ${hoursLeft}h`;
  };

  if (isQuestsLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-slerf-dark to-slerf-dark/70">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-space font-bold">Weekly Quests</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestSkeleton />
            <QuestSkeleton />
            <QuestSkeleton />
            <QuestSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slerf-dark to-slerf-dark/70">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-space font-bold">Weekly Quests</h2>
          <div className="flex items-center space-x-2 bg-slerf-dark/50 px-3 py-1.5 rounded-lg">
            <i className="ri-calendar-line text-slerf-purple"></i>
            <span className="font-mono text-sm">Rotates in {getTimeUntilRotation()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quests.map(quest => {
            const progress = userProgress.find(p => p.quest.id === quest.id);
            const isCompleted = progress?.completed || false;
            const isClaimed = progress?.claimed || false;
            const progressValue = progress?.progress || 0;
            const progressMax = progress?.progressMax || 1;
            const progressPercent = (progressValue / progressMax) * 100;
            
            // Get appropriate button text based on quest type
            const getButtonText = () => {
              if (isCompleted) {
                return isClaimed ? "Claimed" : "Claim";
              }
              
              const req = quest.requirements as any;
              
              if (req?.type === "stake") {
                return "Stake More";
              } else if (req?.type === "referral") {
                return "Copy Link";
              } else if (req?.type === "game") {
                return "Play Now";
              } else if (req?.type === "mint") {
                return "Mint NFT";
              }
              
              return "Progress";
            };

            // Determine button styling
            const getButtonClass = () => {
              if (isCompleted && isClaimed) {
                return "bg-slerf-dark text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed";
              }
              
              if (isCompleted) {
                return "bg-slerf-purple hover:bg-slerf-purple/90 text-white px-4 py-2 rounded-lg font-medium transition";
              }
              
              const req = quest.requirements as any;
              
              if (req?.type === "referral") {
                return "border border-slerf-purple hover:bg-slerf-purple/10 text-white px-4 py-2 rounded-lg font-medium transition";
              } else if (req?.type === "mint" && progressValue === 0) {
                return "border border-slerf-purple hover:bg-slerf-purple/10 text-white px-4 py-2 rounded-lg font-medium transition";
              }
              
              return "bg-slerf-purple hover:bg-slerf-purple/90 text-white px-4 py-2 rounded-lg font-medium transition";
            };

            // Determine action when button is clicked
            const handleButtonClick = () => {
              if (isCompleted && !isClaimed) {
                return handleClaimClick(progress?.id || 0);
              }
              
              if (!isCompleted) {
                // For demonstration, we'll just increment progress
                return handleProgressClick(quest.id);
              }
            };
            
            return (
              <div key={quest.id} className="quest-card glass rounded-xl p-6 transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slerf-purple/20 p-3 rounded-lg">
                    <i className={`${quest.icon} text-2xl text-slerf-purple`}></i>
                  </div>
                  <div className="text-center bg-slerf-dark/50 px-3 py-1 rounded-lg">
                    <span className="font-mono text-sm text-slerf-purple">+{quest.reward} $SLERF</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-2">{quest.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{quest.description}</p>
                
                <div className="w-full bg-slerf-dark/50 h-2 rounded-full mb-3">
                  <div 
                    className="bg-slerf-purple h-2 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {progressValue}/{progressMax} {quest.requirements && (quest.requirements as any).type === "stake" ? "$SLERF" : "complete"}
                  </span>
                  <button 
                    className={getButtonClass()}
                    onClick={handleButtonClick}
                    disabled={isCompleted && isClaimed}
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const QuestSkeleton = () => (
  <div className="glass rounded-xl p-6">
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="h-12 w-12 rounded-lg bg-slerf-dark/50" />
      <Skeleton className="h-8 w-24 rounded-lg bg-slerf-dark/50" />
    </div>
    <Skeleton className="h-7 w-3/4 mb-2 bg-slerf-dark/50" />
    <Skeleton className="h-4 w-full mb-6 bg-slerf-dark/50" />
    <Skeleton className="h-2 w-full mb-3 rounded-full bg-slerf-dark/50" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-20 bg-slerf-dark/50" />
      <Skeleton className="h-10 w-24 rounded-lg bg-slerf-dark/50" />
    </div>
  </div>
);

export default WeeklyQuests;
