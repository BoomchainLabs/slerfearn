import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleFairLaunchCreator from '@/components/SimpleFairLaunchCreator';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, TrendingUp, ShieldCheck, Users, Zap } from 'lucide-react';

const TokenCreatorPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-bold font-space">$LERF Token Creator</h1>
        <p className="text-gray-400 text-lg">
          Create and launch your $LERF token on the Solana blockchain with our integrated tools
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="fair-launch" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-8">
            <TabsTrigger value="fair-launch">Fair Launch</TabsTrigger>
            <TabsTrigger value="bonding-curve">Bonding Curve</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fair-launch">
            <SimpleFairLaunchCreator />
          </TabsContent>
          
          <TabsContent value="bonding-curve">
            <div className="glass p-8 rounded-xl text-center">
              <h3 className="text-xl font-medium mb-4">Bonding Curve Creator</h3>
              <p className="text-gray-400 mb-4">
                This feature is coming soon. Use Fair Launch for now to create your $LERF token.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="best-practices">
            <div className="space-y-6">
              <Card className="bg-slerf-dark-light border-slerf-dark-lighter overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slerf-purple/30 to-slerf-cyan/20">
                  <CardTitle className="text-2xl">Token Launch Best Practices</CardTitle>
                  <CardDescription>
                    Follow these strategies for a successful token launch and maximize your project's potential
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-5 rounded-lg">
                      <div className="flex items-start mb-3">
                        <div className="mr-3 text-slerf-cyan">
                          <TrendingUp size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-1">Optimal Tokenomics</h4>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Allocate at least 40% of tokens to the liquidity pool for market stability</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Use vesting periods for team & advisor allocations to demonstrate commitment</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Reserve 5-10% for marketing efforts to maintain visibility and growth</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass p-5 rounded-lg">
                      <div className="flex items-start mb-3">
                        <div className="mr-3 text-slerf-orange">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-1">Security Considerations</h4>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Implement timelock contracts for administrative functions to build trust</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Conduct a formal audit before launch to identify potential vulnerabilities</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Use multi-signature wallets for treasury and team fund management</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass p-5 rounded-lg">
                      <div className="flex items-start mb-3">
                        <div className="mr-3 text-slerf-purple">
                          <Users size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-1">Community Building</h4>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Create a whitepaper and roadmap before token launch to establish credibility</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Build community channels (Discord, Telegram) at least one month before launch</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Consider a community allocation for early supporters and ambassadors</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass p-5 rounded-lg">
                      <div className="flex items-start mb-3">
                        <div className="mr-3 text-green-500">
                          <Zap size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-1">Launch Strategies</h4>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Set a realistic fundraising target based on project stage and market conditions</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Prepare content calendar for the first 30 days post-launch to maintain momentum</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Include utility features that launch immediately with the token</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-slerf-purple/10 rounded-lg">
                    <h4 className="font-medium text-slerf-purple mb-2">Sylvestre Villalba's Token Launch Principles</h4>
                    <p className="text-sm text-gray-300">
                      "The most successful token launches focus on three pillars: transparency, community engagement, and real utility. 
                      Without any of these elements, even the best tokenomics will struggle to maintain momentum beyond the initial launch phase."
                    </p>
                    <p className="text-sm text-gray-300 mt-3">
                      "For $LERF specifically, we emphasized equal access through fair launch mechanisms and immediate utility through our rewards ecosystem, 
                      which has been key to building long-term holder confidence and reducing volatility."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TokenCreatorPage;