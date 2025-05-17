import React, { useState } from 'react';
import { Link } from 'wouter';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import slerfLogo from '@/assets/slerf-logo.svg';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import GitBookDocs from '@/components/GitBookDocs';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { wallet, connectWallet } = useWallet();
  const { toast } = useToast();

  const handleWalletConnect = () => {
    if (!wallet) {
      connectWallet();
    } else {
      toast({
        title: "Wallet Connected",
        description: "Your wallet is already connected to SlerfHub"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slerf-dark">
      
      <motion.div 
        className="container mx-auto px-4 py-24"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex flex-col items-center mb-10">
          <img src={slerfLogo} alt="SLERF Logo" className="w-20 h-20 mb-4" />
          <h1 className="text-4xl md:text-5xl font-space font-bold text-center mb-4">
            SlerfHub <span className="text-slerf-cyan">Documentation</span>
          </h1>
          <p className="text-lg text-center text-gray-300 max-w-3xl">
            Complete guide to the SlerfHub ecosystem, tokenomics, roadmap, and community features
          </p>
        </div>
        
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-5xl mx-auto glass p-6 rounded-xl"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tokenomics" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
              Tokenomics
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
              Community
            </TabsTrigger>
            <TabsTrigger value="contract" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
              Contract
            </TabsTrigger>
            <TabsTrigger value="gitbook" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
              GitBook
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div 
              className="glass-dark p-6 rounded-lg"
              variants={staggerItems}
              initial="hidden"
              animate={activeTab === 'overview' ? 'visible' : 'hidden'}
            >
              <motion.div variants={itemFadeIn}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> What is SlerfHub?
                </h2>
                <p className="text-gray-300 mb-4">
                  SlerfHub is a decentralized reward platform where users earn $SLERF tokens through completing missions, participating in quests, staking tokens, and playing games. It combines gamification, social elements, and DeFi principles to create a comprehensive Web3 ecosystem that rewards engagement and loyalty.
                </p>
                <p className="text-gray-300 mb-4">
                  The platform is built on the Ethereum blockchain with the $SLERF token at its core, providing utility across all platform features and serving as the primary medium of exchange within the ecosystem.
                </p>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-slerf-purple mb-2">Daily Missions</h3>
                    <p className="text-gray-300">Complete tasks to earn $SLERF tokens. Missions reset daily and range from simple to complex activities.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-slerf-purple mb-2">Weekly Quests</h3>
                    <p className="text-gray-300">More complex, multi-step challenges that provide larger token rewards and special bonuses.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-slerf-purple mb-2">Staking Vaults</h3>
                    <p className="text-gray-300">Lock your $SLERF tokens to earn passive income with different APY rates based on lock duration.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-slerf-purple mb-2">Blockchain Games</h3>
                    <p className="text-gray-300">Fun mini-games and challenges where players can stake tokens and earn rewards based on performance.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-slerf-purple mb-2">NFT Boosters</h3>
                    <p className="text-gray-300">Special collectibles that enhance rewards, provide special abilities, and unlock exclusive content.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-slerf-purple mb-2">Referral System</h3>
                    <p className="text-gray-300">Invite friends to earn a percentage of their rewards, enhancing community growth and engagement.</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Getting Started
                </h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="bg-slerf-purple rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-lg font-medium">Connect Your Wallet</h3>
                      <p className="text-gray-300">Use MetaMask, WalletConnect, or other compatible wallets to connect to SlerfHub.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-slerf-purple rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-lg font-medium">Complete Your Profile</h3>
                      <p className="text-gray-300">Set up your username, link social accounts, and customize your profile settings.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-slerf-purple rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-lg font-medium">Start Earning</h3>
                      <p className="text-gray-300">Complete daily missions, join quests, stake tokens, or play games to start accumulating $SLERF tokens.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-slerf-purple rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-lg font-medium">Explore Features</h3>
                      <p className="text-gray-300">Discover NFT boosters, staking vaults, and other platform features to maximize your earnings.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Tokenomics Tab */}
          <TabsContent value="tokenomics" className="space-y-6">
            <motion.div 
              className="glass-dark p-6 rounded-lg"
              variants={staggerItems}
              initial="hidden"
              animate={activeTab === 'tokenomics' ? 'visible' : 'hidden'}
            >
              <motion.div variants={itemFadeIn}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> $SLERF Token Overview
                </h2>
                <p className="text-gray-300 mb-4">
                  The $SLERF token (ERC-20) is the native utility token that powers the entire SlerfHub ecosystem. It serves multiple purposes including rewards, governance, staking, and as a medium of exchange within the platform.
                </p>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                  <div className="glass p-4 rounded-lg flex-1 text-center">
                    <h3 className="text-xl font-medium text-slerf-cyan mb-2">Total Supply</h3>
                    <p className="text-3xl font-bold">100,000,000</p>
                    <p className="text-gray-400">$SLERF Tokens</p>
                  </div>
                  <div className="glass p-4 rounded-lg flex-1 text-center">
                    <h3 className="text-xl font-medium text-slerf-cyan mb-2">Initial Price</h3>
                    <p className="text-3xl font-bold">$0.00025</p>
                    <p className="text-gray-400">USD per $SLERF</p>
                  </div>
                  <div className="glass p-4 rounded-lg flex-1 text-center">
                    <h3 className="text-xl font-medium text-slerf-cyan mb-2">Contract</h3>
                    <p className="text-sm font-mono bg-slerf-dark-light p-2 rounded">0x233df63325933fa3f2dac8e695cd84bb2f91ab07</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Token Allocation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="glass-dark p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Community Rewards & Ecosystem</span>
                        <span className="text-slerf-cyan">45%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-2.5">
                        <div className="bg-slerf-cyan h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="glass-dark p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Team & Advisors</span>
                        <span className="text-slerf-purple">15%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-2.5">
                        <div className="bg-slerf-purple h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="glass-dark p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Liquidity Provision</span>
                        <span className="text-slerf-orange">10%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-2.5">
                        <div className="bg-slerf-orange h-2.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    <div className="glass-dark p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Marketing & Partnerships</span>
                        <span className="text-green-500">12%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                    <div className="glass-dark p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Development Fund</span>
                        <span className="text-yellow-500">18%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-3">Vesting Schedule</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Community Rewards (45%)</p>
                        <p className="text-gray-300 text-sm">Released gradually over 5 years through quests, missions, staking rewards, and games.</p>
                      </div>
                      <div>
                        <p className="font-medium">Team & Advisors (15%)</p>
                        <p className="text-gray-300 text-sm">1-year cliff, then linear vesting over 3 years.</p>
                      </div>
                      <div>
                        <p className="font-medium">Liquidity Provision (10%)</p>
                        <p className="text-gray-300 text-sm">70% deployed at launch, 30% reserved for future DEX/CEX listings.</p>
                      </div>
                      <div>
                        <p className="font-medium">Marketing & Partnerships (12%)</p>
                        <p className="text-gray-300 text-sm">Released quarterly over 3 years for campaigns and strategic alliances.</p>
                      </div>
                      <div>
                        <p className="font-medium">Development Fund (18%)</p>
                        <p className="text-gray-300 text-sm">2-year lockup, then released quarterly over 3 years for continued platform development.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Token Utility
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Platform Rewards</h3>
                    <p className="text-gray-300">Earned through completing missions, quests, and games.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Staking</h3>
                    <p className="text-gray-300">Lock tokens to earn passive income through staking vaults.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Governance</h3>
                    <p className="text-gray-300">Vote on platform proposals and future development.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">NFT Purchases</h3>
                    <p className="text-gray-300">Buy NFT boosters and collectibles in the marketplace.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Game Entries</h3>
                    <p className="text-gray-300">Stake tokens to participate in premium games.</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Fee Discounts</h3>
                    <p className="text-gray-300">Reduced platform fees for token holders.</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Advanced Engagement Features
                </h2>
                <div className="glass p-4 rounded-lg mb-6">
                  <h3 className="text-xl font-medium mb-3">Automated Micro-Tasks & Rewards Loop</h3>
                  <p className="text-gray-300 mb-4">
                    SlerfHub implements a continuous engagement system that incentivizes frequent platform interactions:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-slerf-cyan mr-2">•</span>
                      <span>5-minute cooldown faucet for claiming small token rewards</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slerf-cyan mr-2">•</span>
                      <span>Auto-staking and auto-compounding smart contracts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slerf-cyan mr-2">•</span>
                      <span>Quick "spin the wheel" mini-games with token prizes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slerf-cyan mr-2">•</span>
                      <span>Real-time challenges with tiered reward multipliers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="glass p-4 rounded-lg">
                  <h3 className="text-xl font-medium mb-3">Token Value & Sustainability Mechanisms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Deflationary Model</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>5% of marketplace transaction fees are burned</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>2% of staking rewards are burned</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>Quarterly burns based on platform metrics</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>Special burn events tied to milestones</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Transaction Volume Drivers</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>On-chain activity farming with safeguards</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>Hourly/daily resetting leaderboards</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>Dynamic reward multipliers for engagement</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-slerf-cyan mr-2">•</span>
                          <span>Integration with external DeFi ecosystems</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <motion.div 
              className="glass-dark p-6 rounded-lg"
              variants={staggerItems}
              initial="hidden"
              animate={activeTab === 'roadmap' ? 'visible' : 'hidden'}
            >
              <motion.div variants={itemFadeIn}>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> SlerfHub Development Roadmap
                </h2>
                
                <div className="relative">
                  {/* Phase 1 - Q1-Q2 2025 */}
                  <div className="mb-12 md:mb-0 md:grid md:grid-cols-5 md:gap-4">
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slerf-purple flex items-center justify-center">
                        <span className="text-white">1</span>
                      </div>
                      <div className="h-full w-0.5 bg-gradient-to-b from-slerf-purple to-transparent hidden md:block"></div>
                    </div>
                    <div className="col-span-4 glass p-4 rounded-lg md:ml-0 ml-10 mb-10">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-slerf-purple">Phase 1: Foundation</h3>
                        <span className="ml-auto text-sm bg-slerf-purple/20 text-slerf-purple px-2 py-0.5 rounded">Q1-Q2 2025</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">✓</div>
                          <p>Platform launch with core features (daily missions, quests, token staking)</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">✓</div>
                          <p>$SLERF token deployment and initial liquidity provision</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">✓</div>
                          <p>Basic mini-games implementation (Spin Wheel, Card Matching)</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">✓</div>
                          <p>Initial NFT boosters collection (Genesis Series)</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">➔</div>
                          <p>Web app optimization for mobile devices</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phase 2 - Q3-Q4 2025 */}
                  <div className="mb-12 md:mb-0 md:grid md:grid-cols-5 md:gap-4">
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slerf-cyan flex items-center justify-center">
                        <span className="text-slerf-dark">2</span>
                      </div>
                      <div className="h-full w-0.5 bg-gradient-to-b from-slerf-cyan to-transparent hidden md:block"></div>
                    </div>
                    <div className="col-span-4 glass p-4 rounded-lg md:ml-0 ml-10 mb-10">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-slerf-cyan">Phase 2: Expansion</h3>
                        <span className="ml-auto text-sm bg-slerf-cyan/20 text-slerf-cyan px-2 py-0.5 rounded">Q3-Q4 2025</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">➔</div>
                          <p>Advanced blockchain games with competitive leaderboards</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">➔</div>
                          <p>Social features integration (guilds, team quests, chat)</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">➔</div>
                          <p>Automated micro-tasks with 5-minute cooldown rewards system</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">➔</div>
                          <p>Mobile app beta release (iOS & Android)</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">➔</div>
                          <p>Auto-staking smart contracts with compounding rewards</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Governance portal for community voting</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phase 3 - Q1-Q2 2026 */}
                  <div className="mb-12 md:mb-0 md:grid md:grid-cols-5 md:gap-4">
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slerf-orange flex items-center justify-center">
                        <span className="text-slerf-dark">3</span>
                      </div>
                      <div className="h-full w-0.5 bg-gradient-to-b from-slerf-orange to-transparent hidden md:block"></div>
                    </div>
                    <div className="col-span-4 glass p-4 rounded-lg md:ml-0 ml-10 mb-10">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-slerf-orange">Phase 3: Integration</h3>
                        <span className="ml-auto text-sm bg-slerf-orange/20 text-slerf-orange px-2 py-0.5 rounded">Q1-Q2 2026</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Cross-chain integration (Solana, BSC)</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Mobile app full release with exclusive mobile features</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>On-chain activity farming with rate-limiting and safeguards</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Real-time challenges with tiered reward multipliers</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Integration with major Web3 game ecosystems</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Advanced analytics dashboard for users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phase 4 - Q3-Q4 2026 */}
                  <div className="md:grid md:grid-cols-5 md:gap-4">
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white">4</span>
                      </div>
                    </div>
                    <div className="col-span-4 glass p-4 rounded-lg md:ml-0 ml-10">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-purple-500">Phase 4: Ecosystem</h3>
                        <span className="ml-auto text-sm bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded">Q3-Q4 2026</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>SlerfHub SDK for third-party developer integration</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Integration with DeFi protocols for expanded utility</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Metaverse integration and virtual hub space</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Enterprise partnerships program</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Layer 2 solution for improved scalability</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-slerf-dark-light flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">⌛</div>
                          <p>Advanced monitoring & analytics for transaction patterns</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <motion.div 
              className="glass-dark p-6 rounded-lg"
              variants={staggerItems}
              initial="hidden"
              animate={activeTab === 'community' ? 'visible' : 'hidden'}
            >
              <motion.div variants={itemFadeIn}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Community Overview
                </h2>
                <p className="text-gray-300 mb-6">
                  The SlerfHub community is the heart of our ecosystem. We're building a vibrant, engaged network of users who collaborate, compete, and earn together. Our community-first approach ensures that every feature and update is designed with user feedback in mind.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="glass p-5 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 text-slerf-purple">Community Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        <div>
                          <h4 className="font-medium">Twitter</h4>
                          <a href="https://twitter.com/slerf00" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">@slerf00</a>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4878 0-.1634-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                        </svg>
                        <div>
                          <h4 className="font-medium">Discord</h4>
                          <a href="https://discord.gg/slerf" target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm hover:underline">discord.gg/slerf</a>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.9 8.7c.2 2.5-1.8 5.3-5.1 5.3-1 0-1.9-.3-2.7-.8.9.1 1.9-.2 2.6-.8-.8 0-1.4-.5-1.6-1.2.3 0 .5 0 .7-.1-.8-.2-1.4-.9-1.4-1.8.2.1.5.2.7.2-.8-.5-1-1.6-.5-2.5.9 1 2.1 1.7 3.5 1.8-.2-.9.2-1.8 1.1-2.2.6-.3 1.3-.3 1.8.1.6-.1 1.1-.3 1.6-.6-.2.6-.6 1.1-1.1 1.4.5-.1 1-.2 1.4-.3-.3.4-.7.9-1 1.5z" />
                        </svg>
                        <div>
                          <h4 className="font-medium">Telegram</h4>
                          <a href="https://t.me/slerfofficial" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">t.me/slerfofficial</a>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.8 7.2s-.2-1.7-1-2.4c-.9-1-1.9-1-2.4-1-3.4-.2-8.4-.2-8.4-.2s-5 0-8.4.2c-.5.1-1.5.1-2.4 1-.7.7-1 2.4-1 2.4S0 9.1 0 11.1v1.8c0 1.9.2 3.9.2 3.9s.2 1.7 1 2.4c.9 1 2.1.9 2.6 1 1.9.2 8.2.2 8.2.2s5 0 8.4-.3c.5-.1 1.5-.1 2.4-1 .7-.7 1-2.4 1-2.4s.2-1.9.2-3.9V11c0-1.9-.2-3.8-.2-3.8zM9.5 15.1V8.4l6.5 3.4-6.5 3.3z" />
                        </svg>
                        <div>
                          <h4 className="font-medium">YouTube</h4>
                          <a href="https://youtube.com/c/slerfhub" target="_blank" rel="noopener noreferrer" className="text-red-500 text-sm hover:underline">youtube.com/c/slerfhub</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass p-5 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 text-slerf-cyan">Governance System</h3>
                    <p className="text-gray-300 mb-4">
                      SlerfHub employs a DAO (Decentralized Autonomous Organization) structure that allows $SLERF token holders to actively participate in platform decisions.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-slerf-cyan h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-slerf-dark mr-2 mt-0.5 text-xs">1</div>
                        <div>
                          <h4 className="font-medium">Proposal Submission</h4>
                          <p className="text-sm text-gray-300">Holders with 50,000+ $SLERF can submit proposals</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-slerf-cyan h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-slerf-dark mr-2 mt-0.5 text-xs">2</div>
                        <div>
                          <h4 className="font-medium">Discussion Period</h4>
                          <p className="text-sm text-gray-300">7-day open discussion on forum and Discord</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-slerf-cyan h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-slerf-dark mr-2 mt-0.5 text-xs">3</div>
                        <div>
                          <h4 className="font-medium">Voting Period</h4>
                          <p className="text-sm text-gray-300">3-day voting window with 1 $SLERF = 1 vote</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-slerf-cyan h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-slerf-dark mr-2 mt-0.5 text-xs">4</div>
                        <div>
                          <h4 className="font-medium">Implementation</h4>
                          <p className="text-sm text-gray-300">Proposals with 66%+ approval are implemented</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Community Programs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass p-4 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-slerf-purple/20 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-purple">
                        <path d="M7 10v12"/>
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Ambassador Program</h3>
                    <p className="text-gray-300 mb-3">
                      Join our team of passionate community advocates who help promote SlerfHub across social media, events, and local meetups.
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Exclusive NFTs and rewards</li>
                      <li>• Early feature access</li>
                      <li>• Monthly $SLERF bonuses</li>
                    </ul>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-slerf-cyan/20 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan">
                        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Creator Program</h3>
                    <p className="text-gray-300 mb-3">
                      Design custom missions, quests, and games for the platform. Creators earn a percentage of all rewards distributed through their content.
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Content publishing tools</li>
                      <li>• Revenue sharing model</li>
                      <li>• Creator profile badges</li>
                    </ul>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-slerf-orange/20 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-orange">
                        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/>
                        <path d="m18 2 4 4-4 4"/>
                        <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/>
                        <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/>
                        <path d="m18 14 4 4-4 4"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Referral Program</h3>
                    <p className="text-gray-300 mb-3">
                      Invite friends to join SlerfHub and earn ongoing rewards from their activity. Multi-level referral system with increasing benefits.
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Up to 10% commission on earnings</li>
                      <li>• Special referral achievements</li>
                      <li>• Referral leaderboard competitions</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Community Events
                </h2>
                <div className="glass p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-medium mb-3">Upcoming Events</h3>
                      <div className="space-y-4">
                        <div className="glass-dark p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">Weekly Community Call</h4>
                            <span className="text-xs bg-slerf-purple/20 text-slerf-purple px-2 py-0.5 rounded">Every Friday</span>
                          </div>
                          <p className="text-sm text-gray-300">Team updates, feature previews, and community Q&A session</p>
                          <div className="flex items-center mt-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span>4:00 PM UTC</span>
                          </div>
                        </div>
                        
                        <div className="glass-dark p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">NFT Launch Event</h4>
                            <span className="text-xs bg-slerf-orange/20 text-slerf-orange px-2 py-0.5 rounded">June 15, 2025</span>
                          </div>
                          <p className="text-sm text-gray-300">Exclusive NFT drop with special utility features</p>
                          <div className="flex items-center mt-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span>2:00 PM UTC</span>
                          </div>
                        </div>
                        
                        <div className="glass-dark p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">SLERF Tournament</h4>
                            <span className="text-xs bg-slerf-cyan/20 text-slerf-cyan px-2 py-0.5 rounded">July 1-7, 2025</span>
                          </div>
                          <p className="text-sm text-gray-300">Week-long gaming competition with 100,000 $SLERF prize pool</p>
                          <div className="flex items-center mt-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>All Week</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Community Achievements</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="bg-green-500/20 p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                              <path d="m9 12 2 2 4-4"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">10,000+ Community Members</h4>
                            <p className="text-sm text-gray-300">Reached in April 2025</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="bg-green-500/20 p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                              <path d="m9 12 2 2 4-4"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">250,000 $SLERF Distributed</h4>
                            <p className="text-sm text-gray-300">Through community rewards</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="bg-green-500/20 p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                              <path d="m9 12 2 2 4-4"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">1,000+ NFTs Minted</h4>
                            <p className="text-sm text-gray-300">From our Genesis collection</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full text-slerf-dark bg-slerf-cyan hover:bg-slerf-cyan/90">
                            Join Our Community
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Contract Tab */}
          <TabsContent value="contract" className="space-y-6">
            <motion.div 
              className="glass-dark p-6 rounded-lg"
              variants={staggerItems}
              initial="hidden"
              animate={activeTab === 'contract' ? 'visible' : 'hidden'}
            >
              <motion.div variants={itemFadeIn}>
                <div className="flex items-center mb-4">
                  <img src={slerfLogo} alt="SLERF Logo" className="w-10 h-10 mr-3" />
                  <h2 className="text-2xl font-bold">$SLERF Token Contract</h2>
                </div>
                
                <div className="glass p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Contract Address</h3>
                    <a href="https://etherscan.io/token/0x233df63325933fa3f2dac8e695cd84bb2f91ab07" target="_blank" rel="noopener noreferrer" className="text-slerf-cyan hover:underline text-sm">View on Etherscan</a>
                  </div>
                  <div className="bg-slerf-dark p-3 rounded font-mono text-sm break-all">
                    0x233df63325933fa3f2dac8e695cd84bb2f91ab07
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Contract Details</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-300">Network</span>
                        <span className="font-medium">Ethereum Mainnet</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Token Type</span>
                        <span className="font-medium">ERC-20</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Total Supply</span>
                        <span className="font-medium">100,000,000 SLERF</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Decimals</span>
                        <span className="font-medium">18</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Mintable</span>
                        <span className="font-medium">No</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Burnable</span>
                        <span className="font-medium">Yes</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Contract Audit</span>
                        <span className="font-medium text-green-500">Completed by CertiK</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Token Functions</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">Standard Transfer</p>
                          <p className="text-sm text-gray-300">Send tokens between addresses</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">Transfer with Memo</p>
                          <p className="text-sm text-gray-300">Send tokens with attached message</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">Approve & TransferFrom</p>
                          <p className="text-sm text-gray-300">Delegate token transfers to other addresses</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">Burn</p>
                          <p className="text-sm text-gray-300">Permanently remove tokens from circulation</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">Governance Voting</p>
                          <p className="text-sm text-gray-300">Cast votes on platform proposals</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Contract Security
                </h2>
                <div className="glass p-5 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-1">CertiK Audited</h3>
                      <p className="text-sm text-gray-300">Security score: 95/100</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                          <path d="M12 8v4"/>
                          <path d="M12 16h.01"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-1">Timelock Protected</h3>
                      <p className="text-sm text-gray-300">48-hour delay on admin functions</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          <circle cx="12" cy="16" r="1"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-1">Multisig Governance</h3>
                      <p className="text-sm text-gray-300">7/10 signature requirement</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-5 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">Contract Interactions</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">How to Add $SLERF to MetaMask</h4>
                      <ol className="space-y-2 text-gray-300 list-decimal list-inside">
                        <li>Open MetaMask and ensure you're connected to Ethereum Mainnet</li>
                        <li>Click "Import tokens" at the bottom of the Assets tab</li>
                        <li>Select "Custom Token" and paste the contract address</li>
                        <li>The token symbol (SLERF) and decimals (18) should auto-fill</li>
                        <li>Click "Add Custom Token" and then "Import Tokens"</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">How to Add $SLERF to Other Wallets</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a href="#" className="glass-dark p-3 rounded-lg flex items-center hover:bg-slerf-dark-light transition">
                          <img src="https://placehold.co/30x30/9C27B0/FFFFFF/?text=TW" alt="Trust Wallet" className="w-6 h-6 mr-2 rounded-full" />
                          <span>Trust Wallet Guide</span>
                        </a>
                        <a href="#" className="glass-dark p-3 rounded-lg flex items-center hover:bg-slerf-dark-light transition">
                          <img src="https://placehold.co/30x30/2196F3/FFFFFF/?text=CB" alt="Coinbase Wallet" className="w-6 h-6 mr-2 rounded-full" />
                          <span>Coinbase Wallet Guide</span>
                        </a>
                        <a href="#" className="glass-dark p-3 rounded-lg flex items-center hover:bg-slerf-dark-light transition">
                          <img src="https://placehold.co/30x30/FF9800/FFFFFF/?text=LD" alt="Ledger" className="w-6 h-6 mr-2 rounded-full" />
                          <span>Ledger Guide</span>
                        </a>
                        <a href="#" className="glass-dark p-3 rounded-lg flex items-center hover:bg-slerf-dark-light transition">
                          <img src="https://placehold.co/30x30/4CAF50/FFFFFF/?text=WC" alt="WalletConnect" className="w-6 h-6 mr-2 rounded-full" />
                          <span>WalletConnect Guide</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemFadeIn} className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-slerf-cyan mr-2">➤</span> Documentation Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a 
                    href="#" 
                    className="glass p-5 rounded-lg flex items-start hover:bg-slerf-dark-light/50 transition"
                  >
                    <div className="bg-slerf-purple/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-purple">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Technical Whitepaper</h3>
                      <p className="text-gray-300">Detailed documentation on token mechanics, smart contract architecture, and technical specifications</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    className="glass p-5 rounded-lg flex items-start hover:bg-slerf-dark-light/50 transition"
                  >
                    <div className="bg-slerf-cyan/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Developer Docs</h3>
                      <p className="text-gray-300">Integration guides, API references, and code examples for developers building on SlerfHub</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    className="glass p-5 rounded-lg flex items-start hover:bg-slerf-dark-light/50 transition"
                  >
                    <div className="bg-slerf-orange/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-orange">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Security Audit Reports</h3>
                      <p className="text-gray-300">Third-party security assessments of the $SLERF token contract and platform</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    className="glass p-5 rounded-lg flex items-start hover:bg-slerf-dark-light/50 transition"
                  >
                    <div className="bg-green-500/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">GitHub Repository</h3>
                      <p className="text-gray-300">Open-source code, issue tracking, and development updates</p>
                    </div>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/" className="block">
            <Button variant="outline" className="border-slerf-cyan text-slerf-cyan hover:bg-slerf-cyan/10 w-full md:w-auto">
              Back to Home
            </Button>
          </Link>
          <Link href="/games" className="block">
            <Button className="bg-slerf-purple hover:bg-slerf-purple/90 w-full md:w-auto">
              Play Games & Earn SLERF
            </Button>
          </Link>
          {!wallet && (
            <Button className="bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark w-full md:w-auto" onClick={handleWalletConnect}>
              Connect Wallet
            </Button>
          )}
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Documentation;