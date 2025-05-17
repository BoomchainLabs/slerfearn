import React, { useState } from 'react';
import { Keypair } from "@solana/web3.js";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface Allocation {
  name: string;
  percent: number;
  destination: string;
}

const FairLaunchCreator: React.FC = () => {
  const { toast } = useToast();
  const [network, setNetwork] = useState<string>(NETWORK.MAINNET);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<string>('');
  
  // Default $LERF token data for fair launch
  const defaultTokenData = {
    token: {
      base64: "", // This would be the base64 of the $LERF logo
      name: "$LERF",
      symbol: "LERF",
      description: "A community-driven reward token powering the $LERF ecosystem with fair and transparent launch",
      website: "https://lerfhub.xyz",
      twitter: "https://twitter.com/lerftoken",
      discord: "https://discord.gg/lerftoken",
      telegram: "https://t.me/lerftoken"
    },
    tokenomics: {
      supply: 1_000_000_000,
      lpPercent: 40,
      fundersPercent: 40,
      allocations: [
        { name: "Marketing", percent: 10, destination: "" },
        { name: "Development", percent: 5, destination: "" },
        { name: "Team", percent: 5, destination: "" }
      ]
    },
    campaignDurationHours: 24,
    targetRaise: 30,
    amountIn: 5,
    creatorWalletAddress: "",
    network: NETWORK.MAINNET
  };

  const [formData, setFormData] = useState(defaultTokenData);
  const [activeTab, setActiveTab] = useState('token');

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      token: {
        ...prev.token,
        [name]: value
      }
    }));
  };

  const handleTokenomicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      tokenomics: {
        ...prev.tokenomics,
        [name]: name === 'supply' || name === 'lpPercent' || name === 'fundersPercent' 
          ? Number(value) 
          : value
      }
    }));
  };

  const handleAllocationChange = (index: number, field: keyof Allocation, value: string | number) => {
    setFormData(prev => {
      const newAllocations = [...prev.tokenomics.allocations];
      newAllocations[index] = {
        ...newAllocations[index],
        [field]: field === 'percent' ? Number(value) : value
      };
      
      return {
        ...prev,
        tokenomics: {
          ...prev.tokenomics,
          allocations: newAllocations
        }
      };
    });
  };

  const addAllocation = () => {
    setFormData(prev => ({
      ...prev,
      tokenomics: {
        ...prev.tokenomics,
        allocations: [
          ...prev.tokenomics.allocations,
          { name: "", percent: 0, destination: "" }
        ]
      }
    }));
  };

  const removeAllocation = (index: number) => {
    setFormData(prev => {
      const newAllocations = prev.tokenomics.allocations.filter((_, i) => i !== index);
      return {
        ...prev,
        tokenomics: {
          ...prev.tokenomics,
          allocations: newAllocations
        }
      };
    });
  };

  const handleLaunchParamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['campaignDurationHours', 'targetRaise', 'amountIn'].includes(name) 
        ? Number(value) 
        : value
    }));
  };

  const handleNetworkChange = (value: string) => {
    setNetwork(value);
    setFormData(prev => ({
      ...prev,
      network: value
    }));
  };

  const handleCreateFairLaunch = async () => {
    setIsLoading(true);
    
    try {
      // In a real application, you would get this from the user's connected wallet
      // For demonstration, we're generating a new keypair
      const creator = Keypair.generate();
      
      // Prepare payload according to SDK requirements
      const payload = {
        ...formData,
        network: network as NETWORK,
        creatorWalletAddress: formData.creatorWalletAddress || creator.publicKey.toString()
      };

      // Check if the SDK has the fairLaunch API
      if (!SDK.api?.fairLaunch?.createPool?.request) {
        throw new Error("Fair Launch API not available in the SDK");
      }

      const createRequest = await SDK.api.fairLaunch.createPool.request(payload);
      
      // Show the transaction
      setTransaction(createRequest.transaction);
      
      toast({
        title: "Fair Launch creation initiated",
        description: "Transaction prepared. Ready for signing.",
      });
      
      // Option to sign and confirm the transaction
      const handleSignAndConfirm = async () => {
        try {
          toast({
            title: "Signing transaction",
            description: "Please wait while the transaction is being processed...",
          });
          
          const response = await createRequest.signAndConfirm({ creator });
          
          toast({
            title: "Success!",
            description: "Fair Launch pool created successfully!",
            variant: "default",
          });
          
          console.log("✅ Fair Launch Pool Created!", response);
          
          return response;
        } catch (error) {
          console.error("Error signing transaction:", error);
          toast({
            title: "Error signing transaction",
            description: error instanceof Error ? error.message : "Unknown error occurred",
            variant: "destructive",
          });
          throw error;
        }
      };
      
      // Add the signAndConfirm function to the window for demonstration purposes
      (window as any).signAndConfirmFairLaunch = handleSignAndConfirm;
      
    } catch (error) {
      console.error("Error creating fair launch:", error);
      toast({
        title: "Error creating fair launch",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyTransaction = () => {
    if (transaction) {
      navigator.clipboard.writeText(transaction);
      toast({
        title: "Copied",
        description: "Transaction copied to clipboard",
      });
    }
  };

  return (
    <Card className="w-full bg-slerf-dark-light border-slerf-dark-lighter">
      <CardHeader>
        <CardTitle>Create $LERF Fair Launch</CardTitle>
        <CardDescription>Deploy your $LERF token with a fair and transparent launch process</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="token">Token Info</TabsTrigger>
            <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
            <TabsTrigger value="launch">Launch Settings</TabsTrigger>
          </TabsList>
          
          {/* Token Info Tab */}
          <TabsContent value="token" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.token.name}
                  onChange={handleTokenChange}
                  placeholder="Token Name"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={formData.token.symbol}
                  onChange={handleTokenChange}
                  placeholder="Token Symbol"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.token.description}
                onChange={handleTokenChange}
                placeholder="Token Description"
                className="bg-slerf-dark border-slerf-dark-lighter"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.token.website}
                  onChange={handleTokenChange}
                  placeholder="Website URL"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.token.twitter}
                  onChange={handleTokenChange}
                  placeholder="Twitter URL"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discord">Discord</Label>
                <Input
                  id="discord"
                  name="discord"
                  value={formData.token.discord}
                  onChange={handleTokenChange}
                  placeholder="Discord URL"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  name="telegram"
                  value={formData.token.telegram}
                  onChange={handleTokenChange}
                  placeholder="Telegram URL"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Tokenomics Tab */}
          <TabsContent value="tokenomics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supply">Total Supply</Label>
                <Input
                  id="supply"
                  name="supply"
                  type="number"
                  value={formData.tokenomics.supply}
                  onChange={handleTokenomicsChange}
                  min="1000"
                  placeholder="Token Supply"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lpPercent">Liquidity Pool %</Label>
                <Input
                  id="lpPercent"
                  name="lpPercent"
                  type="number"
                  value={formData.tokenomics.lpPercent}
                  onChange={handleTokenomicsChange}
                  min="0"
                  max="100"
                  placeholder="LP Percentage"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fundersPercent">Funders %</Label>
                <Input
                  id="fundersPercent"
                  name="fundersPercent"
                  type="number"
                  value={formData.tokenomics.fundersPercent}
                  onChange={handleTokenomicsChange}
                  min="0"
                  max="100"
                  placeholder="Funders Percentage"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Team & Other Allocations</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addAllocation}
                  className="flex items-center gap-1"
                >
                  <PlusCircle size={16} />
                  Add Allocation
                </Button>
              </div>
              
              {formData.tokenomics.allocations.map((allocation, index) => (
                <div key={index} className="grid grid-cols-7 gap-3 items-end">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`allocation-name-${index}`}>Name</Label>
                    <Input
                      id={`allocation-name-${index}`}
                      value={allocation.name}
                      onChange={(e) => handleAllocationChange(index, 'name', e.target.value)}
                      placeholder="Allocation Name"
                      className="bg-slerf-dark border-slerf-dark-lighter"
                    />
                  </div>
                  
                  <div className="col-span-1 space-y-2">
                    <Label htmlFor={`allocation-percent-${index}`}>%</Label>
                    <Input
                      id={`allocation-percent-${index}`}
                      type="number"
                      value={allocation.percent}
                      onChange={(e) => handleAllocationChange(index, 'percent', e.target.value)}
                      min="0"
                      max="100"
                      placeholder="Percent"
                      className="bg-slerf-dark border-slerf-dark-lighter"
                    />
                  </div>
                  
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={`allocation-destination-${index}`}>Wallet Address</Label>
                    <Input
                      id={`allocation-destination-${index}`}
                      value={allocation.destination}
                      onChange={(e) => handleAllocationChange(index, 'destination', e.target.value)}
                      placeholder="Destination Address"
                      className="bg-slerf-dark border-slerf-dark-lighter"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAllocation(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={formData.tokenomics.allocations.length <= 1}
                    >
                      <MinusCircle size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Launch Settings Tab */}
          <TabsContent value="launch" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaignDurationHours">Campaign Duration (Hours)</Label>
                <Input
                  id="campaignDurationHours"
                  name="campaignDurationHours"
                  type="number"
                  value={formData.campaignDurationHours}
                  onChange={handleLaunchParamsChange}
                  min="1"
                  placeholder="Campaign Duration"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetRaise">Target Raise (SOL)</Label>
                <Input
                  id="targetRaise"
                  name="targetRaise"
                  type="number"
                  value={formData.targetRaise}
                  onChange={handleLaunchParamsChange}
                  min="1"
                  placeholder="Target SOL to Raise"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amountIn">Initial Contribution (SOL)</Label>
                <Input
                  id="amountIn"
                  name="amountIn"
                  type="number"
                  value={formData.amountIn}
                  onChange={handleLaunchParamsChange}
                  min="0.1"
                  placeholder="Initial SOL Amount"
                  className="bg-slerf-dark border-slerf-dark-lighter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select value={network} onValueChange={handleNetworkChange}>
                  <SelectTrigger className="bg-slerf-dark border-slerf-dark-lighter">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NETWORK.MAINNET}>Mainnet</SelectItem>
                    <SelectItem value={NETWORK.DEVNET}>Devnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creatorWalletAddress">Creator Wallet Address (Optional)</Label>
              <Input
                id="creatorWalletAddress"
                name="creatorWalletAddress"
                value={formData.creatorWalletAddress}
                onChange={handleLaunchParamsChange}
                placeholder="Creator Wallet Address (leave empty to generate)"
                className="bg-slerf-dark border-slerf-dark-lighter"
              />
              <p className="text-xs text-gray-400">Leave empty to generate a new keypair for demonstration</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Transaction Display */}
        {transaction && (
          <div className="mt-6 p-4 bg-slerf-dark rounded-md">
            <div className="flex justify-between items-center mb-2">
              <Label>Transaction</Label>
              <Button variant="ghost" size="sm" onClick={copyTransaction}>
                Copy
              </Button>
            </div>
            <div className="font-mono text-xs break-all overflow-auto max-h-32 text-gray-300">
              {transaction}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-slerf-cyan text-slerf-dark hover:bg-slerf-cyan/90"
          onClick={handleCreateFairLaunch}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create $LERF Fair Launch'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FairLaunchCreator;