import React, { useState } from 'react';
import { motion } from 'framer-motion';
import slerfLogo from '@/assets/slerf-logo.svg';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Fade in animation
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Define token info interface
interface TokenInfoData {
  address: string;
  symbol: string;
  decimals: number;
  network: string;
  chainId: number;
  explorer: string;
  dexes: Array<{
    name: string;
    logo: string;
    liquidity: string;
    volume24h: string;
    swapUrl: string;
    addLiquidityUrl: string | null;
  }>;
}

// SLERF token information on different chains
const tokenInfo: Record<string, TokenInfoData> = {
  ethereum: {
    address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
    symbol: 'SLERF',
    decimals: 18,
    network: 'Ethereum',
    chainId: 1,
    explorer: 'https://etherscan.io',
    dexes: [
      { 
        name: 'Uniswap', 
        logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
        liquidity: '$2.4M',
        volume24h: '$456K',
        swapUrl: 'https://app.uniswap.org/#/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
        addLiquidityUrl: 'https://app.uniswap.org/#/add/ETH/0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
      },
      { 
        name: 'SushiSwap', 
        logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
        liquidity: '$850K',
        volume24h: '$124K',
        swapUrl: 'https://app.sushi.com/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
        addLiquidityUrl: 'https://app.sushi.com/add/ETH/0x233df63325933fa3f2dac8e695cd84bb2f91ab07', 
      },
      { 
        name: '1inch', 
        logo: 'https://cryptologos.cc/logos/1inch-1inch-logo.png',
        liquidity: 'Via Aggregator',
        volume24h: '$223K',
        swapUrl: 'https://app.1inch.io/#/1/swap/ETH/0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
        addLiquidityUrl: null, 
      },
    ]
  },
  solana: {
    address: 'SLRFKVycqZRBnhTjnzHCkrcvmRQ7JqAhCTkFbGjxwqC',
    symbol: 'SLERF',
    decimals: 9,
    network: 'Solana',
    chainId: 101, // Solana mainnet
    explorer: 'https://solscan.io',
    dexes: [
      { 
        name: 'Raydium', 
        logo: 'https://cryptologos.cc/logos/raydium-ray-logo.png',
        liquidity: '$1.2M',
        volume24h: '$340K',
        swapUrl: 'https://raydium.io/swap/?inputCurrency=SOL&outputCurrency=SLRFKVycqZRBnhTjnzHCkrcvmRQ7JqAhCTkFbGjxwqC', 
        addLiquidityUrl: 'https://raydium.io/liquidity/add/?inputCurrency=SOL&outputCurrency=SLRFKVycqZRBnhTjnzHCkrcvmRQ7JqAhCTkFbGjxwqC', 
      },
      { 
        name: 'Orca', 
        logo: 'https://cryptologos.cc/logos/orca-orca-logo.png',
        liquidity: '$750K',
        volume24h: '$178K',
        swapUrl: 'https://www.orca.so/swap?outputCurrency=SLRFKVycqZRBnhTjnzHCkrcvmRQ7JqAhCTkFbGjxwqC', 
        addLiquidityUrl: 'https://www.orca.so/liquidity?inputCurrency=SOL&outputCurrency=SLRFKVycqZRBnhTjnzHCkrcvmRQ7JqAhCTkFbGjxwqC', 
      },
      { 
        name: 'Jupiter', 
        logo: 'https://cryptologos.cc/logos/jupiter-jup-logo.png',
        liquidity: 'Via Aggregator',
        volume24h: '$265K',
        swapUrl: 'https://jup.ag/swap/SOL-SLRFKVycqZRBnhTjnzHCkrcvmRQ7JqAhCTkFbGjxwqC', 
        addLiquidityUrl: null, 
      },
    ]
  },
  bsc: {
    address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
    symbol: 'SLERF',
    decimals: 18,
    network: 'BNB Chain',
    chainId: 56,
    explorer: 'https://bscscan.com',
    dexes: [
      { 
        name: 'PancakeSwap', 
        logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png',
        liquidity: '$950K',
        volume24h: '$280K',
        swapUrl: 'https://pancakeswap.finance/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07', 
        addLiquidityUrl: 'https://pancakeswap.finance/add/BNB/0x233df63325933fa3f2dac8e695cd84bb2f91ab07', 
      },
      { 
        name: 'BiSwap', 
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11090.png',
        liquidity: '$320K',
        volume24h: '$78K',
        swapUrl: 'https://exchange.biswap.org/#/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07', 
        addLiquidityUrl: 'https://exchange.biswap.org/#/add/BNB/0x233df63325933fa3f2dac8e695cd84bb2f91ab07', 
      },
    ]
  },
  arbitrum: {
    address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
    symbol: 'SLERF',
    decimals: 18,
    network: 'Arbitrum',
    chainId: 42161,
    explorer: 'https://arbiscan.io',
    dexes: [
      { 
        name: 'Camelot', 
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/23727.png',
        liquidity: '$680K',
        volume24h: '$142K',
        swapUrl: 'https://app.camelot.exchange/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07', 
        addLiquidityUrl: 'https://app.camelot.exchange/liquidity/add?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07', 
      },
      { 
        name: 'SushiSwap', 
        logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
        liquidity: '$420K',
        volume24h: '$89K',
        swapUrl: 'https://app.sushi.com/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07&chainId=42161', 
        addLiquidityUrl: 'https://app.sushi.com/add/ETH/0x233df63325933fa3f2dac8e695cd84bb2f91ab07?chainId=42161', 
      },
    ]
  }
};

// Bridge info for cross-chain transfers
const bridgeInfo = [
  {
    name: 'Portal Bridge',
    description: 'Wormhole\'s Portal Bridge for trustless cross-chain transfers',
    chains: ['Ethereum', 'Solana', 'BSC', 'Arbitrum'],
    url: 'https://www.portalbridge.com/#/transfer',
    fee: '0.1%',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9418.png'
  },
  {
    name: 'Synapse Protocol',
    description: 'Cross-chain liquidity network',
    chains: ['Ethereum', 'BSC', 'Arbitrum'],
    url: 'https://synapseprotocol.com/',
    fee: '0.3%',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/14272.png'
  },
  {
    name: 'Multichain',
    description: 'Cross-chain router protocol',
    chains: ['Ethereum', 'BSC', 'Arbitrum'],
    url: 'https://multichain.org/',
    fee: '0.1-0.3%',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/22087.png'
  },
];

// Format address for display
const formatAddress = (address: string): string => {
  if (address.startsWith('0x')) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  } else {
    // For Solana addresses
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  }
};

const CrossChainLiquidity: React.FC = () => {
  const [activeChain, setActiveChain] = useState<string>('ethereum');
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
  
  const chain = tokenInfo[activeChain as keyof typeof tokenInfo];
  
  // Calculate total liquidity across all DEXes
  const calculateTotalLiquidity = (chain: typeof tokenInfo.ethereum) => {
    let total = 0;
    chain.dexes.forEach(dex => {
      if (dex.liquidity !== 'Via Aggregator') {
        // Extract number and convert to value
        const numStr = dex.liquidity.replace('$', '').replace('M', '000000').replace('K', '000');
        total += parseFloat(numStr);
      }
    });
    
    if (total >= 1000000) {
      return '$' + (total / 1000000).toFixed(1) + 'M';
    } else if (total >= 1000) {
      return '$' + (total / 1000).toFixed(1) + 'K';
    } else {
      return '$' + total.toFixed(0);
    }
  };
  
  return (
    <div className="w-full rounded-xl glass p-6 relative">
      <div className="flex items-center space-x-3 mb-6">
        <img src={slerfLogo} alt="SLERF Logo" className="h-10 w-10" />
        <div>
          <h2 className="text-2xl font-space font-bold">Cross-Chain Liquidity</h2>
          <p className="text-gray-400">Add and manage SLERF liquidity across multiple blockchains</p>
        </div>
      </div>
      
      <Tabs
        value={activeChain}
        onValueChange={setActiveChain}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="ethereum" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Ethereum
          </TabsTrigger>
          <TabsTrigger value="solana" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            Solana
          </TabsTrigger>
          <TabsTrigger value="bsc" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            BNB Chain
          </TabsTrigger>
          <TabsTrigger value="arbitrum" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Arbitrum
          </TabsTrigger>
        </TabsList>
        
        {/* Chain-specific content */}
        {Object.keys(tokenInfo).map((chainKey) => (
          <TabsContent 
            key={chainKey} 
            value={chainKey}
            className="space-y-6"
          >
            <motion.div 
              initial="hidden"
              animate={activeChain === chainKey ? 'visible' : 'hidden'}
              variants={fadeIn}
            >
              {/* Token Information */}
              <div className="glass-dark p-5 rounded-lg mb-6">
                <h3 className="text-xl font-medium mb-4">SLERF on {tokenInfo[chainKey as keyof typeof tokenInfo].network}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <div className="text-gray-400 text-sm mb-1">Contract Address</div>
                      <div className="flex items-center">
                        <div className="bg-slerf-dark/50 p-2 rounded-lg font-mono text-sm mr-2 flex-grow">
                          {tokenInfo[chainKey as keyof typeof tokenInfo].address}
                        </div>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(
                            tokenInfo[chainKey as keyof typeof tokenInfo].address, 
                            `${tokenInfo[chainKey as keyof typeof tokenInfo].network} address copied!`
                          )}
                          className="whitespace-nowrap"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="glass p-3 rounded-lg text-center">
                        <div className="text-gray-400 text-xs">Symbol</div>
                        <div className="font-medium">{tokenInfo[chainKey as keyof typeof tokenInfo].symbol}</div>
                      </div>
                      <div className="glass p-3 rounded-lg text-center">
                        <div className="text-gray-400 text-xs">Decimals</div>
                        <div className="font-medium">{tokenInfo[chainKey as keyof typeof tokenInfo].decimals}</div>
                      </div>
                      {tokenInfo[chainKey as keyof typeof tokenInfo].chainId && (
                        <div className="glass p-3 rounded-lg text-center">
                          <div className="text-gray-400 text-xs">Chain ID</div>
                          <div className="font-medium">{tokenInfo[chainKey as keyof typeof tokenInfo].chainId}</div>
                        </div>
                      )}
                      <div className="glass p-3 rounded-lg text-center">
                        <div className="text-gray-400 text-xs">Total Liquidity</div>
                        <div className="font-medium text-slerf-cyan">{calculateTotalLiquidity(tokenInfo[chainKey as keyof typeof tokenInfo])}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => window.open(`${tokenInfo[chainKey as keyof typeof tokenInfo].explorer}/token/${tokenInfo[chainKey as keyof typeof tokenInfo].address}`, '_blank')}
                        className="text-sm"
                        size="sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        View on {tokenInfo[chainKey as keyof typeof tokenInfo].explorer.split('https://')[1]}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-3">How to Add to Wallet</h4>
                    <div className="space-y-4">
                      {chainKey === 'ethereum' && (
                        <>
                          <div>
                            <h5 className="font-medium text-slerf-cyan flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m20.9 18.55-8-16a1 1 0 0 0-1.8 0l-8 16a1 1 0 0 0 .9 1.45h16a1 1 0 0 0 .9-1.45Z"></path>
                              </svg>
                              MetaMask / Other EVM Wallets
                            </h5>
                            <ol className="list-decimal ml-5 text-sm text-gray-300 space-y-1 mt-1">
                              <li>Open your wallet and ensure you're connected to Ethereum Mainnet</li>
                              <li>Click "Import tokens"</li>
                              <li>Paste the contract address</li>
                              <li>Symbol (SLERF) and Decimals (18) should auto-fill</li>
                              <li>Click "Add" or "Import"</li>
                            </ol>
                          </div>
                        </>
                      )}
                      
                      {chainKey === 'solana' && (
                        <>
                          <div>
                            <h5 className="font-medium text-slerf-cyan flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m20.9 18.55-8-16a1 1 0 0 0-1.8 0l-8 16a1 1 0 0 0 .9 1.45h16a1 1 0 0 0 .9-1.45Z"></path>
                              </svg>
                              Phantom / Solflare
                            </h5>
                            <ol className="list-decimal ml-5 text-sm text-gray-300 space-y-1 mt-1">
                              <li>Open your Solana wallet</li>
                              <li>Click the "+" button or "Add token"</li>
                              <li>Select "Custom token"</li>
                              <li>Paste the token address</li>
                              <li>Click "Add" to import the token</li>
                            </ol>
                          </div>
                        </>
                      )}
                      
                      {chainKey === 'bsc' && (
                        <>
                          <div>
                            <h5 className="font-medium text-slerf-cyan flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m20.9 18.55-8-16a1 1 0 0 0-1.8 0l-8 16a1 1 0 0 0 .9 1.45h16a1 1 0 0 0 .9-1.45Z"></path>
                              </svg>
                              MetaMask / Trust Wallet / Binance Wallet
                            </h5>
                            <ol className="list-decimal ml-5 text-sm text-gray-300 space-y-1 mt-1">
                              <li>Open your wallet and ensure you're connected to BNB Chain Mainnet</li>
                              <li>Click "Add Token" or "Import token"</li>
                              <li>Paste the contract address</li>
                              <li>Symbol (SLERF) and Decimals (18) should auto-fill</li>
                              <li>Click "Add" or "Import"</li>
                            </ol>
                          </div>
                        </>
                      )}
                      
                      {chainKey === 'arbitrum' && (
                        <>
                          <div>
                            <h5 className="font-medium text-slerf-cyan flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m20.9 18.55-8-16a1 1 0 0 0-1.8 0l-8 16a1 1 0 0 0 .9 1.45h16a1 1 0 0 0 .9-1.45Z"></path>
                              </svg>
                              MetaMask / Other EVM Wallets
                            </h5>
                            <ol className="list-decimal ml-5 text-sm text-gray-300 space-y-1 mt-1">
                              <li>Open your wallet and ensure you're connected to Arbitrum One</li>
                              <li>Click "Import tokens"</li>
                              <li>Paste the contract address</li>
                              <li>Symbol (SLERF) and Decimals (18) should auto-fill</li>
                              <li>Click "Add" or "Import"</li>
                            </ol>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* DEX Liquidity */}
              <div className="glass-dark p-5 rounded-lg mb-6">
                <h3 className="text-xl font-medium mb-4">Liquidity Providers & Exchanges</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tokenInfo[chainKey as keyof typeof tokenInfo].dexes.map((dex, index) => (
                    <div key={`${chainKey}-${dex.name}`} className="glass p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2 bg-white p-1">
                          <img src={dex.logo} alt={dex.name} className="h-full w-full object-contain" />
                        </div>
                        <h4 className="font-medium">{dex.name}</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="glass-dark p-2 rounded-lg text-center">
                          <div className="text-gray-400 text-xs">Liquidity</div>
                          <div className="font-medium text-slerf-cyan">{dex.liquidity}</div>
                        </div>
                        <div className="glass-dark p-2 rounded-lg text-center">
                          <div className="text-gray-400 text-xs">24h Volume</div>
                          <div className="font-medium text-slerf-cyan">{dex.volume24h}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => window.open(dex.swapUrl, '_blank')}
                          className="flex-1 text-xs"
                          size="sm"
                        >
                          Swap
                        </Button>
                        {dex.addLiquidityUrl && (
                          <Button 
                            variant="outline"
                            onClick={() => window.open(dex.addLiquidityUrl!, '_blank')}
                            className="flex-1 text-xs"
                            size="sm"
                          >
                            Add Liquidity
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bridging section */}
              <div className="glass-dark p-5 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Bridge to Other Chains</h3>
                <p className="text-gray-300 mb-4">
                  Transfer your SLERF tokens across different blockchains using these bridge solutions:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bridgeInfo.map((bridge, index) => (
                    <div key={bridge.name} className="glass p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2 bg-white p-1">
                          <img src={bridge.icon} alt={bridge.name} className="h-full w-full object-contain" />
                        </div>
                        <h4 className="font-medium">{bridge.name}</h4>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{bridge.description}</p>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Supported Chains</div>
                        <div className="flex flex-wrap gap-1">
                          {bridge.chains.map(chain => (
                            <span key={`${bridge.name}-${chain}`} className="text-xs bg-slerf-dark px-2 py-1 rounded-full">
                              {chain}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-gray-400">Bridge Fee</div>
                        <div className="text-sm font-medium">{bridge.fee}</div>
                      </div>
                      
                      <Button 
                        onClick={() => window.open(bridge.url, '_blank')}
                        className="w-full text-xs"
                        size="sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                        Use Bridge
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Benefits of adding liquidity */}
      <div className="mt-8 glass p-5 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Benefits of Adding Liquidity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-dark p-4 rounded-lg">
            <div className="w-10 h-10 bg-slerf-cyan/20 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <h4 className="font-medium mb-2">Earn Trading Fees</h4>
            <p className="text-gray-300 text-sm">
              Liquidity providers earn a percentage of all trading fees generated by traders swapping tokens in the pool. 
              Fees range from 0.1% to 0.3% depending on the DEX.
            </p>
          </div>
          
          <div className="glass-dark p-4 rounded-lg">
            <div className="w-10 h-10 bg-slerf-purple/20 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h4 className="font-medium mb-2">Boost Liquidity for the Project</h4>
            <p className="text-gray-300 text-sm">
              By providing liquidity, you help increase market depth, reduce slippage, and make trading more efficient for all users.
              This contributes to the overall health of the SLERF ecosystem.
            </p>
          </div>
          
          <div className="glass-dark p-4 rounded-lg">
            <div className="w-10 h-10 bg-slerf-orange/20 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slerf-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
              </svg>
            </div>
            <h4 className="font-medium mb-2">Liquidity Mining Rewards</h4>
            <p className="text-gray-300 text-sm">
              The SlerfHub platform offers additional SLERF token rewards for liquidity providers through our liquidity 
              mining program. Stake your LP tokens to earn extra SLERF rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChainLiquidity;