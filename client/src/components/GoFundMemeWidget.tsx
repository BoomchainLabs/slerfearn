import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from '@/hooks/useWallet';
import SLERFAnimatedLogo from './SLERFAnimatedLogo';

// Mock implementation of the GoFundMeme SDK
interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  goalAmount: number;
  currentAmount: number;
  backers: number;
  endDate: string;
  thumbnailUrl: string;
}

// Sample campaigns data
const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: 'campaign-1',
    title: 'SLERF Community Event',
    description: 'Help fund our upcoming community hackathon in New York City',
    creator: '0x7a2309...8f32',
    goalAmount: 5000,
    currentAmount: 3200,
    backers: 124,
    endDate: '2025-06-15',
    thumbnailUrl: '/assets/campaign1.jpg'
  },
  {
    id: 'campaign-2',
    title: 'OpenSource DeFi Dashboard',
    description: 'Building a free, open-source dashboard for $LERF token analytics',
    creator: '0x12ab78...9d45',
    goalAmount: 2500,
    currentAmount: 1800,
    backers: 87,
    endDate: '2025-05-30',
    thumbnailUrl: '/assets/campaign2.jpg'
  },
  {
    id: 'campaign-3',
    title: 'Cross-Chain Bridge Development',
    description: 'Support the development of a dedicated $LERF cross-chain bridge',
    creator: '0xf423e1...5ab2',
    goalAmount: 10000,
    currentAmount: 4200,
    backers: 215,
    endDate: '2025-07-10',
    thumbnailUrl: '/assets/campaign3.jpg'
  }
];

interface GoFundMemeWidgetProps {
  className?: string;
}

