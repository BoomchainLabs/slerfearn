import React, { useEffect } from 'react';
import { useDailyMissions } from '@/hooks/useMissions';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const DailyMissions: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    missions,
    userProgress,
    isMissionsLoading,
    isProgressLoading,
    initMissionProgress,
    updateMissionProgress,
    claimMissionReward,
  } = useDailyMissions();

  useEffect(() => {
    // Initialize mission progress for user if they haven't started any missions yet
    if (wallet && missions.length > 0 && !isProgressLoading && userProgress.length === 0) {
      missions.forEach(mission => {
        initMissionProgress.mutate(mission.id);
      });
    }
  }, [wallet, missions, isProgressLoading, userProgress]);

  const handleCompleteClick = (missionId: number) => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet to complete missions",
      });
      return;
    }

    // Find the progress for this mission
    const progress = userProgress.find(p => p.mission.id === missionId);
    if (!progress) {
      toast({
        title: "Error",
        description: "Mission progress not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Simulate completing the mission
    updateMissionProgress.mutate({
      progressId: progress.id,
      progress: 1,
      completed: true,
    }, {
      onSuccess: () => {
        toast({
          title: "Mission Completed",
          description: "You've completed the mission successfully!",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to complete mission",
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

    claimMissionReward.mutate(progressId, {
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

  // Calculate time until daily reset
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const [resetTime, setResetTime] = React.useState(getTimeUntilReset());

  useEffect(() => {
    const timer = setInterval(() => {
      setResetTime(getTimeUntilReset());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  if (isMissionsLoading) {
    return (
      <section id="missions" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-space font-bold">Daily Missions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MissionSkeleton />
            <MissionSkeleton />
            <MissionSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="missions" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-space font-bold">Daily Missions</h2>
          <div className="flex items-center space-x-2 bg-slerf-dark/50 px-3 py-1.5 rounded-lg">
            <i className="ri-time-line text-slerf-orange"></i>
            <span className="font-mono text-sm">Resets in {resetTime}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map(mission => {
            const progress = userProgress.find(p => p.mission.id === mission.id);
            const isCompleted = progress?.completed || false;
            const isClaimed = progress?.claimed || false;
            const progressValue = progress?.progress || 0;
            const progressMax = 1; // Daily missions are usually complete/not complete
            const progressPercent = (progressValue / progressMax) * 100;
            
            return (
              <div key={mission.id} className="mission-card glass rounded-xl p-6 transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slerf-orange/20 p-3 rounded-lg">
                    <i className={`${mission.icon} text-2xl text-slerf-orange`}></i>
                  </div>
                  <div className="text-center bg-slerf-dark/50 px-3 py-1 rounded-lg">
                    <span className="font-mono text-sm text-slerf-orange">+{mission.reward} $SLERF</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-2">{mission.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{mission.description}</p>
                
                <div className="w-full bg-slerf-dark/50 h-2 rounded-full mb-3">
                  <div 
                    className="bg-slerf-orange h-2 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {progressValue}/{progressMax} complete
                  </span>
                  {isCompleted ? (
                    isClaimed ? (
                      <button 
                        className="bg-gray-600 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                        disabled
                      >
                        Claimed
                      </button>
                    ) : (
                      <button 
                        className="bg-slerf-orange hover:bg-slerf-orange/90 text-white px-4 py-2 rounded-lg font-medium transition"
                        onClick={() => handleClaimClick(progress?.id || 0)}
                      >
                        Claim
                      </button>
                    )
                  ) : mission.icon === 'ri-twitter-x-line' ? (
                    <button 
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
                      onClick={() => handleCompleteClick(mission.id)}
                    >
                      <i className="ri-twitter-x-line mr-2"></i>
                      Connect
                    </button>
                  ) : mission.icon === 'ri-discord-line' ? (
                    <button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
                      onClick={() => handleCompleteClick(mission.id)}
                    >
                      <i className="ri-discord-line mr-2"></i>
                      Join
                    </button>
                  ) : (
                    <button 
                      className="bg-slerf-orange hover:bg-slerf-orange/90 text-white px-4 py-2 rounded-lg font-medium transition"
                      onClick={() => handleCompleteClick(mission.id)}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const MissionSkeleton = () => (
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

export default DailyMissions;
