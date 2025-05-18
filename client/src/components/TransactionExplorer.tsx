import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AnimatedCatLogo from './AnimatedCatLogo';
import { 
  getRecentTransactions, 
  getTransactionDetails, 
  subscribeToNewTransactions,
  BlockchainTransaction
} from '@/lib/blockchain';

interface TransactionExplorerProps {
  maxTransactions?: number;
  showFilters?: boolean;
  liveUpdates?: boolean;
  showDetails?: boolean;
  className?: string;
}

const TransactionExplorer: React.FC<TransactionExplorerProps> = ({
  maxTransactions = 10,
  showFilters = true,
  liveUpdates = true,
  showDetails = true,
  className = ""
}) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<BlockchainTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [networkFilter, setNetworkFilter] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<BlockchainTransaction | null>(null);
  const [isLive, setIsLive] = useState(liveUpdates);
  const transactionsContainerRef = useRef<HTMLDivElement>(null);

  // Load initial transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txs = await getRecentTransactions(maxTransactions, networkFilter || undefined);
        setTransactions(txs);
        setFilteredTransactions(txs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          variant: "destructive",
          title: "Failed to load transactions",
          description: "Could not connect to the blockchain. Please try again."
        });
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [maxTransactions, networkFilter, toast]);

  // Subscribe to new transactions
  useEffect(() => {
    if (!isLive) return;

    const subscription = subscribeToNewTransactions((tx) => {
      setTransactions((prev) => {
        const updated = [tx, ...prev].slice(0, maxTransactions);
        return updated;
      });

      // Play notification sound if enabled
      // const notificationSound = new Audio('/notification.mp3');
      // notificationSound.play().catch(e => console.log('Audio play error:', e));

      // Also show a toast notification for new transactions
      toast({
        title: "New Transaction",
        description: `${tx.type === 'token' ? 'Token' : 'ETH'} transaction detected: ${formatAddress(tx.hash)}`,
        variant: "default",
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLive, maxTransactions, toast]);

  // Apply filters whenever transactions, searchQuery, or typeFilter changes
  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(query) ||
          tx.from.toLowerCase().includes(query) ||
          (tx.to && tx.to.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, typeFilter]);

  // Scroll to top when new transactions are added
  useEffect(() => {
    if (isLive && transactionsContainerRef.current && filteredTransactions.length > 0) {
      transactionsContainerRef.current.scrollTop = 0;
    }
  }, [filteredTransactions.length, isLive]);

  // Handle transaction click
  const handleTransactionClick = async (tx: BlockchainTransaction) => {
    if (!showDetails) return;
    
    try {
      // In a real implementation, we'd fetch detailed info
      // For now, we'll just use the transaction directly
      setSelectedTransaction(tx);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      toast({
        variant: "destructive",
        title: "Failed to load transaction details",
        description: "Could not fetch the details for this transaction."
      });
    }
  };

  // Format utilities
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatValue = (value: string) => {
    // Convert from wei to ETH
    const eth = parseFloat(value) / 1e18;
    return eth.toFixed(eth < 0.0001 ? 8 : 4);
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'token':
        return '🪙'; // Token transfer
      case 'contract':
        return '📜'; // Contract interaction
      case 'transfer':
        return '💸'; // ETH transfer
      default:
        return '🔄'; // Unknown
    }
  };

  const getTransactionStatusColor = (status: string) => {
    return status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500';
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter(null);
  };

  // Toggle live updates
  const toggleLiveUpdates = () => {
    setIsLive((prev) => !prev);
  };

  return (
    <div className={`cyber-card rounded-xl overflow-hidden p-0.5 ${className}`}>
      <div className="bg-black/80 rounded-lg overflow-hidden">
        {/* Header section */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center">
            <AnimatedCatLogo size={40} interval={10000} />
            <h3 className="ml-3 text-xl font-audiowide text-white">Blockchain Explorer</h3>
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
        
        {/* Filter section */}
        {showFilters && (
          <div className="p-4 border-b border-white/10 bg-black/50">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by address or transaction hash"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex bg-black/30 rounded-md overflow-hidden p-0.5 space-x-1">
                  <button 
                    onClick={() => setTypeFilter(null)}
                    className={`px-3 py-1 text-sm rounded ${!typeFilter ? 'bg-[hsl(var(--primary))] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setTypeFilter('transfer')}
                    className={`px-3 py-1 text-sm rounded ${typeFilter === 'transfer' ? 'bg-[hsl(var(--primary))] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    ETH
                  </button>
                  <button 
                    onClick={() => setTypeFilter('token')}
                    className={`px-3 py-1 text-sm rounded ${typeFilter === 'token' ? 'bg-[hsl(var(--primary))] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    Tokens
                  </button>
                  <button 
                    onClick={() => setTypeFilter('contract')}
                    className={`px-3 py-1 text-sm rounded ${typeFilter === 'contract' ? 'bg-[hsl(var(--primary))] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    Contracts
                  </button>
                </div>
                
                {(searchQuery || typeFilter) && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex h-[500px]">
          {/* Transactions list */}
          <div 
            className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            ref={transactionsContainerRef}
          >
            {loading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded" />
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="text-white/60 text-center mb-4">No transactions found</div>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                <AnimatePresence initial={false}>
                  {filteredTransactions.map((tx) => (
                    <motion.div
                      key={tx.hash}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                        selectedTransaction?.hash === tx.hash ? 'bg-white/10' : ''
                      }`}
                      onClick={() => handleTransactionClick(tx)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getTransactionTypeIcon(tx.type)}</span>
                          <span className="font-mono text-sm text-white/70">{formatAddress(tx.hash)}</span>
                          <span className={`w-2 h-2 rounded-full ${getTransactionStatusColor(tx.status)}`}></span>
                        </div>
                        <span className="text-xs text-white/50">{formatTimestamp(tx.timestamp)}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-white/50">From</div>
                          <div className="font-mono text-sm truncate">{tx.from}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-white/50">To</div>
                          <div className="font-mono text-sm truncate">{tx.to || '(Contract Creation)'}</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {tx.type === 'token' ? (
                            <div className="text-[hsl(var(--primary))] font-mono">
                              {tx.tokenValue} {tx.tokenSymbol}
                            </div>
                          ) : (
                            <div className="text-[hsl(var(--accent))] font-mono">
                              {formatValue(tx.value)} ETH
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-white/50">
                          Block #{tx.blockNumber}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Transaction details panel */}
          {showDetails && (
            <div className="w-1/3 border-l border-white/10 bg-black/20 overflow-auto">
              {selectedTransaction ? (
                <div className="p-4">
                  <h4 className="text-lg font-audiowide mb-4">Transaction Details</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-white/50 mb-1">Hash</div>
                      <div className="font-mono text-sm break-all">{selectedTransaction.hash}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-white/50 mb-1">Status</div>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full ${
                            getTransactionStatusColor(selectedTransaction.status)
                          } mr-2`}></span>
                          <span className="capitalize">{selectedTransaction.status}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-white/50 mb-1">Block</div>
                        <div>{selectedTransaction.blockNumber}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-white/50 mb-1">Timestamp</div>
                      <div>{new Date(selectedTransaction.timestamp * 1000).toLocaleString()}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-white/50 mb-1">From</div>
                      <div className="font-mono text-sm break-all">{selectedTransaction.from}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-white/50 mb-1">To</div>
                      <div className="font-mono text-sm break-all">
                        {selectedTransaction.to || '(Contract Creation)'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-white/50 mb-1">Value</div>
                      <div className="text-lg font-mono">
                        {selectedTransaction.type === 'token' ? (
                          <span className="text-[hsl(var(--primary))]">
                            {selectedTransaction.tokenValue} {selectedTransaction.tokenSymbol}
                          </span>
                        ) : (
                          <span className="text-[hsl(var(--accent))]">
                            {formatValue(selectedTransaction.value)} ETH
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-white/50 mb-1">Gas Used</div>
                      <div>{parseInt(selectedTransaction.gasUsed).toLocaleString()}</div>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        onClick={() => window.open(`https://etherscan.io/tx/${selectedTransaction.hash}`, '_blank')}
                        className="w-full border-white/10 text-white hover:bg-white/10"
                      >
                        View on Etherscan
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <div className="text-white/60 text-center mb-2">Select a transaction to view details</div>
                  <AnimatedCatLogo size={80} colors={[
                    'from-[hsl(var(--primary))] to-[hsl(var(--secondary))]',
                  ]} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionExplorer;