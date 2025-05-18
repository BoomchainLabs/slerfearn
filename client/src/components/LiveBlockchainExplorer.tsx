import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SLERFAnimatedLogo from './SLERFAnimatedLogo';

// Transaction types
interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'transfer' | 'token' | 'contract' | 'cross-chain';
  network: string;
  blockNumber?: number;
  fee?: string;
  gasUsed?: number;
  tokenSymbol?: string;
  tokenValue?: string;
  tokenAddress?: string;
  contractMethod?: string;
  destinationNetwork?: string;
  bridgeName?: string;
}

// Sample networks
const NETWORKS = [
  { id: 'all', name: 'All Networks', color: '#FFFFFF' },
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA' },
  { id: 'base', name: 'Base', color: '#0052FF' },
  { id: 'optimism', name: 'Optimism', color: '#FF0320' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0' }
];

// Sample transaction types
const TX_TYPES = [
  { id: 'all', name: 'All Types', icon: '🔄' },
  { id: 'transfer', name: 'Transfers', icon: '💸' },
  { id: 'token', name: 'Token Txs', icon: '🪙' },
  { id: 'contract', name: 'Contract Calls', icon: '📜' },
  { id: 'cross-chain', name: 'Cross-Chain', icon: '🌉' }
];

// Sample data - in a real app this would come from an actual blockchain API
const generateMockTransactions = (count: number): Transaction[] => {
  const networks = ['Ethereum', 'Base', 'Optimism', 'Arbitrum'];
  const statuses = ['confirmed', 'pending', 'confirmed', 'confirmed']; // Mostly confirmed
  const types = ['transfer', 'token', 'contract', 'cross-chain'];
  const tokens = [
    { symbol: 'LERF', address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07' },
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000' },
    { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
    { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' }
  ];
  const bridges = ['Hop Protocol', 'Across Bridge', 'Stargate', 'LayerZero'];
  
  const now = Math.floor(Date.now() / 1000);
  
  return Array.from({ length: count }, (_, i) => {
    const network = networks[Math.floor(Math.random() * networks.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const timestamp = now - Math.floor(Math.random() * 3600 * 24); // Last 24 hours
    const hash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const from = `0x${Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const to = type === 'contract' ? null : `0x${Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
    const tx: Transaction = {
      hash,
      from,
      to,
      value: (Math.random() * 10).toFixed(4),
      timestamp,
      status: status as 'pending' | 'confirmed' | 'failed',
      type: type as 'transfer' | 'token' | 'contract' | 'cross-chain',
      network,
      blockNumber: status === 'confirmed' ? 15000000 + Math.floor(Math.random() * 1000000) : undefined,
      fee: (Math.random() * 0.01).toFixed(6),
      gasUsed: Math.floor(Math.random() * 200000) + 21000
    };
    
    // Add token specific fields if it's a token transaction
    if (type === 'token') {
      tx.tokenSymbol = token.symbol;
      tx.tokenAddress = token.address;
      tx.tokenValue = (Math.random() * 1000).toFixed(2);
    }
    
    // Add contract method if it's a contract call
    if (type === 'contract') {
      tx.contractMethod = ['swap', 'mint', 'stake', 'approve'][Math.floor(Math.random() * 4)];
    }
    
    // Add cross-chain specific fields
    if (type === 'cross-chain') {
      const availableNetworks = networks.filter(n => n !== network);
      tx.destinationNetwork = availableNetworks[Math.floor(Math.random() * availableNetworks.length)];
      tx.bridgeName = bridges[Math.floor(Math.random() * bridges.length)];
      tx.tokenSymbol = token.symbol;
      tx.tokenValue = (Math.random() * 500).toFixed(2);
    }
    
    return tx;
  });
};

interface LiveBlockchainExplorerProps {
  maxTransactions?: number;
  liveUpdates?: boolean;
  showFilters?: boolean;
  className?: string;
}

const LiveBlockchainExplorer: React.FC<LiveBlockchainExplorerProps> = ({
  maxTransactions = 50,
  liveUpdates = true,
  showFilters = true,
  className = ""
}) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [isLive, setIsLive] = useState(liveUpdates);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const [liveStream, setLiveStream] = useState<Transaction[]>([]);
  
  // Fetch initial transaction data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call to a blockchain data provider
        // const response = await fetch('https://api.blockchain.com/v3/transactions/recent');
        // const data = await response.json();
        
        // Using mock data for demonstration
        const mockData = generateMockTransactions(maxTransactions);
        
        // Sort by timestamp (newest first)
        mockData.sort((a, b) => b.timestamp - a.timestamp);
        
        setTransactions(mockData);
        setFilteredTransactions(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blockchain data:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to fetch blockchain transactions. Please try again."
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [maxTransactions, toast]);
  
  // Set up live updates simulation
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      // In a real app, this would be a websocket connection or polling an API
      // Simulating new transaction every few seconds
      const shouldGenerateTransaction = Math.random() > 0.5; // 50% chance
      
      if (shouldGenerateTransaction) {
        const newTransaction = generateMockTransactions(1)[0];
        
        // Add transaction to the stream and main list
        setLiveStream(prev => [newTransaction, ...prev].slice(0, 5));
        setTransactions(prev => [newTransaction, ...prev].slice(0, maxTransactions));
        
        // Play notification sound if enabled
        // const notificationSound = new Audio('/notification.mp3');
        // notificationSound.play().catch(e => console.log('Audio play error:', e));
      }
    }, 5000); // Every 5 seconds
    
    return () => clearInterval(interval);
  }, [isLive, maxTransactions]);
  
  // Clear live stream after animation
  useEffect(() => {
    if (liveStream.length > 0) {
      const timer = setTimeout(() => {
        setLiveStream([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [liveStream]);
  
  // Apply filters whenever search, type, or network changes
  useEffect(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(query) ||
        tx.from.toLowerCase().includes(query) ||
        (tx.to && tx.to.toLowerCase().includes(query)) ||
        (tx.tokenSymbol && tx.tokenSymbol.toLowerCase().includes(query))
      );
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedType);
    }
    
    // Apply network filter
    if (selectedNetwork !== 'all') {
      filtered = filtered.filter(tx => tx.network.toLowerCase() === selectedNetwork.toLowerCase());
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, selectedType, selectedNetwork]);
  
  // Format functions
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatTimestamp = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return new Date(timestamp * 1000).toLocaleString();
  };
  
  const getNetworkColor = (network: string) => {
    const networkInfo = NETWORKS.find(n => n.name.toLowerCase() === network.toLowerCase());
    return networkInfo?.color || '#FFFFFF';
  };
  
  const getTransactionTypeIcon = (type: string) => {
    const typeInfo = TX_TYPES.find(t => t.id === type);
    return typeInfo?.icon || '🔄';
  };
  
  // Handle transaction click
  const handleSelectTransaction = (tx: Transaction) => {
    setSelectedTransaction(tx);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle live updates
  const toggleLiveUpdates = () => {
    setIsLive(prev => !prev);
  };
  
  // Value formatting helpers
  const formatEther = (value: string) => {
    return parseFloat(value).toFixed(4);
  };
  
  return (
    <div className={`cyber-card p-0.5 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-black/80 rounded-lg h-full flex flex-col">
        {/* Header with filters */}
        <div className="p-4 border-b border-white/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SLERFAnimatedLogo size={36} interval={10000} />
              <h3 className="text-xl font-audiowide text-white">Live Blockchain Explorer</h3>
            </div>
            
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <button 
                onClick={toggleLiveUpdates} 
                className="text-xs text-white/60 font-mono hover:text-white/90"
              >
                {isLive ? 'LIVE UPDATES' : 'PAUSED'}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by address, hash, or token"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {/* Transaction types filter */}
                <div className="bg-black/30 rounded p-1 flex gap-1">
                  {TX_TYPES.map(type => (
                    <Button
                      key={type.id}
                      size="sm"
                      variant={selectedType === type.id ? "default" : "ghost"}
                      className={`flex items-center gap-1 px-2 text-xs ${
                        selectedType === type.id 
                          ? 'bg-[hsl(var(--cyber-blue))]' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </Button>
                  ))}
                </div>
                
                {/* Networks filter */}
                <div className="bg-black/30 rounded p-1 flex gap-1">
                  {NETWORKS.map(network => (
                    <Button
                      key={network.id}
                      size="sm"
                      variant={selectedNetwork === network.id ? "default" : "ghost"}
                      className={`flex items-center gap-1 px-2 text-xs ${
                        selectedNetwork === network.id 
                          ? 'bg-[hsl(var(--cyber-blue))]' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedNetwork(network.id)}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: network.color }}></span>
                      <span>{network.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main content - Transaction list and details */}
        <div className="flex-grow flex">
          {/* Transaction list */}
          <div className="w-full lg:w-3/5 flex flex-col border-r border-white/10">
            {/* Live feed banner */}
            {isLive && (
              <div 
                ref={liveRef}
                className="bg-black/40 p-2 border-b border-white/10"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-xs text-white/70">
                    {liveStream.length > 0 
                      ? `${liveStream.length} new transaction${liveStream.length > 1 ? 's' : ''} detected`
                      : 'Monitoring blockchain for new transactions...'}
                  </p>
                </div>
                
                <AnimatePresence>
                  {liveStream.map((tx, index) => (
                    <motion.div
                      key={tx.hash}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mt-2 p-2 bg-black/20 border border-white/10 rounded text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>{getTransactionTypeIcon(tx.type)}</span>
                        <span className="font-mono">{formatAddress(tx.hash)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.type === 'token' && (
                          <span className="text-[hsl(var(--cyber-blue))]">
                            {tx.tokenValue} {tx.tokenSymbol}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[10px]" 
                          style={{ backgroundColor: `${getNetworkColor(tx.network)}40`, color: getNetworkColor(tx.network) }}>
                          {tx.network}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {/* Transactions list */}
            <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {loading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded" />
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <p className="text-white/60 mb-4">No transactions found</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                      setSelectedNetwork('all');
                    }}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredTransactions.map((tx) => (
                    <div
                      key={tx.hash}
                      className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                        selectedTransaction?.hash === tx.hash ? 'bg-white/10' : ''
                      }`}
                      onClick={() => handleSelectTransaction(tx)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getTransactionTypeIcon(tx.type)}</span>
                          <span className="font-mono text-sm text-white/70">{formatAddress(tx.hash)}</span>
                          
                          <Badge 
                            className={`rounded-full text-[10px] px-1.5 ${
                              tx.status === 'confirmed' 
                                ? 'bg-green-500/20 text-green-500' 
                                : tx.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-500' 
                                  : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">{formatTimestamp(tx.timestamp)}</span>
                          
                          <Badge 
                            className="text-[10px] rounded px-1.5"
                            style={{ 
                              backgroundColor: `${getNetworkColor(tx.network)}40`, 
                              color: getNetworkColor(tx.network) 
                            }}
                          >
                            {tx.network}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-white/50">From</div>
                          <div className="font-mono text-sm truncate text-white/80">{tx.from}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-white/50">To</div>
                          <div className="font-mono text-sm truncate text-white/80">
                            {tx.to || '(Contract Creation)'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {tx.type === 'token' ? (
                            <div className="text-[hsl(var(--cyber-blue))] font-mono">
                              {tx.tokenValue} {tx.tokenSymbol}
                            </div>
                          ) : tx.type === 'cross-chain' ? (
                            <div className="text-[hsl(var(--cyber-pink))] font-mono flex items-center">
                              {tx.tokenValue} {tx.tokenSymbol} 
                              <span className="mx-1">→</span>
                              {tx.destinationNetwork}
                              <span className="ml-1 text-xs text-white/50">via {tx.bridgeName}</span>
                            </div>
                          ) : tx.type === 'contract' ? (
                            <div className="text-[hsl(var(--cyber-purple))] font-mono">
                              {tx.contractMethod && <span className="mr-1">{tx.contractMethod}()</span>}
                              {formatEther(tx.value)} ETH
                            </div>
                          ) : (
                            <div className="text-white/90 font-mono">
                              {formatEther(tx.value)} ETH
                            </div>
                          )}
                        </div>
                        
                        {tx.fee && (
                          <div className="text-xs text-white/50">
                            Fee: {tx.fee} ETH
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Transaction details */}
          <div className="hidden lg:block w-2/5 bg-black/20">
            {selectedTransaction ? (
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-audiowide text-white">Transaction Details</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    Close
                  </Button>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{getTransactionTypeIcon(selectedTransaction.type)}</span>
                    <div>
                      <div className="text-xs text-white/50">Transaction Hash</div>
                      <div className="font-mono text-sm">{selectedTransaction.hash}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-white/50">Status</div>
                      <Badge 
                        className={`rounded-full text-xs px-2 ${
                          selectedTransaction.status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-500' 
                            : selectedTransaction.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500' 
                              : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="text-xs text-white/50">Network</div>
                      <Badge 
                        className="text-xs rounded px-2"
                        style={{ 
                          backgroundColor: `${getNetworkColor(selectedTransaction.network)}40`, 
                          color: getNetworkColor(selectedTransaction.network) 
                        }}
                      >
                        {selectedTransaction.network}
                      </Badge>
                    </div>
                    
                    {selectedTransaction.blockNumber && (
                      <div>
                        <div className="text-xs text-white/50">Block</div>
                        <div className="font-mono text-sm">{selectedTransaction.blockNumber}</div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-xs text-white/50">Timestamp</div>
                      <div className="font-mono text-sm">
                        {new Date(selectedTransaction.timestamp * 1000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Card className="bg-black/30 border-white/10 mb-4 p-4">
                  <h5 className="font-medium text-white/80 mb-3">Transaction Information</h5>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-white/50">From</div>
                      <div className="font-mono text-sm break-all bg-black/20 p-2 rounded">
                        {selectedTransaction.from}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-white/50">To</div>
                      <div className="font-mono text-sm break-all bg-black/20 p-2 rounded">
                        {selectedTransaction.to || '(Contract Creation)'}
                      </div>
                    </div>
                    
                    {selectedTransaction.type === 'token' && (
                      <>
                        <div>
                          <div className="text-xs text-white/50">Token</div>
                          <div className="font-mono text-sm text-[hsl(var(--cyber-blue))]">
                            {selectedTransaction.tokenValue} {selectedTransaction.tokenSymbol}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-white/50">Token Contract</div>
                          <div className="font-mono text-sm break-all bg-black/20 p-2 rounded">
                            {selectedTransaction.tokenAddress}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {selectedTransaction.type === 'cross-chain' && (
                      <>
                        <div>
                          <div className="text-xs text-white/50">Bridge</div>
                          <div className="font-mono text-sm">{selectedTransaction.bridgeName}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-white/50">Source → Destination</div>
                          <div className="font-mono text-sm text-[hsl(var(--cyber-pink))]">
                            {selectedTransaction.network} → {selectedTransaction.destinationNetwork}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-white/50">Token Transfer</div>
                          <div className="font-mono text-sm">
                            {selectedTransaction.tokenValue} {selectedTransaction.tokenSymbol}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {selectedTransaction.type === 'contract' && selectedTransaction.contractMethod && (
                      <div>
                        <div className="text-xs text-white/50">Contract Method</div>
                        <div className="font-mono text-sm text-[hsl(var(--cyber-purple))]">
                          {selectedTransaction.contractMethod}()
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-xs text-white/50">Value</div>
                      <div className="font-mono text-sm">
                        {formatEther(selectedTransaction.value)} ETH
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-white/50">Gas Used</div>
                        <div className="font-mono text-sm">
                          {selectedTransaction.gasUsed?.toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-white/50">Fee</div>
                        <div className="font-mono text-sm">
                          {selectedTransaction.fee} ETH
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="mt-auto">
                  <Button
                    className="w-full bg-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--cyber-blue))/80]"
                    onClick={() => {
                      const explorerUrl = selectedTransaction.network === 'Ethereum' 
                        ? `https://etherscan.io/tx/${selectedTransaction.hash}`
                        : selectedTransaction.network === 'Base'
                          ? `https://basescan.org/tx/${selectedTransaction.hash}`
                          : selectedTransaction.network === 'Optimism'
                            ? `https://optimistic.etherscan.io/tx/${selectedTransaction.hash}`
                            : `https://arbiscan.io/tx/${selectedTransaction.hash}`;
                      
                      window.open(explorerUrl, '_blank');
                    }}
                  >
                    View on {selectedTransaction.network} Explorer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <SLERFAnimatedLogo size={80} interval={5000} />
                <p className="text-white/50 mt-6 mb-3">Select a transaction to view details</p>
                <p className="text-sm text-white/30 max-w-md">
                  Explore real-time blockchain transactions across multiple networks including Ethereum and Base
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBlockchainExplorer;