import React, { useState } from 'react';
import { NETWORK } from "@gofundmeme/sdk";
import * as gfmSDK from "@gofundmeme/sdk";
import { Keypair } from "@solana/web3.js";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TokenCreator: React.FC = () => {
  const { toast } = useToast();
  // Check if NETWORK is available as expected in SDK v1.0.3
  // If not, define our own fallback
  const NETWORK_VALUES = {
    MAINNET: gfmSDK.NETWORK?.MAINNET || "mainnet",
    DEVNET: gfmSDK.NETWORK?.DEVNET || "devnet"
  };
  
  const [network, setNetwork] = useState<string>(NETWORK_VALUES.MAINNET);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<string>('');
  const [sdkError, setSdkError] = useState<string | null>(null);
  
  // $LERF token data
  const defaultTokenData = {
    base64: "", // This would be the base64 of the $LERF logo
    name: "$LERF",
    symbol: "LERF",
    description: "A community-driven reward token powering the $LERF ecosystem",
    website: "https://lerfhub.xyz",
    twitter: "https://twitter.com/lerftoken",
    discord: "https://discord.gg/lerftoken",
    telegram: "https://t.me/lerftoken",
    amountIn: 5,
    supply: 1_000_000_000,
    creatorWalletAddress: ""
  };

  const [formData, setFormData] = useState(defaultTokenData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amountIn' || name === 'supply' ? Number(value) : value
    }));
  };

  const handleNetworkChange = (value: string) => {
    setNetwork(value);
  };

  const handleCreateToken = async () => {
    setIsLoading(true);
    setSdkError(null);
    
    try {
      // In a real application, you would get this from the user's connected wallet
      // For demonstration, we're generating a new keypair
      const creator = Keypair.generate();
      
      const payload = {
        token: {
          base64: formData.base64 || "BASE64_PLACEHOLDER", // You would use actual base64 image data
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          website: formData.website,
          twitter: formData.twitter,
          discord: formData.discord,
          telegram: formData.telegram
        },
        amountIn: formData.amountIn,
        network: network, // Let the SDK handle the network value internally
        creatorWalletAddress: formData.creatorWalletAddress || creator.publicKey.toString(),
        supply: formData.supply
      };

      // Check if the required API methods exist
      if (!gfmSDK.api?.bondingCurve?.createPool?.request) {
        throw new Error("The GoFundMeme SDK version installed is not compatible with this application.");
      }

      const createRequest = await gfmSDK.api.bondingCurve.createPool.request(payload);
      
      // Show the transaction first
      setTransaction(createRequest.transaction);
      
      toast({
        title: "Token creation initiated",
        description: "Transaction prepared. Ready for signing.",
      });
      
      // Option to sign and confirm the transaction
      const handleSignAndConfirm = async () => {
        try {
          toast({
            title: "Signing transaction",
            description: "Please wait while the transaction is being processed...",
          });
          
          // Check if signAndConfirm method exists
          if (typeof createRequest.signAndConfirm !== 'function') {
            throw new Error("The SDK version doesn't support direct transaction signing.");
          }
          
          const response = await createRequest.signAndConfirm({ creator });
          
          toast({
            title: "Success!",
            description: "Pool created successfully!",
            variant: "default",
          });
          
          console.log("✅ Pool Created!", response);
          
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
      // In a real application, you would call this directly or handle it through your wallet provider
      (window as any).signAndConfirmTransaction = handleSignAndConfirm;
      
    } catch (error) {
      console.error("Error creating token:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setSdkError(errorMessage);
      toast({
        title: "Error creating token",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyTransaction = () => {
    navigator.clipboard.writeText(transaction);
    toast({
      title: "Copied",
      description: "Transaction copied to clipboard",
    });
  };

  return (
    <Card className="w-full bg-slerf-dark-light border-slerf-dark-lighter">
      <CardHeader>
        <CardTitle>Create $LERF Token</CardTitle>
        <CardDescription>Deploy your $LERF token on Solana using GoFundMeme SDK</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Token Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Token Name"
              className="bg-slerf-dark border-slerf-dark-lighter"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symbol">Token Symbol</Label>
            <Input
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
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
            value={formData.description}
            onChange={handleChange}
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
              value={formData.website}
              onChange={handleChange}
              placeholder="Website URL"
              className="bg-slerf-dark border-slerf-dark-lighter"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
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
              value={formData.discord}
              onChange={handleChange}
              placeholder="Discord URL"
              className="bg-slerf-dark border-slerf-dark-lighter"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              placeholder="Telegram URL"
              className="bg-slerf-dark border-slerf-dark-lighter"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amountIn">Initial SOL</Label>
            <Input
              id="amountIn"
              name="amountIn"
              type="number"
              value={formData.amountIn}
              onChange={handleChange}
              min="1"
              placeholder="Initial SOL"
              className="bg-slerf-dark border-slerf-dark-lighter"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supply">Total Supply</Label>
            <Input
              id="supply"
              name="supply"
              type="number"
              value={formData.supply}
              onChange={handleChange}
              min="1000"
              placeholder="Token Supply"
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
          onClick={handleCreateToken}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create $LERF Token'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TokenCreator;