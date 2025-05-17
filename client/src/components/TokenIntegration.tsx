import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import slerfLogo from '@/assets/slerf-logo.svg';
import { useToast } from '@/hooks/use-toast';

// Token integration information
const SLERF_TOKEN_ADDRESS = '0x233df63325933fa3f2dac8e695cd84bb2f91ab07';
const SLERF_TOKEN_SYMBOL = 'SLERF';
const SLERF_TOKEN_DECIMALS = 18;
const SLERF_TOKEN_CHAIN = 'Ethereum';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const TokenIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallets');
  const { toast } = useToast();
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: message,
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center space-x-3 mb-6">
        <img src={slerfLogo} alt="SLERF Logo" className="h-10 w-10" />
        <h2 className="text-2xl font-space font-bold">Add $SLERF to Your Wallet</h2>
      </div>
      
      <div className="mb-6">
        <div className="glass-dark p-4 rounded-lg flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex flex-col mb-4 md:mb-0">
            <span className="text-gray-400 text-sm">Token Contract Address</span>
            <div className="flex items-center mt-1">
              <span className="font-mono bg-slerf-dark/50 text-slerf-cyan p-2 rounded-lg text-sm break-all">{SLERF_TOKEN_ADDRESS}</span>
            </div>
          </div>
          <Button 
            className="bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark"
            onClick={() => copyToClipboard(SLERF_TOKEN_ADDRESS, 'Token address copied!')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-dark p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Token Symbol</h3>
            <p className="text-slerf-cyan text-2xl font-bold">{SLERF_TOKEN_SYMBOL}</p>
          </div>
          <div className="glass-dark p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Decimals</h3>
            <p className="text-slerf-cyan text-2xl font-bold">{SLERF_TOKEN_DECIMALS}</p>
          </div>
          <div className="glass-dark p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Network</h3>
            <p className="text-slerf-cyan text-2xl font-bold">{SLERF_TOKEN_CHAIN}</p>
          </div>
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="wallets" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
            Wallets
          </TabsTrigger>
          <TabsTrigger value="exchanges" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
            DEXes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-slerf-cyan data-[state=active]:text-slerf-dark">
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallets" className="space-y-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={activeTab === 'wallets' ? 'visible' : 'hidden'}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">MetaMask</h3>
                <ol className="list-decimal pl-4 space-y-2 text-gray-300">
                  <li>Open MetaMask and ensure you're connected to Ethereum Mainnet</li>
                  <li>Scroll down and click "Import tokens" at the bottom of the Assets tab</li>
                  <li>Select "Custom Token" and paste the token contract address</li>
                  <li>The token symbol (SLERF) and decimals (18) should auto-fill</li>
                  <li>Click "Add Custom Token" and then "Import Tokens"</li>
                </ol>
                <div className="mt-4">
                  <a 
                    href={`https://metamask.io/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline"
                  >
                    Download MetaMask
                  </a>
                </div>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Trust Wallet</h3>
                <ol className="list-decimal pl-4 space-y-2 text-gray-300">
                  <li>Open Trust Wallet and go to the "Tokens" tab</li>
                  <li>Tap on the icon in the top-right corner</li>
                  <li>Search for "SLERF" (if listed) or select "Add Custom Token"</li>
                  <li>Select "Ethereum" as the network</li>
                  <li>Paste the contract address and save</li>
                </ol>
                <div className="mt-4">
                  <a 
                    href={`https://trustwallet.com/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline"
                  >
                    Download Trust Wallet
                  </a>
                </div>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Coinbase Wallet</h3>
                <ol className="list-decimal pl-4 space-y-2 text-gray-300">
                  <li>Open Coinbase Wallet and tap on the "Receive" button</li>
                  <li>Tap on "Add custom token" at the bottom</li>
                  <li>Select "Ethereum" as the network</li>
                  <li>Paste the SLERF contract address</li>
                  <li>Verify the token details and tap "Add to wallet"</li>
                </ol>
                <div className="mt-4">
                  <a 
                    href={`https://www.coinbase.com/wallet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline"
                  >
                    Download Coinbase Wallet
                  </a>
                </div>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Rainbow Wallet</h3>
                <ol className="list-decimal pl-4 space-y-2 text-gray-300">
                  <li>Open Rainbow and tap on the search icon</li>
                  <li>Paste the SLERF contract address</li>
                  <li>Tap on "Add Custom Token"</li>
                  <li>Verify the token information</li>
                  <li>Tap "Add" to include SLERF in your wallet</li>
                </ol>
                <div className="mt-4">
                  <a 
                    href={`https://rainbow.me/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline"
                  >
                    Download Rainbow Wallet
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button 
                className="bg-slerf-purple hover:bg-slerf-purple/90"
                onClick={() => window.open(`https://etherscan.io/token/${SLERF_TOKEN_ADDRESS}`, '_blank')}
              >
                View on Etherscan
              </Button>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="exchanges" className="space-y-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={activeTab === 'exchanges' ? 'visible' : 'hidden'}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Uniswap</h3>
                <p className="text-gray-300 mb-4">
                  Trade SLERF tokens on the largest Ethereum DEX with deep liquidity.
                </p>
                <a 
                  href={`https://app.uniswap.org/#/swap?outputCurrency=${SLERF_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slerf-cyan hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Trade on Uniswap
                </a>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">SushiSwap</h3>
                <p className="text-gray-300 mb-4">
                  Alternative DEX with different liquidity pools and fee structure.
                </p>
                <a 
                  href={`https://app.sushi.com/swap?outputCurrency=${SLERF_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slerf-cyan hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Trade on SushiSwap
                </a>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">1inch</h3>
                <p className="text-gray-300 mb-4">
                  DEX aggregator that finds the best rates across multiple exchanges.
                </p>
                <a 
                  href={`https://app.1inch.io/#/1/simple/swap/ETH/${SLERF_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slerf-cyan hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Trade on 1inch
                </a>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Balancer</h3>
                <p className="text-gray-300 mb-4">
                  Protocol for programmable liquidity with multi-token pools.
                </p>
                <a 
                  href={`https://app.balancer.fi/#/ethereum/swap`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slerf-cyan hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Trade on Balancer
                </a>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-4">Add Liquidity</h3>
              <div className="glass-dark p-4 rounded-lg">
                <p className="text-gray-300 mb-4">
                  Earn fees by providing liquidity to SLERF token pools. Choose your preferred platform:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <a 
                    href={`https://app.uniswap.org/#/add/ETH/${SLERF_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass p-3 rounded-lg flex items-center justify-center hover:bg-slerf-dark-light transition"
                  >
                    Provide on Uniswap
                  </a>
                  <a 
                    href={`https://app.sushi.com/add/${SLERF_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass p-3 rounded-lg flex items-center justify-center hover:bg-slerf-dark-light transition"
                  >
                    Provide on SushiSwap
                  </a>
                  <a 
                    href={`https://app.balancer.fi/#/ethereum/pool/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass p-3 rounded-lg flex items-center justify-center hover:bg-slerf-dark-light transition"
                  >
                    Provide on Balancer
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={activeTab === 'analytics' ? 'visible' : 'hidden'}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Token Analytics</h3>
                <p className="text-gray-300 mb-4">
                  Track SLERF's market performance, holder statistics, and trading volume.
                </p>
                <div className="space-y-2">
                  <a 
                    href={`https://etherscan.io/token/${SLERF_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Etherscan
                  </a>
                  <a 
                    href={`https://www.dextools.io/app/ether/pair-explorer/${SLERF_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                    DEXTools
                  </a>
                  <a 
                    href={`https://www.coingecko.com/en/coins/slerf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                      <path d="M8.5 8.5v.01"></path>
                      <path d="M16 15.5v.01"></path>
                      <path d="M12 12v.01"></path>
                      <path d="M11 17v.01"></path>
                      <path d="M7 14v.01"></path>
                    </svg>
                    CoinGecko
                  </a>
                  <a 
                    href={`https://coinmarketcap.com/currencies/slerf/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                      <path d="M8.5 8.5v.01"></path>
                      <path d="M16 15.5v.01"></path>
                      <path d="M12 12v.01"></path>
                      <path d="M11 17v.01"></path>
                      <path d="M7 14v.01"></path>
                    </svg>
                    CoinMarketCap
                  </a>
                </div>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Trading Insights</h3>
                <p className="text-gray-300 mb-4">
                  Access detailed trading charts, market history, and technical analysis.
                </p>
                <div className="space-y-2">
                  <a 
                    href={`https://info.uniswap.org/#/tokens/${SLERF_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Uniswap Analytics
                  </a>
                  <a 
                    href={`https://www.defined.fi/eth/${SLERF_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                    Defined.fi
                  </a>
                  <a 
                    href={`https://www.geckoterminal.com/eth/pools/${SLERF_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slerf-cyan hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                    GeckoTerminal
                  </a>
                </div>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Contract Verification</h3>
                <p className="text-gray-300 mb-4">
                  SLERF token's source code is fully verified and transparent.
                </p>
                <a 
                  href={`https://etherscan.io/token/${SLERF_TOKEN_ADDRESS}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slerf-cyan hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  View Source Code
                </a>
              </div>
              
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Whale Watching</h3>
                <p className="text-gray-300 mb-4">
                  Track large holders and significant transactions.
                </p>
                <a 
                  href={`https://etherscan.io/token/tokenholderchart/${SLERF_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slerf-cyan hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                    <path d="M12 3a6 6 0 0 1-9 9 9 9 0 0 0 9-9Z"></path>
                  </svg>
                  View Top Holders
                </a>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* Apply to get listed section */}
      <div className="mt-10 glass-dark p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Want $SLERF Listed on More Platforms?</h2>
        <p className="text-gray-300 mb-4">
          Help us expand SLERF's reach by submitting listing applications to exchanges and marketplaces.
          Join our community effort to increase visibility and liquidity!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-lg mb-2">Centralized Exchanges (CEX)</h3>
            <ul className="space-y-1 text-gray-300">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Binance
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Coinbase
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                KuCoin
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-cyan mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Gate.io
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Token Tracking/Ratings Sites</h3>
            <ul className="space-y-1 text-gray-300">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-purple mr-2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                CoinMarketCap
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-purple mr-2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                CoinGecko
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-purple mr-2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                CoinRanking
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slerf-purple mr-2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                DexScreener
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button className="bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark">
            Join Community Efforts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenIntegration;