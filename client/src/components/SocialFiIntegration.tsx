import React from 'react';
import { useSocial } from '@/hooks/useSocial';
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

const SocialFiIntegration: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const {
    socialConnections,
    isSocialConnectionsLoading,
    connectSocial,
    disconnectSocial,
    isConnected,
    getConnectionId,
  } = useSocial();

  const handleConnectTwitter = () => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet first",
      });
      return;
    }

    if (isConnected('twitter')) {
      const connectionId = getConnectionId('twitter');
      if (connectionId) {
        disconnectSocial.mutate(connectionId, {
          onSuccess: () => {
            toast({
              title: "Disconnected",
              description: "Successfully disconnected Twitter account",
            });
          }
        });
      }
      return;
    }

    // In a real app, this would open OAuth flow
    // For this demo, we'll simulate connecting
    connectSocial.mutate({ 
      platform: 'twitter', 
      username: wallet.shortAddress || 'user'  
    }, {
      onSuccess: () => {
        toast({
          title: "Connected",
          description: "Successfully connected Twitter account",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to connect Twitter account",
          variant: "destructive",
        });
      }
    });
  };

  const handleConnectFarcaster = () => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "You need to connect your wallet first",
      });
      return;
    }

    if (isConnected('farcaster')) {
      const connectionId = getConnectionId('farcaster');
      if (connectionId) {
        disconnectSocial.mutate(connectionId, {
          onSuccess: () => {
            toast({
              title: "Disconnected",
              description: "Successfully disconnected Farcaster account",
            });
          }
        });
      }
      return;
    }

    // In a real app, this would open OAuth flow
    // For this demo, we'll simulate connecting
    connectSocial.mutate({ 
      platform: 'farcaster', 
      username: wallet.shortAddress || 'user'  
    }, {
      onSuccess: () => {
        toast({
          title: "Connected",
          description: "Successfully connected Farcaster account",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to connect Farcaster account",
          variant: "destructive",
        });
      }
    });
  };

  const handleViewTasks = () => {
    toast({
      title: "Coming Soon",
      description: "Social tasks will be available in the next update",
    });
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-space font-bold mb-6">SocialFi Integration</h2>
        <p className="text-lg text-gray-300 mb-8 md:w-2/3">
          Connect your social media accounts to earn additional $SLERF rewards through engagement and sharing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="bg-[#1D9BF0]/20 p-3 rounded-lg mr-4">
                  <i className="ri-twitter-x-fill text-3xl text-[#1D9BF0]"></i>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Twitter/X</h3>
                  <p className="text-sm text-gray-400">
                    Status: <span className={isConnected('twitter') ? "text-green-400" : "text-red-400"}>
                      {isConnected('twitter') ? 'Connected' : 'Not Connected'}
                    </span>
                  </p>
                </div>
              </div>
              <button 
                className={`${isConnected('twitter') 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-[#1D9BF0] hover:bg-[#1D9BF0]/90'} text-white px-4 py-2 rounded-lg font-medium transition flex items-center`}
                onClick={handleConnectTwitter}
              >
                <i className={`${isConnected('twitter') ? 'ri-link-unlink-m' : 'ri-link-m'} mr-2`}></i>
                {isConnected('twitter') ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-slerf-dark/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-reply-line text-gray-400 mr-3"></i>
                  <span>Retweet official content</span>
                </div>
                <span className="font-mono text-sm text-slerf-orange">+25 $SLERF</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slerf-dark/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-hashtag mr-3 text-gray-400"></i>
                  <span>Post with #SlerfHub hashtag</span>
                </div>
                <span className="font-mono text-sm text-slerf-orange">+50 $SLERF</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slerf-dark/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-user-follow-line mr-3 text-gray-400"></i>
                  <span>Follow @slerf00</span>
                </div>
                <span className="font-mono text-sm text-slerf-orange">+10 $SLERF</span>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                className={`${isConnected('twitter') 
                  ? 'bg-slerf-orange hover:bg-slerf-orange/90' 
                  : 'bg-slerf-dark/50 text-gray-400'} px-4 py-2 rounded-lg font-medium ${isConnected('twitter') ? '' : 'cursor-not-allowed'} w-full`}
                onClick={handleViewTasks}
                disabled={!isConnected('twitter')}
              >
                View Available Tasks
              </button>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="bg-[#8A50CF]/20 p-3 rounded-lg mr-4">
                  <i className="ri-broadcast-line text-3xl text-[#8A50CF]"></i>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Farcaster</h3>
                  <p className="text-sm text-gray-400">
                    Status: <span className={isConnected('farcaster') ? "text-green-400" : "text-red-400"}>
                      {isConnected('farcaster') ? 'Connected' : 'Not Connected'}
                    </span>
                  </p>
                </div>
              </div>
              <button 
                className={`${isConnected('farcaster') 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-[#8A50CF] hover:bg-[#8A50CF]/90'} text-white px-4 py-2 rounded-lg font-medium transition flex items-center`}
                onClick={handleConnectFarcaster}
              >
                <i className={`${isConnected('farcaster') ? 'ri-link-unlink-m' : 'ri-link-m'} mr-2`}></i>
                {isConnected('farcaster') ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-slerf-dark/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-chat-1-line text-gray-400 mr-3"></i>
                  <span>Cast about SlerfHub</span>
                </div>
                <span className="font-mono text-sm text-slerf-orange">+40 $SLERF</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slerf-dark/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-heart-line mr-3 text-gray-400"></i>
                  <span>Like official casts</span>
                </div>
                <span className="font-mono text-sm text-slerf-orange">+15 $SLERF</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slerf-dark/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-group-line mr-3 text-gray-400"></i>
                  <span>Join SlerfHub channel</span>
                </div>
                <span className="font-mono text-sm text-slerf-orange">+30 $SLERF</span>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                className={`${isConnected('farcaster') 
                  ? 'bg-slerf-orange hover:bg-slerf-orange/90' 
                  : 'bg-slerf-dark/50 text-gray-400'} px-4 py-2 rounded-lg font-medium ${isConnected('farcaster') ? '' : 'cursor-not-allowed'} w-full`}
                onClick={handleViewTasks}
                disabled={!isConnected('farcaster')}
              >
                View Available Tasks
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 glass rounded-xl p-6">
          <h3 className="text-xl font-space font-bold mb-4">Social Engagement Leaderboard</h3>
          <p className="text-sm text-gray-400 mb-6">
            Top users who have earned the most $SLERF through social media engagement this month.
          </p>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slerf-dark/50">
                <TableRow>
                  <TableHead className="text-left">Rank</TableHead>
                  <TableHead className="text-left">User</TableHead>
                  <TableHead className="text-left">Platform</TableHead>
                  <TableHead className="text-center">Engagements</TableHead>
                  <TableHead className="text-right">Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slerf-dark/30">
                <TableRow>
                  <TableCell className="px-6 py-4 font-medium">1</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32" 
                        alt="Social leader avatar" 
                        className="w-8 h-8 rounded-full mr-3" 
                      />
                      <span>memecreator</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">Twitter/X</TableCell>
                  <TableCell className="px-6 py-4 text-center">128</TableCell>
                  <TableCell className="px-6 py-4 text-right font-mono text-slerf-orange">3,250 $SLERF</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 font-medium">2</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32" 
                        alt="Social leader avatar" 
                        className="w-8 h-8 rounded-full mr-3" 
                      />
                      <span>cryptoinfluencer</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">Farcaster</TableCell>
                  <TableCell className="px-6 py-4 text-center">97</TableCell>
                  <TableCell className="px-6 py-4 text-right font-mono text-slerf-orange">2,840 $SLERF</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 font-medium">3</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32" 
                        alt="Social leader avatar" 
                        className="w-8 h-8 rounded-full mr-3" 
                      />
                      <span>slerfambassador</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">Twitter/X</TableCell>
                  <TableCell className="px-6 py-4 text-center">83</TableCell>
                  <TableCell className="px-6 py-4 text-right font-mono text-slerf-orange">2,150 $SLERF</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFiIntegration;