const GoFundMemeWidget: React.FC<GoFundMemeWidgetProps> = ({ className = "" }) => {
  const { toast } = useToast();
  const { wallet, connectWallet } = useWallet();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  
  // Load campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // In a real implementation, this would use the actual SDK
        // const sdk = new GoFundMemeSDK({ apiKey: process.env.GOFUNDMEME_API_KEY });
        // const response = await sdk.getCampaigns({ token: 'LERF' });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCampaigns(SAMPLE_CAMPAIGNS);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          variant: "destructive",
          title: "Failed to load campaigns",
          description: "Could not connect to GoFundMeme API. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [toast]);
  
  // Calculate days remaining for a campaign
  const getDaysRemaining = (dateStr: string) => {
    const endDate = new Date(dateStr);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Calculate progress percentage
  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min(100, Math.round((current / goal) * 100));
  };
  
  // Handle contribution submission
  const handleContribute = async () => {
    if (!wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to contribute",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCampaign) {
      toast({
        title: "No campaign selected",
        description: "Please select a campaign to contribute to",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid contribution amount",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would use the SDK to make the contribution
    // try {
    //   const sdk = new GoFundMemeSDK({ apiKey: process.env.GOFUNDMEME_API_KEY });
    //   await sdk.contributeToCampaign({
    //     campaignId: selectedCampaign.id,
    //     amount,
    //     walletAddress: wallet.address,
    //     token: 'LERF'
    //   });
    // } catch (error) {
    //   console.error('Error contributing to campaign:', error);
    //   toast({
    //     variant: "destructive",
    //     title: "Transaction failed",
    //     description: "Could not process your contribution. Please try again."
    //   });
    //   return;
    // }
    
    // For demo purposes, we'll just show a success message
    toast({
      title: "Contribution successful!",
      description: `You've contributed ${amount} $LERF to ${selectedCampaign.title}`,
      variant: "default"
    });
    
    // Update the UI to reflect the contribution
    setCampaigns(campaigns.map(campaign => 
      campaign.id === selectedCampaign.id 
        ? { 
            ...campaign, 
            currentAmount: campaign.currentAmount + amount,
            backers: campaign.backers + 1
          } 
        : campaign
    ));
    
    // Reset the form
    setContributionAmount('');
    setSelectedCampaign(null);
  };
  
  return (
    <Card className={`cyber-card p-0.5 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-black/80 rounded-lg p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SLERFAnimatedLogo size={36} interval={9000} />
            <h3 className="ml-3 text-lg font-audiowide text-white">Community Campaigns</h3>
          </div>
          <div className="text-xs text-white/60 font-mono">
            POWERED BY GOFUNDMEME
          </div>
        </div>
        
        {selectedCampaign ? (
          <div className="flex-grow flex flex-col">
            <Button 
              variant="ghost" 
              className="self-start mb-4 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setSelectedCampaign(null)}
            >
              ← Back to campaigns
            </Button>
            
            <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="p-4 bg-black/40 rounded-lg mb-4">
                <h4 className="text-xl font-audiowide text-white mb-2">{selectedCampaign.title}</h4>
                <p className="text-white/70 mb-4">{selectedCampaign.description}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/60">Progress</span>
                  <span className="text-sm font-mono">
                    {getProgressPercentage(selectedCampaign.currentAmount, selectedCampaign.goalAmount)}%
                  </span>
                </div>
                
                <div className="h-2 bg-black/50 rounded-full mb-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))]"
                    style={{ width: `${getProgressPercentage(selectedCampaign.currentAmount, selectedCampaign.goalAmount)}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-white/60">Raised</div>
                    <div className="text-lg font-mono text-white">{selectedCampaign.currentAmount} $LERF</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60">Goal</div>
                    <div className="text-lg font-mono text-white">{selectedCampaign.goalAmount} $LERF</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60">Backers</div>
                    <div className="text-lg font-mono text-white">{selectedCampaign.backers}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 px-4 bg-black/30 rounded-lg mb-4">
                  <div>
                    <div className="text-xs text-white/60">Creator</div>
                    <div className="text-sm font-mono text-white">{selectedCampaign.creator}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Ends in</div>
                    <div className="text-sm font-mono text-[hsl(var(--cyber-pink))]">
                      {getDaysRemaining(selectedCampaign.endDate)} days
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-black/40 rounded-lg">
                <h5 className="font-medium text-white mb-4">Contribute to this campaign</h5>
                
                <div className="mb-4">
                  <div className="text-sm text-white/60 mb-2">Amount ($LERF)</div>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="bg-black/30 border-white/10 text-white"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                    />
                    <Button 
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/10"
                      onClick={() => setContributionAmount('100')}
                    >
                      100
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/10"
                      onClick={() => setContributionAmount('500')}
                    >
                      500
                    </Button>
                  </div>
                </div>
                
                {!wallet ? (
                  <Button 
                    className="w-full bg-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--cyber-blue))/90] font-bold"
                    onClick={() => connectWallet && connectWallet()}
                  >
                    Connect Wallet to Contribute
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))] hover:opacity-90 font-bold"
                    onClick={handleContribute}
                  >
                    Contribute {contributionAmount ? `${contributionAmount} $LERF` : ''}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="text-white/50 mb-2">No active campaigns</div>
                  <div className="text-sm text-white/30">
                    Check back later for new community campaigns
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map(campaign => (
                    <div 
                      key={campaign.id}
                      className="p-4 bg-black/40 rounded-lg border border-white/5 hover:border-white/20 transition-all hover:bg-black/60 cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-white">{campaign.title}</h4>
                        <span className="text-xs py-0.5 px-2 rounded bg-[hsl(var(--cyber-pink))/20] text-[hsl(var(--cyber-pink))]">
                          {getDaysRemaining(campaign.endDate)} days left
                        </span>
                      </div>
                      
                      <p className="text-sm text-white/70 mb-3 line-clamp-2">{campaign.description}</p>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-white/60">
                          {campaign.currentAmount} / {campaign.goalAmount} $LERF
                        </span>
                        <span className="text-xs font-mono">
                          {getProgressPercentage(campaign.currentAmount, campaign.goalAmount)}%
                        </span>
                      </div>
                      
                      <div className="h-1.5 bg-black/50 rounded-full mb-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[hsl(var(--cyber-pink))] to-[hsl(var(--cyber-blue))]"
                          style={{ width: `${getProgressPercentage(campaign.currentAmount, campaign.goalAmount)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40">
                          {campaign.backers} backers
                        </span>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="text-[hsl(var(--cyber-blue))] border-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--cyber-blue))/10]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCampaign(campaign);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-white/50">
                Total Campaigns: {campaigns.length}
              </span>
              <Button 
                size="sm"
                variant="default"
                className="bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-purple))] hover:opacity-90"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Campaign creation functionality will be available soon!",
                  variant: "default"
                })}
              >
                Create Campaign
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default GoFundMemeWidget;