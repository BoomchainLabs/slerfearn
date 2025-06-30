'use client'

import { useState, useEffect } from 'react'
import { useAccount, useNetwork, useSwitchNetwork, useWalletClient } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { 
  Rocket, 
  Coins, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Copy,
  ExternalLink,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TokenConfig {
  name: string
  symbol: string
  totalSupply: string
  decimals: number
  description: string
  website: string
  telegram: string
  twitter: string
  logoUrl: string
  initialLiquidity: string
  network: string
  features: {
    mintable: boolean
    burnable: boolean
    pausable: boolean
    upgradeable: boolean
    antiWhale: boolean
    reflections: boolean
  }
}

interface DeploymentStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  txHash?: string
  contractAddress?: string
}

const SUPPORTED_NETWORKS = [
  {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    symbol: 'ETH',
    explorerUrl: 'https://basescan.org',
    cost: '0.002 ETH (~$5)',
    recommended: true
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io',
    cost: '0.05 ETH (~$120)',
    recommended: false
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    symbol: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    cost: '2 MATIC (~$2)',
    recommended: true
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    chainId: 56,
    symbol: 'BNB',
    explorerUrl: 'https://bscscan.com',
    cost: '0.01 BNB (~$4)',
    recommended: true
  }
]

export default function TokenDeployerPage() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { data: walletClient } = useWalletClient()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('config')
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployedContract, setDeployedContract] = useState<string | null>(null)

  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    name: '',
    symbol: '',
    totalSupply: '1000000000',
    decimals: 18,
    description: '',
    website: '',
    telegram: '',
    twitter: '',
    logoUrl: '',
    initialLiquidity: '1',
    network: 'base',
    features: {
      mintable: false,
      burnable: true,
      pausable: false,
      upgradeable: false,
      antiWhale: true,
      reflections: false
    }
  })

  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: 'validate',
      title: 'Validate Configuration',
      description: 'Checking token parameters and network settings',
      status: 'pending'
    },
    {
      id: 'compile',
      title: 'Compile Smart Contract',
      description: 'Generating optimized contract bytecode',
      status: 'pending'
    },
    {
      id: 'deploy',
      title: 'Deploy to Blockchain',
      description: 'Broadcasting transaction to selected network',
      status: 'pending'
    },
    {
      id: 'verify',
      title: 'Verify Contract',
      description: 'Publishing source code to block explorer',
      status: 'pending'
    },
    {
      id: 'liquidity',
      title: 'Add Initial Liquidity',
      description: 'Creating trading pair on DEX',
      status: 'pending'
    },
    {
      id: 'register',
      title: 'Register on Marketplace',
      description: 'Listing token in cross-chain marketplace',
      status: 'pending'
    }
  ])

  const updateTokenConfig = (field: keyof TokenConfig, value: any) => {
    setTokenConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateFeature = (feature: keyof TokenConfig['features'], enabled: boolean) => {
    setTokenConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: enabled
      }
    }))
  }

  const validateConfig = () => {
    const errors = []
    if (!tokenConfig.name.trim()) errors.push('Token name is required')
    if (!tokenConfig.symbol.trim()) errors.push('Token symbol is required')
    if (!tokenConfig.totalSupply || Number(tokenConfig.totalSupply) <= 0) errors.push('Valid total supply is required')
    if (tokenConfig.symbol.length > 10) errors.push('Symbol should be 10 characters or less')
    return errors
  }

  const deployToken = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deploy tokens",
        variant: "destructive"
      })
      return
    }

    const errors = validateConfig()
    if (errors.length > 0) {
      toast({
        title: "Configuration Invalid",
        description: errors.join(', '),
        variant: "destructive"
      })
      return
    }

    setIsDeploying(true)
    setDeploymentProgress(0)

    try {
      // Step 1: Validate
      await updateStepStatus('validate', 'processing')
      await new Promise(resolve => setTimeout(resolve, 1500))
      await updateStepStatus('validate', 'completed')
      setDeploymentProgress(16)

      // Step 2: Compile
      await updateStepStatus('compile', 'processing')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await updateStepStatus('compile', 'completed')
      setDeploymentProgress(32)

      // Step 3: Deploy
      await updateStepStatus('deploy', 'processing')
      
      // Simulate contract deployment
      const mockContractAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      await updateStepStatus('deploy', 'completed', mockTxHash, mockContractAddress)
      setDeployedContract(mockContractAddress)
      setDeploymentProgress(48)

      // Step 4: Verify
      await updateStepStatus('verify', 'processing')
      await new Promise(resolve => setTimeout(resolve, 2500))
      await updateStepStatus('verify', 'completed')
      setDeploymentProgress(64)

      // Step 5: Liquidity
      await updateStepStatus('liquidity', 'processing')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await updateStepStatus('liquidity', 'completed')
      setDeploymentProgress(80)

      // Step 6: Register
      await updateStepStatus('register', 'processing')
      await new Promise(resolve => setTimeout(resolve, 1500))
      await updateStepStatus('register', 'completed')
      setDeploymentProgress(100)

      toast({
        title: "Token Deployed Successfully!",
        description: `${tokenConfig.symbol} is now live on ${SUPPORTED_NETWORKS.find(n => n.id === tokenConfig.network)?.name}`,
      })

      setActiveTab('success')

    } catch (error) {
      console.error('Deployment failed:', error)
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying your token. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const updateStepStatus = async (
    stepId: string, 
    status: DeploymentStep['status'], 
    txHash?: string, 
    contractAddress?: string
  ) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, txHash, contractAddress }
        : step
    ))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Address copied successfully"
    })
  }

  const selectedNetwork = SUPPORTED_NETWORKS.find(n => n.id === tokenConfig.network)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Boomchain Token Deployer
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Deploy professional meme tokens across multiple blockchains with advanced Web3/Web4 features
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-md border-cyan-500/20">
              <TabsTrigger value="config" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                Configuration
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                Features
              </TabsTrigger>
              <TabsTrigger value="deploy" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                Deploy
              </TabsTrigger>
              <TabsTrigger value="success" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300" disabled={!deployedContract}>
                Success
              </TabsTrigger>
            </TabsList>

            {/* Configuration Tab */}
            <TabsContent value="config" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Coins className="w-5 h-5 text-cyan-400" />
                      Token Details
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Configure your token's basic information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Token Name</Label>
                        <Input
                          placeholder="e.g., Slerf Token"
                          value={tokenConfig.name}
                          onChange={(e) => updateTokenConfig('name', e.target.value)}
                          className="bg-black/20 border-cyan-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Symbol</Label>
                        <Input
                          placeholder="e.g., LERF"
                          value={tokenConfig.symbol}
                          onChange={(e) => updateTokenConfig('symbol', e.target.value.toUpperCase())}
                          className="bg-black/20 border-cyan-500/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Total Supply</Label>
                        <Input
                          type="number"
                          placeholder="1000000000"
                          value={tokenConfig.totalSupply}
                          onChange={(e) => updateTokenConfig('totalSupply', e.target.value)}
                          className="bg-black/20 border-cyan-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Decimals</Label>
                        <Select value={tokenConfig.decimals.toString()} onValueChange={(value) => updateTokenConfig('decimals', parseInt(value))}>
                          <SelectTrigger className="bg-black/20 border-cyan-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 backdrop-blur-md border-cyan-500/20">
                            <SelectItem value="18">18 (Standard)</SelectItem>
                            <SelectItem value="9">9 (Like SOL)</SelectItem>
                            <SelectItem value="6">6 (Like USDC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        placeholder="Describe your token's purpose and utility..."
                        value={tokenConfig.description}
                        onChange={(e) => updateTokenConfig('description', e.target.value)}
                        className="bg-black/20 border-cyan-500/30 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      Network & Social
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Choose deployment network and social links
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Deployment Network</Label>
                      <Select value={tokenConfig.network} onValueChange={(value) => updateTokenConfig('network', value)}>
                        <SelectTrigger className="bg-black/20 border-cyan-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-md border-cyan-500/20">
                          {SUPPORTED_NETWORKS.map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{network.name}</span>
                                {network.recommended && (
                                  <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/30">
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedNetwork && (
                        <p className="text-sm text-gray-400 mt-1">
                          Deployment cost: {selectedNetwork.cost}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-gray-300">Website URL</Label>
                      <Input
                        placeholder="https://yourtoken.com"
                        value={tokenConfig.website}
                        onChange={(e) => updateTokenConfig('website', e.target.value)}
                        className="bg-black/20 border-cyan-500/30 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Telegram</Label>
                        <Input
                          placeholder="@yourtoken"
                          value={tokenConfig.telegram}
                          onChange={(e) => updateTokenConfig('telegram', e.target.value)}
                          className="bg-black/20 border-cyan-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Twitter</Label>
                        <Input
                          placeholder="@yourtoken"
                          value={tokenConfig.twitter}
                          onChange={(e) => updateTokenConfig('twitter', e.target.value)}
                          className="bg-black/20 border-cyan-500/30 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Initial Liquidity (ETH/BNB/MATIC)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="1.0"
                        value={tokenConfig.initialLiquidity}
                        onChange={(e) => updateTokenConfig('initialLiquidity', e.target.value)}
                        className="bg-black/20 border-cyan-500/30 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    Advanced Features
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Enable advanced smart contract features for your token
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(tokenConfig.features).map(([feature, enabled]) => {
                      const featureInfo = {
                        mintable: {
                          title: 'Mintable',
                          description: 'Allow creating new tokens after deployment',
                          icon: <Coins className="w-5 h-5" />
                        },
                        burnable: {
                          title: 'Burnable',
                          description: 'Allow permanent token destruction',
                          icon: <Zap className="w-5 h-5" />
                        },
                        pausable: {
                          title: 'Pausable',
                          description: 'Emergency pause all token transfers',
                          icon: <Shield className="w-5 h-5" />
                        },
                        upgradeable: {
                          title: 'Upgradeable',
                          description: 'Allow contract logic updates',
                          icon: <Upload className="w-5 h-5" />
                        },
                        antiWhale: {
                          title: 'Anti-Whale Protection',
                          description: 'Limit maximum transaction amounts',
                          icon: <Users className="w-5 h-5" />
                        },
                        reflections: {
                          title: 'Reflection Rewards',
                          description: 'Distribute transaction fees to holders',
                          icon: <TrendingUp className="w-5 h-5" />
                        }
                      }[feature]

                      return (
                        <div
                          key={feature}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            enabled 
                              ? 'bg-cyan-500/10 border-cyan-500/30' 
                              : 'bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20'
                          }`}
                          onClick={() => updateFeature(feature as keyof TokenConfig['features'], !enabled)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${enabled ? 'text-cyan-400' : 'text-gray-400'}`}>
                              {featureInfo?.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-semibold ${enabled ? 'text-cyan-300' : 'text-gray-300'}`}>
                                  {featureInfo?.title}
                                </h3>
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  enabled 
                                    ? 'bg-cyan-500 border-cyan-500' 
                                    : 'border-gray-400'
                                }`}>
                                  {enabled && <CheckCircle className="w-3 h-3 text-white m-0.5" />}
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {featureInfo?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deploy Tab */}
            <TabsContent value="deploy" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-cyan-400" />
                      Deployment Progress
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Track your token deployment status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Overall Progress</span>
                        <span className="text-cyan-300">{deploymentProgress}%</span>
                      </div>
                      <Progress value={deploymentProgress} className="bg-gray-700" />
                    </div>

                    <div className="space-y-3">
                      {deploymentSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-500' :
                            step.status === 'processing' ? 'bg-yellow-500' :
                            step.status === 'failed' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : step.status === 'processing' ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : step.status === 'failed' ? (
                              <AlertCircle className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-white text-xs">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{step.title}</p>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                            {step.txHash && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">TX:</span>
                                <span className="text-xs text-cyan-300 font-mono">
                                  {step.txHash.slice(0, 10)}...{step.txHash.slice(-8)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0"
                                  onClick={() => copyToClipboard(step.txHash!)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Deployment Summary</CardTitle>
                    <CardDescription className="text-gray-300">
                      Review your configuration before deploying
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Token Name:</span>
                        <span className="text-white">{tokenConfig.name || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Symbol:</span>
                        <span className="text-white">{tokenConfig.symbol || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Supply:</span>
                        <span className="text-white">{Number(tokenConfig.totalSupply || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network:</span>
                        <span className="text-white">{selectedNetwork?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deployment Cost:</span>
                        <span className="text-white">{selectedNetwork?.cost}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-4">
                        Enabled Features: {Object.entries(tokenConfig.features)
                          .filter(([_, enabled]) => enabled)
                          .map(([feature, _]) => feature.charAt(0).toUpperCase() + feature.slice(1))
                          .join(', ') || 'None'}
                      </p>

                      {!isConnected ? (
                        <Alert className="border-yellow-500/30 bg-yellow-500/10">
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                          <AlertDescription className="text-yellow-300">
                            Please connect your wallet to deploy tokens
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Button
                          onClick={deployToken}
                          disabled={isDeploying || validateConfig().length > 0}
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                        >
                          {isDeploying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Deploying...
                            </>
                          ) : (
                            <>
                              <Rocket className="w-4 h-4 mr-2" />
                              Deploy Token
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Success Tab */}
            <TabsContent value="success" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-md border-green-500/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-white flex items-center justify-center gap-2 text-2xl">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    Token Deployed Successfully!
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Your {tokenConfig.symbol} token is now live on {selectedNetwork?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {deployedContract && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-green-300 font-medium">Contract Address:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm">{deployedContract}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(deployedContract)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(`${selectedNetwork?.explorerUrl}/address/${deployedContract}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                      Add to Wallet
                    </Button>
                    <Button variant="outline" className="border-cyan-500/30 text-cyan-300">
                      View on Explorer
                    </Button>
                    <Button variant="outline" className="border-purple-500/30 text-purple-300">
                      Share on Social
                    </Button>
                  </div>

                  <Alert className="border-cyan-500/30 bg-cyan-500/10">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    <AlertDescription className="text-cyan-300">
                      Your token has been automatically registered in our cross-chain marketplace and is ready for trading!
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}