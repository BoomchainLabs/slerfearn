import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  const { connectWallet, disconnectWallet, wallet } = useWallet();

  const handleWalletClick = () => {
    if (wallet) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-slerf-dark-lighter text-white">
      <Navbar onWalletClick={handleWalletClick} />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Home;
      >
        <StatsBar />
      </motion.div>
      
      {/* SLERF Token Price Chart with animations */}
      <motion.section 
        className="py-12 px-4 bg-gradient-to-b from-slerf-dark to-slerf-dark/90"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto">
          <motion.div className="flex items-center space-x-3 mb-6" variants={fadeInUp}>
            <img src={slerfLogo} alt="SLERF Logo" className="w-10 h-10" />
            <h2 className="text-3xl font-space font-bold">SLERF Token Live Chart</h2>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <TokenPriceChart />
          </motion.div>
          
          {/* Interactive Token Visualization with Slerf Cat Mascot */}
          <motion.div className="mt-10" variants={fadeInUp}>
            <h2 className="text-3xl font-space font-bold mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan mr-2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              Live Network Activity
            </h2>
            <TokenVisualization />
          </motion.div>
          
          <motion.div 
            className="mt-6 flex justify-center"
            variants={fadeInUp}
          >
            <Link href="/games">
              <Button className="bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark">
                Play Games & Earn SLERF
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.div id="missions" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <DailyMissions />
      </motion.div>
      
      <motion.div id="quests" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <WeeklyQuests />
      </motion.div>
      
      <motion.div id="staking" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <StakingVaults />
      </motion.div>
      
      <motion.div id="games" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <MiniGames />
      </motion.div>
      
      <motion.div id="nfts" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <NFTBoosters />
      </motion.div>
      
      <motion.div id="referrals" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <ReferralSystem />
      </motion.div>
      
      <motion.div id="social" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <SocialFiIntegration />
      </motion.div>
      
      <motion.div id="marketplace" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <MarketplacePreview />
      </motion.div>
      
      {/* Token Integration Section */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-b from-slerf-dark/50 to-slerf-dark/80"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        id="token"
      >
        <div className="container mx-auto">
          <motion.div className="text-center mb-10" variants={fadeInUp}>
            <h2 className="text-4xl font-space font-bold mb-4">Get $SLERF Token</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Add SLERF to your favorite wallet, trade on DEXes, and track performance with these easy tools.
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <TokenIntegration />
          </motion.div>
          
          {/* Token Distribution Section */}
          <motion.div className="mt-16" variants={fadeInUp}>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-space font-bold mb-4">Token Distribution</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Fair and transparent $SLERF token allocation designed for sustainable growth.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan mr-2">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                    Allocation Breakdown
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Community Rewards & Ecosystem</span>
                        <span className="text-slerf-cyan font-bold">45%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-3">
                        <div className="bg-slerf-cyan h-3 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Distributed through missions, quests, games, staking rewards and airdrops
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Development Fund</span>
                        <span className="text-slerf-purple font-bold">18%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-3">
                        <div className="bg-slerf-purple h-3 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        For ongoing platform development, security audits, and infrastructure
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Team & Advisors</span>
                        <span className="text-slerf-orange font-bold">15%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-3">
                        <div className="bg-slerf-orange h-3 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        1-year cliff, then linear vesting over 3 years
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Marketing & Partnerships</span>
                        <span className="text-green-500 font-bold">12%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Exchange listings, promotional campaigns, and strategic partnerships
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Liquidity Provision</span>
                        <span className="text-blue-500 font-bold">10%</span>
                      </div>
                      <div className="w-full bg-slerf-dark-light rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        70% deployed at launch, 30% reserved for future DEX/CEX listings
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan mr-2">
                      <path d="M12 8c2.76 0 5 2.24 5 5 0 2.76-2.24 5-5 5s-5-2.24-5-5c0-2.76 2.24-5 5-5z"></path>
                      <path d="M12 2v3"></path>
                      <path d="M12 19v3"></path>
                      <path d="m4.93 4.93 2.12 2.12"></path>
                      <path d="m16.95 16.95 2.12 2.12"></path>
                      <path d="M2 12h3"></path>
                      <path d="M19 12h3"></path>
                      <path d="m4.93 19.07 2.12-2.12"></path>
                      <path d="m16.95 7.05 2.12-2.12"></path>
                    </svg>
                    Distribution Schedule
                  </h3>
                  
                  <div className="glass-dark p-5 rounded-lg mb-6">
                    <div className="flex items-center mb-4 border-b border-slerf-dark-lighter pb-3">
                      <div className="w-10 h-10 bg-slerf-cyan/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-slerf-cyan font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Initial DEX Offering (IDO)</h4>
                        <p className="text-sm text-gray-400">10% of supply - May 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4 border-b border-slerf-dark-lighter pb-3">
                      <div className="w-10 h-10 bg-slerf-purple/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-slerf-purple font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Ecosystem Rewards Launch</h4>
                        <p className="text-sm text-gray-400">15% unlocked over first year</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4 border-b border-slerf-dark-lighter pb-3">
                      <div className="w-10 h-10 bg-slerf-orange/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-slerf-orange font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Staking Pool Activation</h4>
                        <p className="text-sm text-gray-400">10% allocated with ongoing emissions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4 border-b border-slerf-dark-lighter pb-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-green-500 font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Team & Development Vesting</h4>
                        <p className="text-sm text-gray-400">Begins Q3 2025 with quarterly unlocks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-blue-500 font-bold">5</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Community Treasury</h4>
                        <p className="text-sm text-gray-400">20% reserved for governance decisions</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-dark p-5 rounded-lg">
                    <h4 className="font-bold text-xl mb-3">Token Utility</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Stake for rewards and platform fee discounts</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Vote on platform proposals (governance)</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Purchase NFT boosters and collectibles</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Access premium games and activities</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Earn through community incentives and referrals</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <Footer />
      
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={closeWalletModal} 
        onConnect={connectWallet}
      />
    </div>
  );
};

export default Home;
