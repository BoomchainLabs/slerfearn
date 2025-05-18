import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from '@/hooks/useWallet';
import SLERFAnimatedLogo from './SLERFAnimatedLogo';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
  timeRequired: string;
}

interface DailyTasksProps {
  className?: string;
}

const DailyTasks: React.FC<DailyTasksProps> = ({ className = "" }) => {
  const { toast } = useToast();
  const { wallet, connectWallet } = useWallet();
  
  // Sample tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task1',
      title: 'Visit marketplace',
      description: 'Explore the NFT marketplace for 5 minutes',
      reward: '10 $LERF',
      completed: false,
      timeRequired: '5 min',
    },
    {
      id: 'task2',
      title: 'Trade $LERF',
      description: 'Make at least one trade on an exchange',
      reward: '50 $LERF',
      completed: false,
      timeRequired: '10 min',
    },
    {
      id: 'task3',
      title: 'Share on social',
      description: 'Share SLERF content on your social media',
      reward: '25 $LERF',
      completed: false,
      timeRequired: '2 min',
    },
    {
      id: 'task4',
      title: 'Stake tokens',
      description: 'Stake any amount of $LERF tokens',
      reward: '100 $LERF',
      completed: false,
      timeRequired: '5 min',
    },
    {
      id: 'task5',
      title: 'Invite a friend',
      description: 'Refer a friend to join SLERF platform',
      reward: '200 $LERF',
      completed: false,
      timeRequired: '3 min',
    },
  ]);
  
  // Toggle task completion
  const toggleTask = (taskId: string) => {
    if (!wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to track task completion",
        variant: "destructive"
      });
      return;
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    // Show success message
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "Task Completed!",
        description: `You've earned ${task.reward} for completing "${task.title}"`,
        variant: "default"
      });
    }
  };
  
  // Calculate completion percentage
  const completedCount = tasks.filter(task => task.completed).length;
  const completionPercentage = (completedCount / tasks.length) * 100;
  
  // Calculate total rewards
  const totalPossibleRewards = tasks.reduce((total, task) => {
    const rewardValue = parseInt(task.reward.split(' ')[0]);
    return total + rewardValue;
  }, 0);
  
  const earnedRewards = tasks.reduce((total, task) => {
    if (task.completed) {
      const rewardValue = parseInt(task.reward.split(' ')[0]);
      return total + rewardValue;
    }
    return total;
  }, 0);
  
  return (
    <div className={`cyber-card p-0.5 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-black/80 rounded-lg p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SLERFAnimatedLogo size={36} interval={7000} />
            <h3 className="ml-3 text-lg font-audiowide text-white">Daily Tasks</h3>
          </div>
          <div className="flex items-center text-xs text-white/60 font-mono">
            RESETS IN <span className="text-[hsl(var(--cyber-blue))] ml-1">12:45:30</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white/70">{completedCount}/{tasks.length} Completed</span>
            <span className="text-xs font-mono text-[hsl(var(--cyber-pink))]">{earnedRewards}/{totalPossibleRewards} $LERF</span>
          </div>
          <Progress value={completionPercentage} className="h-2" 
            indicatorClassName="bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))]" />
        </div>
        
        <div className="space-y-3 flex-grow overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="p-3 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div 
                  className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center cursor-pointer transition-colors ${
                    task.completed 
                      ? 'bg-[hsl(var(--cyber-blue))]' 
                      : 'border border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-medium ${task.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <span className="ml-2 text-xs py-0.5 px-1.5 rounded bg-white/10 text-white/70 font-mono">
                      {task.timeRequired}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    {task.description}
                  </p>
                  <div className="mt-2 text-[hsl(var(--cyber-pink))] text-sm font-mono">
                    {task.reward}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!wallet ? (
          <Button 
            className="mt-4 w-full bg-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--cyber-blue))/90] font-bold"
            onClick={() => connectWallet && connectWallet()}
          >
            Connect Wallet to Track Tasks
          </Button>
        ) : completedCount === tasks.length ? (
          <Button 
            className="mt-4 w-full bg-[hsl(var(--cyber-pink))] hover:bg-[hsl(var(--cyber-pink))/90] font-bold"
            onClick={() => toast({
              title: "All tasks completed!",
              description: "You've completed all available tasks for today. Check back tomorrow!",
              variant: "default"
            })}
          >
            All Tasks Completed! 🎉
          </Button>
        ) : (
          <Button 
            className="mt-4 w-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))] hover:opacity-90 font-bold"
            onClick={() => toast({
              title: "Keep going!",
              description: `Complete ${tasks.length - completedCount} more tasks to earn all rewards!`,
              variant: "default"
            })}
          >
            Claim {earnedRewards} $LERF Rewards
          </Button>
        )}
      </div>
    </div>
  );
};

export default DailyTasks;