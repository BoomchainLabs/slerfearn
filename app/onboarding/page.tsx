'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  Globe, 
  Shield, 
  Users, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Gift,
  Zap,
  Twitter,
  MessageCircle,
  Github,
  Link,
  Coins
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  reward: number
  required: boolean
}

interface SocialConnection {
  platform: string
  connected: boolean
  username?: string
  reward: number
  icon: React.ReactNode
}

export default function OnboardingPage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [web4Identity, setWeb4Identity] = useState('')
  const [userPreferences, setUserPreferences] = useState({
    riskTolerance: 'medium',
    favoriteCategories: [] as string[],
    tradingExperience: 'beginner'
  })

  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([
    {
      platform: 'Twitter',
      connected: false,
      reward: 250000,
      icon: <Twitter className="w-5 h-5" />
    },
    {
      platform: 'Discord',
      connected: false,
      reward: 250000,
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      platform: 'GitHub',
      connected: false,
      reward: 200000,
      icon: <Github className="w-5 h-5" />
    },
    {
      platform: 'Telegram',
      connected: false,
      reward: 250000,
      icon: <MessageCircle className="w-5 h-5" />
    }
  ])

  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'wallet-connect',
      title: 'Connect Your Wallet',
      description: 'Choose from 50+ supported wallets for seamless Web3 access',
      icon: <Wallet className="w-6 h-6" />,
      completed: false,
      reward: 500000,
      required: true
    },
    {
      id: 'web4-identity',
      title: 'Create Web4 Identity',
      description: 'Set up decentralized identity with ENS or Unstoppable domains',
      icon: <Globe className="w-6 h-6" />,
      completed: false,
      reward: 1000000,
      required: false
    },
    {
      id: 'cross-chain-setup',
      title: 'Multi-Chain Setup',
      description: 'Enable trading across Ethereum, Base, Polygon, Solana, and BSC',
      icon: <Shield className="w-6 h-6" />,
      completed: false,
      reward: 750000,
      required: false
    },
    {
      id: 'social-verification',
      title: 'Social Verification',
      description: 'Link social accounts for community rewards and verification',
      icon: <Users className="w-6 h-6" />,
      completed: false,
      reward: 250000,
      required: false
    },
    {
      id: 'trading-preferences',
      title: 'Trading Preferences',
      description: 'Configure risk tolerance and favorite meme token categories',
      icon: <Settings className="w-6 h-6" />,
      completed: false,
      reward: 500000,
      required: false
    }
  ])

  const TOKEN_CATEGORIES = [
    'Popular Memes',
    'New Launches', 
    'Gaming Tokens',
    'Community Coins',
    'Utility Tokens',
    'Art & Collectibles'
  ]

  useEffect(() => {
    if (isConnected && address) {
      updateStepCompletion('wallet-connect', true)
    } else {
      updateStepCompletion('wallet-connect', false)
    }
  }, [isConnected, address])

  const updateStepCompletion = (stepId: string, completed: boolean) => {
    setOnboardingSteps(prev => prev.map(step => {
      if (step.id === stepId && step.completed !== completed) {
        if (completed) {
          setTotalRewards(prevRewards => prevRewards + step.reward)
          toast({
            title: "Step Completed!",
            description: `Earned ${(step.reward / 1000000).toFixed(1)}M $LERF tokens`,
          })
        } else {
          setTotalRewards(prevRewards => prevRewards - step.reward)
        }
        return { ...step, completed }
      }
      return step
    }))
  }

  const connectSocial = (platform: string) => {
    setSocialConnections(prev => prev.map(conn => {
      if (conn.platform === platform && !conn.connected) {
        setTotalRewards(prevRewards => prevRewards + conn.reward)
        toast({
          title: `${platform} Connected!`,
          description: `Earned ${(conn.reward / 1000000).toFixed(1)}M $LERF tokens`,
        })
        return { ...conn, connected: true, username: `user_${Math.random().toString(36).substr(2, 9)}` }
      }
      return conn
    }))

    const allConnected = socialConnections.every(conn => conn.connected || conn.platform === platform)
    if (allConnected) {
      updateStepCompletion('social-verification', true)
    }
  }

  const setupWeb4Identity = () => {
    if (web4Identity.trim()) {
      updateStepCompletion('web4-identity', true)
      toast({
        title: "Web4 Identity Created!",
        description: `Your decentralized identity ${web4Identity} is now active`,
      })
    }
  }

  const setupCrossChain = () => {
    updateStepCompletion('cross-chain-setup', true)
    toast({
      title: "Multi-Chain Setup Complete!",
      description: "You can now trade across all supported networks",
    })
  }

  const saveTradingPreferences = () => {
    updateStepCompletion('trading-preferences', true)
    toast({
      title: "Preferences Saved!",
      description: "Your trading setup is complete",
    })
  }

  const goToNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completedSteps = onboardingSteps.filter(step => step.completed).length
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep]

    switch (step.id) {
      case 'wallet-connect':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-300">Choose from multiple wallet options for secure Web3 access</p>
            </div>

            {!isConnected ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="h-16 bg-black/40 border border-cyan-500/30 hover:bg-cyan-500/10 text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">{connector.name}</div>
                        <div className="text-sm text-gray-400">Secure connection</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white">Wallet Connected!</h4>
                  <p className="text-gray-300">Address: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                </div>
                <Button onClick={goToNextStep} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                  Continue to Web4 Setup <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )

      case 'web4-identity':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Create Web4 Identity</h3>
              <p className="text-gray-300">Set up your decentralized identity for enhanced Web4 features</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">ENS Domain or Unstoppable Domain</Label>
                <Input
                  placeholder="yourname.eth or yourname.crypto"
                  value={web4Identity}
                  onChange={(e) => setWeb4Identity(e.target.value)}
                  className="bg-black/20 border-cyan-500/30 text-white"
                />
              </div>

              <Alert className="border-cyan-500/30 bg-cyan-500/10">
                <Globe className="h-4 w-4 text-cyan-400" />
                <AlertDescription className="text-cyan-300">
                  Web4 identity enables decentralized data storage, cross-platform authentication, and enhanced privacy features.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={setupWeb4Identity}
                  disabled={!web4Identity.trim()}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500"
                >
                  Create Identity
                </Button>
                <Button onClick={goToNextStep} variant="outline" className="border-gray-500/30 text-gray-300">
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        )

      case 'cross-chain-setup':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Multi-Chain Setup</h3>
              <p className="text-gray-300">Enable seamless trading across multiple blockchains</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Ethereum', status: 'Ready', color: 'text-blue-400' },
                { name: 'Base', status: 'Ready', color: 'text-purple-400' },
                { name: 'Polygon', status: 'Ready', color: 'text-purple-400' },
                { name: 'Solana', status: 'Ready', color: 'text-green-400' },
                { name: 'BSC', status: 'Ready', color: 'text-yellow-400' }
              ].map((network) => (
                <div key={network.name} className="p-4 rounded-lg bg-black/20 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-medium">{network.name}</span>
                    </div>
                    <Badge className={`${network.color} bg-transparent border`}>
                      {network.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={setupCrossChain} className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500">
                Enable All Networks
              </Button>
              <Button onClick={goToNextStep} variant="outline" className="border-gray-500/30 text-gray-300">
                Skip for Now
              </Button>
            </div>
          </div>
        )

      case 'social-verification':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Social Verification</h3>
              <p className="text-gray-300">Connect your social accounts for community rewards</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialConnections.map((connection) => (
                <div key={connection.platform} className="p-4 rounded-lg bg-black/20 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-cyan-400">{connection.icon}</div>
                      <div>
                        <div className="text-white font-medium">{connection.platform}</div>
                        <div className="text-sm text-gray-400">
                          {(connection.reward / 1000000).toFixed(1)}M $LERF reward
                        </div>
                      </div>
                    </div>
                    {connection.connected ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        Connected
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => connectSocial(connection.platform)}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500"
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={goToNextStep} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
              Continue to Preferences
            </Button>
          </div>
        )

      case 'trading-preferences':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Trading Preferences</h3>
              <p className="text-gray-300">Customize your trading experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Risk Tolerance</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['conservative', 'medium', 'aggressive'].map((risk) => (
                    <Button
                      key={risk}
                      variant={userPreferences.riskTolerance === risk ? "default" : "outline"}
                      onClick={() => setUserPreferences(prev => ({ ...prev, riskTolerance: risk }))}
                      className={userPreferences.riskTolerance === risk 
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500" 
                        : "border-gray-500/30 text-gray-300"
                      }
                    >
                      {risk.charAt(0).toUpperCase() + risk.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Favorite Token Categories</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {TOKEN_CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={userPreferences.favoriteCategories.includes(category) ? "default" : "outline"}
                      onClick={() => {
                        setUserPreferences(prev => ({
                          ...prev,
                          favoriteCategories: prev.favoriteCategories.includes(category)
                            ? prev.favoriteCategories.filter(c => c !== category)
                            : [...prev.favoriteCategories, category]
                        }))
                      }}
                      className={userPreferences.favoriteCategories.includes(category)
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500" 
                        : "border-gray-500/30 text-gray-300"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={saveTradingPreferences} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
              Complete Setup
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Web3/Web4 Onboarding
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete your setup to unlock the full power of cross-chain meme token trading
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Onboarding Progress</h3>
                  <p className="text-gray-300">{completedSteps} of {onboardingSteps.length} steps completed</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <Coins className="w-5 h-5" />
                    <span className="text-xl font-bold">{(totalRewards / 1000000).toFixed(1)}M</span>
                  </div>
                  <p className="text-sm text-gray-400">$LERF Earned</p>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-700" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 overflow-x-auto pb-2"
        >
          {onboardingSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                index === currentStep
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : step.completed
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-black/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {step.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <div className={`w-4 h-4 ${index === currentStep ? 'text-cyan-400' : 'text-gray-400'}`}>
                  {step.icon}
                </div>
              )}
              <span className="hidden md:inline">{step.title}</span>
            </button>
          ))}
        </motion.div>

        {/* Current Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20">
              <CardContent className="p-8">
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between"
        >
          <Button
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            variant="outline"
            className="border-gray-500/30 text-gray-300"
          >
            Previous
          </Button>
          
          {completedSteps === onboardingSteps.length ? (
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Star className="w-4 h-4 mr-2" />
              Enter Marketplace
            </Button>
          ) : (
            <Button
              onClick={goToNextStep}
              disabled={currentStep === onboardingSteps.length - 1}
              className="bg-gradient-to-r from-cyan-500 to-purple-500"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  )
}