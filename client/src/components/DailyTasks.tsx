import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import AnimatedCatLogo from './AnimatedCatLogo';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

interface DailyTasksProps {
  className?: string;
  loading?: boolean;
}

const DailyTasks: React.FC<DailyTasksProps> = ({
  className = "",
  loading = false
}) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task1',
      title: 'Daily Check-in',
      description: 'Log in to the platform each day to earn LERF tokens.',
      reward: 5,
      completed: false,
      category: 'daily',
      difficulty: 'easy',
      icon: '✓'
    },
    {
      id: 'task2',
      title: 'Market Watch',
      description: 'Spend at least 5 minutes viewing the live trading charts.',
      reward: 10,
      completed: false,
      category: 'daily',
      difficulty: 'easy',
      icon: '📈'
    },
    {
      id: 'task3',
      title: 'Blockchain Explorer',
      description: 'View at least 3 transactions in the blockchain explorer.',
      reward: 15,
      completed: false,
      category: 'daily',
      difficulty: 'medium',
      icon: '🔍'
    },
    {
      id: 'task4',
      title: 'Social Media Share',
      description: 'Share token updates on your social media accounts.',
      reward: 25,
      completed: false,
      category: 'daily',
      difficulty: 'medium',
      icon: '📱'
    },
    {
      id: 'task5',
      title: 'Staking Bonus',
      description: 'Stake at least 100 LERF tokens for 30 days or more.',
      reward: 50,
      completed: false,
      category: 'special',
      difficulty: 'hard',
      icon: '🔒'
    }
  ]);
  
  const [totalEarned, setTotalEarned] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(3); // Example streak
  const [nextReward, setNextReward] = useState(100); // Next streak reward
  
  // Calculate progress percentage
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;
  
  // Complete a task and earn rewards
  const completeTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        // Increment total earned
        setTotalEarned(prev => prev + task.reward);
        
        // Show success notification
        toast({
          title: "Task Completed!",
          description: `You earned ${task.reward} LERF tokens.`,
          variant: "default",
        });
        
        // Return updated task
        return { ...task, completed: true };
      }
      return task;
    }));
  };
  
  // Realistic countdown until tasks reset
  const getTimeUntilReset = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const diffMs = midnight.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className={`cyber-card p-0.5 rounded-xl overflow-hidden ${className}`}>
        <div className="bg-black/80 rounded-lg p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`cyber-card p-0.5 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-black/80 rounded-lg p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AnimatedCatLogo size={40} interval={8000} />
            <div className="ml-3">
              <h3 className="text-lg font-audiowide text-white">Daily <span className="text-[hsl(var(--cyber-pink))]">Tasks</span></h3>
              <div className="text-xs text-white/70">Complete tasks to earn $LERF tokens</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs text-white/70">Resets in</div>
              <div className="text-sm font-mono">{getTimeUntilReset()}</div>
            </div>
            
            <div className="bg-black/40 p-2 rounded-md">
              <div className="text-xs text-white/70">Streak</div>
              <div className="text-sm font-mono font-bold text-[hsl(var(--cyber-teal))]">{dailyStreak} days</div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-white/70">Daily progress</span>
            <span className="text-white/70">{completedTasks}/{tasks.length} tasks</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-3 mb-4">
          {tasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.02 }}
              className="p-3 bg-black/30 border border-white/10 rounded-lg flex items-center"
            >
              <div className="bg-gradient-to-br from-[hsl(var(--cyber-purple))] to-[hsl(var(--cyber-pink))] w-10 h-10 flex items-center justify-center rounded-md text-lg">
                {task.icon}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-semibold text-white">{task.title}</h4>
                  <span className="font-mono text-[hsl(var(--cyber-teal))]">+{task.reward} LERF</span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">{task.description}</p>
              </div>
              
              <div className="ml-4">
                <Button
                  variant={task.completed ? "outline" : "default"}
                  size="sm"
                  onClick={() => completeTask(task.id)}
                  disabled={task.completed}
                  className={task.completed ? "border-green-500 text-green-500" : ""}
                >
                  {task.completed ? "Completed" : "Claim"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="rounded-lg bg-gradient-to-r from-[hsl(var(--cyber-purple))] to-[hsl(var(--cyber-blue))] p-0.5">
          <div className="bg-black/90 rounded-md p-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-white/70 text-xs">Next streak reward</span>
                <div className="font-mono font-bold text-white">{nextReward} LERF</div>
                <div className="text-xs text-white/70 mt-1">in {7 - (dailyStreak % 7)} days</div>
              </div>
              
              <div className="text-right">
                <span className="text-white/70 text-xs">Total earned</span>
                <div className="font-mono font-bold text-[hsl(var(--cyber-pink))]">{totalEarned} LERF</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;