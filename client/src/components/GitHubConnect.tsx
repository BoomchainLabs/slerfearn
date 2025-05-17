import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// GitHub connection rewards
const GITHUB_REWARDS = {
  connection: 75, // Base reward for connecting
  starBonus: 25, // Bonus for starring the repo
  followBonus: 15 // Bonus for following the project
};

const GitHubConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'input' | 'verifying' | 'success'>('input');
  const [earnedRewards, setEarnedRewards] = useState({
    connection: 0,
    starBonus: 0,
    followBonus: 0
  });
  const { toast } = useToast();

  const simulateGitHubConnection = () => {
    setIsLoading(true);
    setConnectionStep('verifying');
    
    // Simulate API call delay
    setTimeout(() => {
      // Simulate verification success
      setConnectionStep('success');
      setIsConnected(true);
      setIsLoading(false);
      
      // Calculate rewards
      const rewards = {
        connection: GITHUB_REWARDS.connection,
        starBonus: Math.random() > 0.3 ? GITHUB_REWARDS.starBonus : 0, // 70% chance of star bonus
        followBonus: Math.random() > 0.4 ? GITHUB_REWARDS.followBonus : 0 // 60% chance of follow bonus
      };
      
      setEarnedRewards(rewards);
      
      // Show success notification
      toast({
        title: "GitHub Connected",
        description: `Connected as ${username}. You've earned ${Object.values(rewards).reduce((a, b) => a + b, 0)} SLERF tokens!`,
      });
    }, 2000);
  };
  
  const handleConnect = () => {
    if (!username) {
      toast({
        title: "Username Required",
        description: "Please enter your GitHub username to connect",
        variant: "destructive"
      });
      return;
    }
    
    simulateGitHubConnection();
  };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setConnectionStep('input');
    if (!isConnected) {
      setUsername('');
    }
  };
  
  const getTotalRewards = () => {
    return Object.values(earnedRewards).reduce((a, b) => a + b, 0);
  };
  
  return (
    <>
      <Button
        onClick={openModal}
        variant={isConnected ? "outline" : "default"}
        className={isConnected ? "border-purple-500 text-purple-500 hover:bg-purple-500/10" : "bg-purple-600 hover:bg-purple-700"}
      >
        <svg viewBox="0 0 98 96" width="16" height="16" className="mr-2 fill-current">
          <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
        </svg>
        {isConnected ? `Connected (${username})` : 'Connect GitHub'}
      </Button>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass max-w-md sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {connectionStep === 'success' ? 'GitHub Connected!' : 'Connect GitHub Account'}
            </DialogTitle>
            <DialogDescription>
              {connectionStep === 'input' && 'Connect your GitHub account to earn SLERF tokens and access exclusive features.'}
              {connectionStep === 'verifying' && 'Verifying your GitHub account...'}
              {connectionStep === 'success' && `Successfully connected as ${username}!`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {connectionStep === 'input' && (
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-white p-2 rounded-full">
                    <svg viewBox="0 0 98 96" width="30" height="30" className="fill-black">
                      <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Connect Your GitHub Account</h3>
                    <p className="text-sm text-gray-400">Earn up to {Object.values(GITHUB_REWARDS).reduce((a, b) => a + b, 0)} SLERF tokens</p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="github-username" className="text-sm font-medium mb-1 block">
                    GitHub Username
                  </label>
                  <Input
                    id="github-username"
                    className="bg-slerf-dark border-slerf-dark-lighter"
                    placeholder="Enter your GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="glass-dark p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Earn SLERF Tokens:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Connect GitHub Account
                      </span>
                      <span className="font-mono">{GITHUB_REWARDS.connection} SLERF</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Star Our Repository
                      </span>
                      <span className="font-mono">{GITHUB_REWARDS.starBonus} SLERF</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Follow Our Project
                      </span>
                      <span className="font-mono">{GITHUB_REWARDS.followBonus} SLERF</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleConnect}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connecting...' : 'Connect GitHub'}
                  </Button>
                  <Button variant="outline" onClick={closeModal} className="w-1/3">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {connectionStep === 'verifying' && (
              <div className="py-8 flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-medium mb-2">Verifying GitHub Account</h3>
                <p className="text-gray-400 text-center">
                  Connecting to GitHub and checking your profile...
                </p>
              </div>
            )}
            
            {connectionStep === 'success' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center py-2">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Successfully Connected!</h3>
                  <div className="text-purple-500 text-2xl font-bold font-mono mt-1">
                    +{getTotalRewards()} SLERF
                  </div>
                </div>
                
                <div className="glass-dark p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Rewards Earned:</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        GitHub Connection
                      </span>
                      <span className="font-mono">{earnedRewards.connection} SLERF</span>
                    </li>
                    
                    {earnedRewards.starBonus > 0 && (
                      <li className="flex justify-between items-center">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Repository Star Bonus
                        </span>
                        <span className="font-mono">{earnedRewards.starBonus} SLERF</span>
                      </li>
                    )}
                    
                    {earnedRewards.followBonus > 0 && (
                      <li className="flex justify-between items-center">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Project Follow Bonus
                        </span>
                        <span className="font-mono">{earnedRewards.followBonus} SLERF</span>
                      </li>
                    )}
                    
                    <li className="border-t border-slerf-dark-lighter pt-2 mt-2 flex justify-between items-center font-medium">
                      <span>Total Rewards</span>
                      <span className="font-mono">{getTotalRewards()} SLERF</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={closeModal}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Continue to SlerfHub
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GitHubConnect;